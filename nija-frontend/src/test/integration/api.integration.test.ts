import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import apiService from '@/services/api';
import { authService } from '@/services/auth';
import { organizationService } from '@/services/organizations';
import { projectService } from '@/services/projects';
import { runsService } from '@/services/runs';
import { specificationService } from '@/services/specifications';

vi.mock('axios', () => {
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
    defaults: { headers: { common: {} } },
  };
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

const mockedAxios = axios as any;
const axiosInstance = mockedAxios.create();

describe('API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    apiService.clearAccessToken();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('ApiService Base Client', () => {
    it('should attach authorization header when token is set', async () => {
      const token = 'test-token';
      apiService.setAccessToken(token);

      // We need to trigger the request interceptor.
      // Since we mocked axios.create, we need to capture the request interceptor callback.
      const requestInterceptor = axiosInstance.interceptors.request.use.mock.calls[0][0];
      const config = { headers: {} } as any;
      const resultConfig = requestInterceptor(config);

      expect(resultConfig.headers.Authorization).toBe(`Bearer ${token}`);
    });

    it('should normalize error responses into ApiError', async () => {
      const errorResponse = {
        response: {
          status: 400,
          data: { message: 'Invalid request', code: 'BAD_REQUEST', details: { field: 'name' } },
        },
      };
      axiosInstance.get.mockRejectedValue(errorResponse);

      try {
        await apiService.get('/test');
      } catch (error: any) {
        expect(error).toEqual({
          message: 'Invalid request',
          code: 'BAD_REQUEST',
          details: { field: 'name' },
        });
      }
    });

    it('should handle network errors', async () => {
      const networkError = {
        request: {},
      };
      axiosInstance.get.mockRejectedValue(networkError);

      try {
        await apiService.get('/test');
      } catch (error: any) {
        expect(error).toEqual({
          message: 'Network error - please check your connection',
          code: 'NETWORK_ERROR',
        });
      }
    });

    it('should attempt to refresh token on 401 Unauthorized', async () => {
      const originalRequest = { url: '/protected', headers: {} };
      const error401 = {
        response: { status: 401 },
        config: originalRequest,
      };

      localStorage.setItem('refreshToken', 'mock-refresh-token');

      // Mock refresh response
      axiosInstance.post.mockImplementation((url: string) => {
        if (url === '/auth/refresh') {
          return Promise.resolve({
            data: {
              accessToken: 'new-access-token',
              refreshToken: 'new-refresh-token'
            },
          });
        }
        return Promise.reject(error401);
      });

      // Mock the final retried request
      axiosInstance.mockImplementationOnce((config: any) => {
        if (config.url === '/protected' && config.headers.Authorization === 'Bearer new-access-token') {
          return Promise.resolve({ data: { data: 'success' } });
        }
        return Promise.reject(new Error('Unexpected request'));
      });

      const responseInterceptor = axiosInstance.interceptors.response.use.mock.calls[0][1];
      const result = await responseInterceptor(error401);

      expect(localStorage.getItem('refreshToken')).toBe('new-refresh-token');
      expect(result).toBeDefined();
    });
  });

  describe('AuthService', () => {
    it('should handle Google callback and store tokens', async () => {
      const mockTokens = {
        accessToken: 'at',
        refreshToken: 'rt',
        user: { id: 'u1', email: 'test@example.com', name: 'Test User' },
      };
      axiosInstance.post.mockResolvedValue({ data: { data: mockTokens } });

      const result = await authService.handleGoogleCallback('code123');

      expect(result).toEqual(mockTokens);
      expect(localStorage.getItem('refreshToken')).toBe('rt');
    });

    it('should fetch current user', async () => {
      const mockUser = { id: 'u1', email: 'test@example.com', name: 'Test User' };
      axiosInstance.get.mockResolvedValue({ data: { data: mockUser } });

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(axiosInstance.get).toHaveBeenCalledWith('/auth/me', undefined);
    });

    it('should clear tokens on logout', async () => {
      axiosInstance.post.mockResolvedValue({ data: { data: {} } });

      await authService.logout();

      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  describe('OrganizationService', () => {
    it('should fetch organizations', async () => {
      const mockOrgs = [{ id: 'o1', name: 'Org 1' }];
      axiosInstance.get.mockResolvedValue({ data: { data: mockOrgs } });

      const result = await organizationService.getOrganizations();

      expect(result).toEqual(mockOrgs);
      expect(axiosInstance.get).toHaveBeenCalledWith('/orgs', undefined);
    });

    it('should create an organization', async () => {
      const mockOrg = { id: 'o1', name: 'Org 1' };
      axiosInstance.post.mockResolvedValue({ data: { data: mockOrg } });

      const result = await organizationService.createOrganization({ name: 'Org 1' });

      expect(result).toEqual(mockOrg);
      expect(axiosInstance.post).toHaveBeenCalledWith('/orgs', { name: 'Org 1' });
    });
  });

  describe('ProjectService', () => {
    it('should fetch projects and transform to PaginatedResponse', async () => {
      const mockProjects = [{ id: 'p1', name: 'Proj 1' }];
      axiosInstance.get.mockResolvedValue({ data: { data: mockProjects } });

      const result = await projectService.getProjects('o1', 1, 20);

      expect(result).toEqual({
        data: mockProjects,
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(axiosInstance.get).toHaveBeenCalledWith('/orgs/o1/projects', { params: { page: 1, pageSize: 20 } });
    });

    it('should create a project', async () => {
      const mockProject = { id: 'p1', name: 'Proj 1', description: 'Desc' };
      axiosInstance.post.mockResolvedValue({ data: { data: mockProject } });

      const result = await projectService.createProject('o1', { name: 'Proj 1', description: 'Desc' });

      expect(result).toEqual(mockProject);
      expect(axiosInstance.post).toHaveBeenCalledWith('/orgs/o1/projects', { name: 'Proj 1', description: 'Desc' });
    });
  });

  describe('RunsService', () => {
    it('should fetch runs and transform to PaginatedResponse', async () => {
      const mockRuns = [{ id: 'r1', status: 'completed' }];
      axiosInstance.get.mockResolvedValue({ data: { data: mockRuns } });

      const result = await runsService.getRuns('p1', { status: 'completed' });

      expect(result).toEqual({
        data: mockRuns,
        total: 1,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      });
      expect(axiosInstance.get).toHaveBeenCalledWith('/projects/p1/runs', { params: { page: 1, pageSize: 20, status: 'completed' } });
    });

    it('should trigger a run', async () => {
      const mockRun = { id: 'r1', status: 'queued' };
      axiosInstance.post.mockResolvedValue({ data: { data: mockRun } });

      const result = await runsService.triggerRun('p1', 's1', { providerId: 'prov1' });

      expect(result).toEqual(mockRun);
      expect(axiosInstance.post).toHaveBeenCalledWith('/runs', {
        projectId: 'p1',
        specId: 's1',
        triggeredBy: 'web',
        providerId: 'prov1',
      });
    });
  });

  describe('SpecificationService', () => {
    it('should upload a specification', async () => {
      const mockSpec = { id: 's1', content: 'content' };
      axiosInstance.post.mockResolvedValue({ data: { data: mockSpec } });

      const result = await specificationService.uploadSpecification('p1', 'content');

      expect(result).toEqual(mockSpec);
      expect(axiosInstance.post).toHaveBeenCalledWith('/specs', {
        projectId: 'p1',
        content: 'content',
        source: 'web',
      });
    });

    it('should get spec versions', async () => {
      const mockVersions = [{ id: 's1', version: 1 }];
      axiosInstance.get.mockResolvedValue({ data: { data: mockVersions } });

      const result = await specificationService.getSpecVersions('p1');

      expect(result).toEqual(mockVersions);
      expect(axiosInstance.get).toHaveBeenCalledWith('/projects/p1/specs/versions', undefined);
    });
  });
});
