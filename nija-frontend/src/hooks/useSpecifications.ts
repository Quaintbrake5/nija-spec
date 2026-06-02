import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { specificationService } from '@/services';
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

const QUERY_KEY = 'specifications';

export function useSpecification(specId: string) {
  return useQuery<Specification, Error>({
    queryKey: [QUERY_KEY, specId],
    queryFn: () => specificationService.getSpecification(specId),
    enabled: !!specId,
  });
}

export function useSpecVersions(projectId: string) {
  return useQuery<SpecVersion[], Error>({
    queryKey: [QUERY_KEY, 'versions', projectId],
    queryFn: () => specificationService.getSpecVersions(projectId),
    enabled: !!projectId,
  });
}

export function useLatestSpec(projectId: string) {
  return useQuery<Specification | null, Error>({
    queryKey: [QUERY_KEY, 'latest', projectId],
    queryFn: () => specificationService.getLatestSpec(projectId),
    enabled: !!projectId,
  });
}

export function useUploadSpecification(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<Specification, Error, string>({
    mutationFn: (content) => specificationService.uploadSpecification(projectId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'versions', projectId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'latest', projectId] });
    },
  });
}

export function useUpdateSpecification(specId: string, projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<Specification, Error, string>({
    mutationFn: (content) => specificationService.updateSpecification(specId, content),
    onSuccess: (updatedSpec) => {
      queryClient.setQueryData([QUERY_KEY, specId], updatedSpec);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'versions', projectId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, 'latest', projectId] });
    },
  });
}

export function useSpecDiff(specId1: string, specId2: string) {
  return useQuery<SpecDiff, Error>({
    queryKey: [QUERY_KEY, 'diff', specId1, specId2],
    queryFn: () => specificationService.getSpecDiff(specId1, specId2),
    enabled: !!specId1 && !!specId2,
  });
}

export function useExportEvidencePackage() {
  return useMutation<Blob, Error, string>({
    mutationFn: (specId) => specificationService.exportEvidencePackage(specId),
  });
}
