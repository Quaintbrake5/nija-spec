export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  AUTH_CALLBACK: '/auth/callback',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:projectId',
  SPECS: '/projects/:projectId/specs',
  SPEC_DETAIL: '/projects/:projectId/specs/:specId',
  RUNS: '/projects/:projectId/runs',
  RUN_DETAIL: '/projects/:projectId/runs/:runId',
  ALL_RUNS: '/runs',
  SETTINGS: '/settings',
  NOT_FOUND: '*',
} as const;

export const ROUTE_PARAMS = {
  PROJECT_ID: ':projectId',
  SPEC_ID: ':specId',
  RUN_ID: ':runId',
} as const;

export const buildPath = {
  projectDetail: (projectId: string) => `/projects/${projectId}`,
  specs: (projectId: string) => `/projects/${projectId}/specs`,
  specDetail: (projectId: string, specId: string) =>
    `/projects/${projectId}/specs/${specId}`,
  runs: (projectId: string) => `/projects/${projectId}/runs`,
  runDetail: (projectId: string, runId: string) =>
    `/projects/${projectId}/runs/${runId}`,
} as const;
