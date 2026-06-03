# NijaSpec — Data Model (PostgreSQL) + Retention Policy

> **Status: Planned (V1+)** — This data model does not exist yet. The current product is a CLI-only tool.

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-23  

---

## 1) Goals

- Provide a scalable relational model for hosted NijaSpec.
- Keep auditability first-class (who did what, when, with what prompt/model).
- Avoid storing large blobs in Postgres when object storage is a better fit.

---

## 2) Storage Strategy

- **PostgreSQL** stores metadata and immutable references.
- **Object storage** (S3/R2/MinIO) stores artifact payloads (logs, manifests, generated files).
- Postgres stores:
  - `sha256`, byte size, content type, storage key, and access controls.

---

## 3) Tables (Proposed)

### 3.1 `users`

- `id` (uuid, pk)
- `email` (citext, unique)
- `name` (text)
- `avatar_url` (text, nullable)
- `created_at` (timestamptz)

Indexes:

- unique on `email`

### 3.2 `orgs`

- `id` (uuid, pk)
- `name` (text)
- `created_at` (timestamptz)

### 3.3 `org_memberships`

- `org_id` (uuid, fk → orgs.id)
- `user_id` (uuid, fk → users.id)
- `role` (text) — `OWNER|MAINTAINER|REVIEWER|VIEWER`
- `created_at` (timestamptz)

Constraints:

- pk (`org_id`, `user_id`)

### 3.4 `projects`

- `id` (uuid, pk)
- `org_id` (uuid, fk)
- `name` (text)
- `slug` (text) (unique per org)
- `is_deleted` (boolean, default false)
- `created_at` (timestamptz)

Indexes:

- unique (`org_id`, `slug`)

### 3.5 `specs`

Specs are immutable; `version` increments per project.

- `id` (uuid, pk)
- `project_id` (uuid, fk)
- `version` (int)
- `spec_hash` (text) (unique per project)
- `content_markdown` (text) or `content_storage_key` (text)
- `source` (text) — `cli|web|api`
- `created_by_user_id` (uuid, fk → users.id, nullable for CI)
- `created_at` (timestamptz)

Indexes:

- unique (`project_id`, `version`)
- unique (`project_id`, `spec_hash`)

Note:

- For larger specs, prefer object storage (`content_storage_key`) and keep markdown out of Postgres.

### 3.6 `prompt_versions`

Prompts are immutable and auditable.

- `id` (uuid, pk)
- `project_id` (uuid, fk)
- `name` (text) — e.g. `phase1_structuring`
- `version` (text) — semantic or git hash
- `prompt_hash` (text)
- `content` (text) or `content_storage_key` (text)
- `created_by_user_id` (uuid, fk)
- `created_at` (timestamptz)

Indexes:

- (`project_id`, `name`, `version`) unique

### 3.7 `api_tokens` (for CLI)

- `id` (uuid, pk)
- `org_id` (uuid, fk)
- `project_id` (uuid, fk, nullable)
- `name` (text)
- `token_hash` (text) (store hash only)
- `scopes` (text[]) — e.g. `runs:write`, `artifacts:read`
- `expires_at` (timestamptz, nullable)
- `revoked_at` (timestamptz, nullable)
- `created_at` (timestamptz)

Indexes:

- (`org_id`, `project_id`)
- (`token_hash`) unique

### 3.8 `runs`

Runs are append-only; status updates are recorded, but core identity is immutable.

- `id` (uuid, pk)
- `project_id` (uuid, fk)
- `spec_id` (uuid, fk)
- `prompt_version_id` (uuid, fk)
- `triggered_by_user_id` (uuid, fk, nullable)
- `triggered_by` (text) — `cli|web|ci|api`
- `provider_id` (text) — `google-gemini|local-gemma-4-31b-it|...`
- `model_identifier` (text)
- `status` (text) — `QUEUED|RUNNING|SUCCEEDED|FAILED|CANCELED`
- `token_prompt` (int)
- `token_completion` (int)
- `token_total` (int)
- `estimated_cost_naira` (numeric(18,2))
- `started_at` (timestamptz, nullable)
- `completed_at` (timestamptz, nullable)
- `created_at` (timestamptz)

Indexes:

- (`project_id`, `created_at` desc)
- (`spec_id`)
- (`status`)

### 3.9 `run_events` (optional, but recommended)

Audit the status transitions and important milestones.

- `id` (uuid, pk)
- `run_id` (uuid, fk)
- `kind` (text) — `STATUS_CHANGE|ARTIFACT_WRITTEN|PROVIDER_FALLBACK|VALIDATION_FAILED`
- `data_json` (jsonb) — sanitized payload, no secrets
- `created_at` (timestamptz)

Indexes:

- (`run_id`, `created_at`)

### 3.10 `artifacts`

Artifact metadata; payload is stored in object storage.

- `id` (uuid, pk)
- `run_id` (uuid, fk)
- `project_id` (uuid, fk) (denormalize for filtering)
- `kind` (text) — `RUN_MANIFEST|GENERATED_TESTS|FAILURE_LOG|PATCH_DIFF|...`
- `content_type` (text)
- `byte_size` (bigint)
- `sha256` (text)
- `storage_key` (text) — object storage pointer
- `created_at` (timestamptz)

Indexes:

- (`run_id`)
- (`project_id`, `created_at` desc)
- (`sha256`)

---

## 4) Retention Policy (Hosted Mode)

Recommended defaults (configurable per org):

- Runs:
  - keep metadata indefinitely (or 12–24 months)
- Artifacts:
  - keep `RUN_MANIFEST` + `PATCH_DIFF` longer (e.g., 180–365 days)
  - keep raw logs shorter (e.g., 30–90 days)
- Deletion:
  - hard-delete object storage payloads first
  - then delete artifact rows

---

## 5) Scalability Notes

- Partition `runs` and `artifacts` by time if volumes grow (monthly partitions).
- Use object storage lifecycle rules for artifact cleanup.
- Keep `spec_hash` + `prompt_hash` to deduplicate identical content.
