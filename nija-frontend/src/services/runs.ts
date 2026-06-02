import apiService from './api';
import type { Run, RunWithMetadata, Artifact, RunResults, PaginatedResponse, RunStatus } from '@/types';

export const runsService = {
  async getRuns(
    projectId: string,
    filters?: { status?: RunStatus; page?: number; pageSize?: number }
  ): Promise<PaginatedResponse<RunWithMetadata>> {
    const { status, page = 1, pageSize = 20 } = filters || {};
    const params: Record<string, unknown> = { page, pageSize };
    if (status) {
      params.status = status;
    }

    const response = await apiService.get<RunWithMetadata[]>(
      `/projects/${projectId}/runs`,
      params
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

  async getRun(runId: string): Promise<RunWithMetadata> {
    const response = await apiService.get<RunWithMetadata>(`/runs/${runId}`);
    return response.data;
  },

  async getRunResults(runId: string): Promise<RunResults> {
    const response = await apiService.get<RunResults>(`/runs/${runId}/results`);
    return response.data;
  },

  async getRunArtifacts(runId: string): Promise<Artifact[]> {
    const response = await apiService.get<Artifact[]>(`/runs/${runId}/artifacts`);
    return response.data;
  },

  async downloadArtifact(artifactId: string): Promise<Blob> {
    const response = await apiService.get(`/artifacts/${artifactId}/download`);
    // Convert to blob for download
    return new Blob([JSON.stringify(response.data)], { type: 'application/json' });
  },

  async triggerRun(
    projectId: string,
    specId: string,
    options?: {
      providerId?: string;
      modelIdentifier?: string;
    }
  ): Promise<Run> {
    const response = await apiService.post<Run>('/runs', {
      projectId,
      specId,
      triggeredBy: 'web',
      ...options,
    });
    return response.data;
  },

  async cancelRun(runId: string): Promise<void> {
    await apiService.post(`/runs/${runId}/cancel`);
  },

  async getRunTimeline(runId: string): Promise<Array<{
    status: RunStatus;
    timestamp: string;
    message?: string;
  }>> {
    type TimelineEntry = { status: RunStatus; timestamp: string; message?: string };
    const response = await apiService.get<TimelineEntry[]>(`/runs/${runId}/timeline`);
    return response.data;
  },
};