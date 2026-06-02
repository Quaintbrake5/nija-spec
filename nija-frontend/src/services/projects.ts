import apiService from './api';
import type { Project, ProjectWithMetadata, ApiResponse, PaginatedResponse } from '@/types';

export const projectService = {
  async getProjects(organizationId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<ProjectWithMetadata>> {
    const response = await apiService.get<ProjectWithMetadata[]>(
      `/orgs/${organizationId}/projects`,
      { page, pageSize }
    );
    // Note: In real implementation, the API would return paginated data
    return {
      data: response.data,
      total: response.data.length,
      page,
      pageSize,
      totalPages: Math.ceil(response.data.length / pageSize),
    };
  },

  async getProject(projectId: string): Promise<Project> {
    const response = await apiService.get<Project>(`/projects/${projectId}`);
    return response.data;
  },

  async createProject(organizationId: string, data: { name: string; description?: string }): Promise<Project> {
    const response = await apiService.post<Project>(`/orgs/${organizationId}/projects`, data);
    return response.data;
  },

  async updateProject(projectId: string, data: { name?: string; description?: string }): Promise<Project> {
    const response = await apiService.put<Project>(`/projects/${projectId}`, data);
    return response.data;
  },

  async deleteProject(projectId: string): Promise<void> {
    await apiService.delete(`/projects/${projectId}`);
  },

  async getProjectSpecs(projectId: string): Promise<ApiResponse<Array<{ id: string; version: number; createdAt: string }>>> {
    type SpecSummary = { id: string; version: number; createdAt: string };
    const response = await apiService.get<SpecSummary[]>(`/projects/${projectId}/specs`);
    return response;
  },

  async getProjectRuns(projectId: string, page = 1, pageSize = 20): Promise<ApiResponse<Array<{ id: string; status: string; createdAt: string }>>> {
    type RunSummary = { id: string; status: string; createdAt: string };
    const response = await apiService.get<RunSummary[]>(`/projects/${projectId}/runs`, { page, pageSize });
    return response;
  },
};