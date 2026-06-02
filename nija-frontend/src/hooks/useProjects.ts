import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '@/services';
import type { Project, ProjectWithMetadata, PaginatedResponse, ApiResponse } from '@/types';

const QUERY_KEY = 'projects';

export function useProjects(organizationId: string, page = 1, pageSize = 20) {
  return useQuery<PaginatedResponse<ProjectWithMetadata>, Error>({
    queryKey: [QUERY_KEY, organizationId, page, pageSize],
    queryFn: () => projectService.getProjects(organizationId, page, pageSize),
    enabled: !!organizationId,
  });
}

export function useProject(projectId: string) {
  return useQuery<Project, Error>({
    queryKey: [QUERY_KEY, projectId],
    queryFn: () => projectService.getProject(projectId),
    enabled: !!projectId,
  });
}

export function useCreateProject(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, { name: string; description?: string }>({
    mutationFn: (data) => projectService.createProject(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, organizationId] });
    },
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, { name?: string; description?: string }>({
    mutationFn: (data) => projectService.updateProject(projectId, data),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData([QUERY_KEY, projectId], updatedProject);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, updatedProject.organizationId] });
    },
  });
}

export function useDeleteProject(organizationId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (projectId) => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, organizationId] });
    },
  });
}

export function useProjectSpecs(projectId: string) {
  return useQuery<ApiResponse<Array<{ id: string; version: number; createdAt: string }>>, Error>({
    queryKey: [QUERY_KEY, projectId, 'specs'],
    queryFn: () => projectService.getProjectSpecs(projectId),
    enabled: !!projectId,
  });
}

export function useProjectRuns(projectId: string, page = 1, pageSize = 20) {
  return useQuery<ApiResponse<Array<{ id: string; status: string; createdAt: string }>>, Error>({
    queryKey: [QUERY_KEY, projectId, 'runs', page, pageSize],
    queryFn: () => projectService.getProjectRuns(projectId, page, pageSize),
    enabled: !!projectId,
  });
}
