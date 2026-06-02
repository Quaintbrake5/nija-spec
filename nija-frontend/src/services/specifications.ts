import apiService from './api';
import type { Specification, SpecVersion } from '@/types';

interface SpecDiff {
  additions: number;
  deletions: number;
  changes: Array<{
    type: 'add' | 'delete' | 'unchanged';
    content: string;
    lineNumber: number;
  }>;
}

export const specificationService = {
  async getSpecification(specId: string): Promise<Specification> {
    const response = await apiService.get<Specification>(`/specs/${specId}`);
    return response.data;
  },

  async getSpecVersions(projectId: string): Promise<SpecVersion[]> {
    const response = await apiService.get<SpecVersion[]>(`/projects/${projectId}/specs/versions`);
    return response.data;
  },

  async uploadSpecification(projectId: string, content: string): Promise<Specification> {
    const response = await apiService.post<Specification>('/specs', {
      projectId,
      content,
      source: 'web',
    });
    return response.data;
  },

  async updateSpecification(specId: string, content: string): Promise<Specification> {
    const response = await apiService.put<Specification>(`/specs/${specId}`, { content });
    return response.data;
  },

  async getSpecDiff(specId1: string, specId2: string): Promise<SpecDiff> {
    const response = await apiService.get<SpecDiff>(`/specs/diff`, {
      specId1,
      specId2,
    });
    return response.data;
  },

  async exportEvidencePackage(specId: string): Promise<Blob> {
    const response = await apiService.get(`/specs/${specId}/export`, {}, );
    // Convert to blob for download
    return new Blob([JSON.stringify(response.data)], { type: 'application/json' });
  },

  async getLatestSpec(projectId: string): Promise<Specification | null> {
    try {
      const versions = await this.getSpecVersions(projectId);
      if (versions.length === 0) {
        return null;
      }

      // Get the latest version
      const latestVersion = versions.reduce<SpecVersion>(
        (latest, current) => current.version > latest.version ? current : latest,
        versions[0]
      );

      return this.getSpecification(latestVersion.id);
    } catch {
      return null;
    }
  },
};