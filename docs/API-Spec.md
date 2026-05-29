# NijaSpec — Hosted API Specification (REST + OpenAPI)



**Doc status:** Draft (v0.1)  

**Last updated:** 2026-05-23  



---



## 1) Goals



- Provide a stable, auditable API surface for hosted NijaSpec (orgs/projects/specs/runs/artifacts).

- Make everything OpenAPI-first (FastAPI source-of-truth).

- Keep REST semantics predictable and versioned.



---



## 2) API Style Decisions



- **Protocol:** HTTPS only

- **Format:** JSON (`application/json`)

- **Versioning:** URL versioning: `/api/v1/...`

- **Pagination:** cursor pagination for list endpoints

- **Id format:** UUIDv4 strings

- **Time:** ISO8601 UTC timestamps

- **Errors:** consistent envelope with `code`, `message`, `requestId`



---



## 3) AuthN/AuthZ



### 3.1 Authentication (recommended)

- Hosted UI: OAuth (Google) or magic-link → server issues session tokens

- CLI: Personal Access Tokens (PAT) + scoped API keys (project-scoped)



### 3.2 Authorization

- RBAC per org/project:

  - `OWNER`, `MAINTAINER`, `REVIEWER`, `VIEWER`

- Default-deny on every endpoint.



### 3.3 Headers

- `Authorization: Bearer <token>`

- `X-Request-Id: <uuid>` (optional; server generates if missing)



---



## 4) Core Resources



### 4.1 Organizations



- `GET /api/v1/orgs`

- `POST /api/v1/orgs`

- `GET /api/v1/orgs/{orgId}`

- `PATCH /api/v1/orgs/{orgId}`



Payload shape (example):

```json

{

  "id": "2c2f5f1e-1e3a-4cbe-8aa4-1d2b3c4d5e6f",

  "name": "Acme Fintech",

  "createdAt": "2026-05-23T00:00:00Z"

}

```



### 4.2 Users + Memberships



- `GET /api/v1/me`

- `GET /api/v1/orgs/{orgId}/members`

- `POST /api/v1/orgs/{orgId}/members` (OWNER/MAINTAINER)

- `PATCH /api/v1/orgs/{orgId}/members/{userId}` (role change)

- `DELETE /api/v1/orgs/{orgId}/members/{userId}`



### 4.3 Projects



- `GET /api/v1/orgs/{orgId}/projects`

- `POST /api/v1/orgs/{orgId}/projects`

- `GET /api/v1/projects/{projectId}`

- `PATCH /api/v1/projects/{projectId}`

- `DELETE /api/v1/projects/{projectId}` (soft-delete recommended)



Project fields (example):

```json

{

  "id": "f83b1c1f-0c8e-4f7b-b62c-7e4f2d4a6c7a",

  "orgId": "2c2f5f1e-1e3a-4cbe-8aa4-1d2b3c4d5e6f",

  "name": "payments-api",

  "slug": "payments-api",

  "createdAt": "2026-05-23T00:00:00Z"

}

```



### 4.4 Specs (versioned)



Specs are immutable once created; new versions are new rows.



- `GET /api/v1/projects/{projectId}/specs`

- `POST /api/v1/projects/{projectId}/specs`

- `GET /api/v1/specs/{specId}`



Create spec (example):

```json

{

  "contentMarkdown": "# NijaSpec API Layout\n...",

  "source": "cli",

  "specHash": "sha256:..."

}

```



Response (example):

```json

{

  "id": "c2d6b6d1-6c16-4c9c-b9ef-1b1f6d3f7e55",

  "projectId": "f83b1c1f-0c8e-4f7b-b62c-7e4f2d4a6c7a",

  "version": 3,

  "specHash": "sha256:...",

  "createdAt": "2026-05-23T00:00:00Z"

}

```



### 4.5 Prompt Versions



Prompts are tracked as immutable versions for auditability.



- `GET /api/v1/projects/{projectId}/prompts`

- `POST /api/v1/projects/{projectId}/prompts`

- `GET /api/v1/prompts/{promptVersionId}`



### 4.6 Runs



Run = a generation/verification execution event with attached artifacts + manifest.



- `GET /api/v1/projects/{projectId}/runs`

- `POST /api/v1/projects/{projectId}/runs` (create + enqueue)

- `GET /api/v1/runs/{runId}`

- `POST /api/v1/runs/{runId}/cancel`



Run fields (example):

```json

{

  "id": "e7d4d7a5-9f12-4f58-b1d7-9d6a0f6d4f1c",

  "projectId": "f83b1c1f-0c8e-4f7b-b62c-7e4f2d4a6c7a",

  "specId": "c2d6b6d1-6c16-4c9c-b9ef-1b1f6d3f7e55",

  "promptVersionId": "9a7b6c5d-4e3f-4a1b-9c8d-7e6f5a4b3c2d",

  "providerId": "google-gemini",

  "modelIdentifier": "gemini-2.5-flash",

  "status": "SUCCEEDED",

  "tokenUsage": { "promptTokens": 0, "completionTokens": 0, "totalTokens": 0, "estimatedCostNaira": 0 },

  "createdAt": "2026-05-23T00:00:00Z",

  "completedAt": "2026-05-23T00:01:00Z"

}

```



Status values:

- `QUEUED`, `RUNNING`, `SUCCEEDED`, `FAILED`, `CANCELED`



### 4.7 Artifacts



Artifacts are immutable references to outputs from a run (logs, manifests, generated tests).



- `GET /api/v1/runs/{runId}/artifacts`

- `GET /api/v1/artifacts/{artifactId}`

- `POST /api/v1/artifacts/{artifactId}/download-url` (pre-signed URL)



Artifact fields (example):

```json

{

  "id": "a1b2c3d4-1111-2222-3333-444455556666",

  "runId": "e7d4d7a5-9f12-4f58-b1d7-9d6a0f6d4f1c",

  "kind": "RUN_MANIFEST",

  "contentType": "application/json",

  "sha256": "sha256:...",

  "byteSize": 12345,

  "createdAt": "2026-05-23T00:01:00Z"

}

```



Artifact kind values (initial):

- `RUN_MANIFEST`, `GENERATED_TESTS`, `FAILURE_LOG`, `RAW_OUTPUT` (discouraged), `PATCH_DIFF`



---



## 5) Idempotency & Concurrency



- `POST /api/v1/projects/{projectId}/specs` accepts optional `Idempotency-Key`.

- Run creation should be idempotent by `(projectId, specId, promptVersionId, mode)` with a time window, to prevent duplicate runs from CI retries.



---



## 6) Error Format (example)



```json

{

  "code": "FORBIDDEN",

  "message": "Insufficient role for project",

  "requestId": "d6a2b8b2-7c5a-4d6f-a2df-7a7d3c9e9f6a"

}

```



---



Additional error examples:



```json

{

  "code": "NOT_FOUND",

  "message": "Project not found",

  "requestId": "d6a2b8b2-7c5a-4d6f-a2df-7a7d3c9e9f6b"

}

```



```json

{

  "code": "VALIDATION_ERROR",

  "message": "Spec content is required",

  "requestId": "d6a2b8b2-7c5a-4d6f-a2df-7a7d3c9e9f6c"

}

```



```json

{

  "code": "RATE_LIMIT_EXCEEDED",

  "message": "API rate limit exceeded. Try again later.",

  "requestId": "d6a2b8b2-7c5a-4d6f-a2df-7a7d3c9e9f6d"

}

```



## 7) Security Requirements (API)



- Rate limiting per token + per IP (hosted mode).

- Audit log for: spec access, run creation, artifact downloads.

- No raw secrets stored in specs, prompts, or artifacts.

- Artifact downloads via short-lived pre-signed URLs only.







---

## 8) Query Parameters

The API supports filtering, sorting, and search operations on list endpoints.

### 8.1 Filtering

Use the `filter` parameter to narrow down results. The format follows `{field}:{value}` with support for comparison operators.

Examples:

```http
GET /api/v1/projects?filter=orgId:2c2f5f1e-1e3a-4cbe-8aa4-1d2b3c4d5e6f
```

```http
GET /api/v1/runs?filter=status:SUCCEEDED,providerId:google-gemini
```

Supported operators:

| Operator | Example | Description |
|----------|---------|-------------|
| eq       | `status:eq:SUCCEEDED` | Equal to (default if no operator specified) |
| ne       | `status:ne:FAILED` | Not equal to |
| gt       | `createdAt:gt:2026-05-01T00:00:00Z` | Greater than |
| gte      | `createdAt:gte:2026-05-01T00:00:00Z` | Greater than or equal |
| lt       | `createdAt:lt:2026-06-01T00:00:00Z` | Less than |
| lte      | `createdAt:lte:2026-06-01T00:00:00Z` | Less than or equal |
| like     | `name:like:%api%` | Contains substring (case-insensitive) |

### 8.2 Sorting

Use the `sort` parameter to order results. Prefix with `-` for descending order.

Examples:

```http
GET /api/v1/runs?sort=createdAt
```

```http
GET /api/v1/specs?sort=-createdAt,projectId
```

### 8.3 Search

Use the `search` parameter for full-text search across multiple fields.

Examples:

```http
GET /api/v1/projects?search=payments
```

```http
GET /api/v1/orgs?search=acme&limit=10
```

The search parameter typically searches across name, description, and other relevant text fields.

---
