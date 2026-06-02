// User and Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Organization types
export type OrganizationRole = 'OWNER' | 'MAINTAINER' | 'REVIEWER' | 'VIEWER';

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  role: OrganizationRole;
}

// Project types
export interface Project {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface ProjectWithMetadata extends Project {
  latestSpecVersion?: number;
  lastRunStatus?: RunStatus;
  failingEndpointsCount: number;
}

// Specification types
export interface Specification {
  id: string;
  projectId: string;
  version: number;
  specHash: string;
  contentMarkdown: string;
  source: 'cli' | 'web' | 'api';
  createdByUserId?: string;
  createdAt: string;
}

export interface SpecVersion {
  id: string;
  version: number;
  createdAt: string;
  specHash: string;
}

// Run types
export type RunStatus = 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'CANCELED';
export type RunTrigger = 'cli' | 'web' | 'ci' | 'api';

export interface Run {
  id: string;
  projectId: string;
  specId: string;
  promptVersionId: string;
  triggeredByUserId?: string;
  triggeredBy: RunTrigger;
  providerId: string;
  modelIdentifier: string;
  status: RunStatus;
  tokenPrompt: number;
  tokenCompletion: number;
  tokenTotal: number;
  estimatedCostNaira: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface RunWithMetadata extends Run {
  specVersion: number;
  specHash: string;
  passedChecks: number;
  failedChecks: number;
  totalChecks: number;
}

// Artifact types
export type ArtifactKind =
  | 'RUN_MANIFEST'
  | 'GENERATED_TESTS'
  | 'FAILURE_LOG'
  | 'PATCH_DIFF'
  | 'COMPLIANCE_REPORT';

export interface Artifact {
  id: string;
  runId: string;
  projectId: string;
  kind: ArtifactKind;
  contentType: string;
  byteSize: number;
  sha256: string;
  storageKey: string;
  createdAt: string;
}

// Check result types
export interface CheckResult {
  id: string;
  ruleId: string;
  framework: string;
  article: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  details?: string;
}

export interface RunResults {
  runId: string;
  checks: CheckResult[];
  summary: {
    passed: number;
    failed: number;
    warnings: number;
    total: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Form types
export interface LoginFormData {
  email: string;
  password?: string;
  magicLink?: boolean;
}

export interface ProjectFormData {
  name: string;
  description?: string;
}

export interface SpecUploadFormData {
  content: string;
  projectId: string;
}