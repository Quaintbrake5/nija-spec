import apiService from './api';
import type { Organization } from '@/types';

interface CreateOrganizationData {
  name: string;
}

interface OrganizationMember {
  userId: string;
  role: string;
  joinedAt: string;
}

export const organizationService = {
  async getOrganizations(): Promise<Organization[]> {
    const response = await apiService.get<Organization[]>('/orgs');
    return response.data;
  },

  async createOrganization(data: CreateOrganizationData): Promise<Organization> {
    const response = await apiService.post<Organization>('/orgs', data);
    return response.data;
  },

  async getOrganization(orgId: string): Promise<Organization> {
    const response = await apiService.get<Organization>(`/orgs/${orgId}`);
    return response.data;
  },

  async updateOrganization(orgId: string, data: { name?: string }): Promise<Organization> {
    const response = await apiService.put<Organization>(`/orgs/${orgId}`, data);
    return response.data;
  },

  async deleteOrganization(orgId: string): Promise<void> {
    await apiService.delete(`/orgs/${orgId}`);
  },

  async getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
    const response = await apiService.get<OrganizationMember[]>(`/orgs/${orgId}/members`);
    return response.data;
  },

  async addOrganizationMember(
    orgId: string,
    userId: string,
    role: string
  ): Promise<void> {
    await apiService.post(`/orgs/${orgId}/members`, { userId, role });
  },

  async removeOrganizationMember(orgId: string, userId: string): Promise<void> {
    await apiService.delete(`/orgs/${orgId}/members/${userId}`);
  },

  async updateMemberRole(orgId: string, userId: string, role: string): Promise<void> {
    await apiService.put(`/orgs/${orgId}/members/${userId}`, { role });
  },

  // Set current organization in localStorage
  setCurrentOrganization(orgId: string): void {
    localStorage.setItem('currentOrganizationId', orgId);
  },

  getCurrentOrganization(): string | null {
    return localStorage.getItem('currentOrganizationId');
  },
};