import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { runsService } from '@/services';
import type { Run, RunWithMetadata, Artifact, RunResults, PaginatedResponse, RunStatus } from '@/types';

const QUERY_KEY = 'runs';

interface RunTimelineEntry {
  status: RunStatus;
  timestamp: string;
  message?: string;
}

export function useRuns(
  projectId: string,
  filters?: { status?: RunStatus; page?: number; pageSize?: number }
) {
  return useQuery<PaginatedResponse<RunWithMetadata>, Error>({
    queryKey: [QUERY_KEY, projectId, filters],
    queryFn: () => runsService.getRuns(projectId, filters),
    enabled: !!projectId,
  });
}

export function useRun(runId: string) {
  return useQuery<RunWithMetadata, Error>({
    queryKey: [QUERY_KEY, runId],
    queryFn: () => runsService.getRun(runId),
    enabled: !!runId,
  });
}

export function useRunResults(runId: string) {
  return useQuery<RunResults, Error>({
    queryKey: [QUERY_KEY, runId, 'results'],
    queryFn: () => runsService.getRunResults(runId),
    enabled: !!runId,
  });
}

export function useRunArtifacts(runId: string) {
  return useQuery<Artifact[], Error>({
    queryKey: [QUERY_KEY, runId, 'artifacts'],
    queryFn: () => runsService.getRunArtifacts(runId),
    enabled: !!runId,
  });
}

export function useRunTimeline(runId: string) {
  return useQuery<RunTimelineEntry[], Error>({
    queryKey: [QUERY_KEY, runId, 'timeline'],
    queryFn: () => runsService.getRunTimeline(runId),
    enabled: !!runId,
  });
}

export function useDownloadArtifact() {
  return useMutation<Blob, Error, string>({
    mutationFn: (artifactId) => runsService.downloadArtifact(artifactId),
  });
}

export function useTriggerRun(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation<Run, Error, { specId: string; providerId?: string; modelIdentifier?: string }>({
    mutationFn: ({ specId, providerId, modelIdentifier }) =>
      runsService.triggerRun(projectId, specId, { providerId, modelIdentifier }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, projectId] });
    },
  });
}

export function useCancelRun() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (runId) => runsService.cancelRun(runId),
    onSuccess: (_data, runId) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, runId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
