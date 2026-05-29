# NijaSpec — Full Stack Architecture (Scalable Baseline)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-22  

---

## 1) Architectural Positioning

NijaSpec ships as a **CLI-first** product with CI integration. A hosted web app is optional and should not be required for the core value (spec → tests → verification).

To keep the project “startup-grade” (not brittle), treat the system as **three separable products**:

1. **CLI (Node/TypeScript)** — spec compilation, LLM orchestration, test generation, verification.
2. **Web (React + Vite + CSS3)** — dashboard UX (optional v1+).
3. **API (FastAPI)** — auth, org/project management, run history, billing hooks (optional v1+).

---

## 2) Suggested Repository Structure (Monorepo)

```
/
  apps/
    web/                 # Vite + React + TS + CSS3
    api/                 # FastAPI (Python)
    cli/                 # Node + TS CLI (core orchestration)
  packages/
    spec/                # Spec parser/compiler + schemas (TS)
    llm/                 # Provider adapters + cost engine (TS)
    shared/              # Shared types, util
    generators/          # Language-specific test generators
  docs/
  .github/
```

Rationale:
- CLI is best kept in TS due to existing adapter/interface design and LLM SDK ecosystem.
- FastAPI is used for a future hosted product without forcing it into the MVP.

---

## 3) API Style Recommendation

### Default: REST + OpenAPI (recommended)
- FastAPI natively generates OpenAPI.
- Stable for tooling, CI checks, and contract testing.
- Matches the “spec as contract” concept well.

### Optional later: GraphQL (selective)
- Only if the dashboard requires complex querying across runs/specs/projects.
- Keep REST for auth, billing, webhooks, and command execution endpoints.

---

## 4) Data Model (Hosted Mode, Optional)

### Primary entities
- `orgs`
- `users`
- `projects`
- `specs` (versions)
- `runs` (generation + verification runs)
- `artifacts` (generated tests, logs, manifests)
- `prompt_versions`

### Database
- **PostgreSQL** (recommended)
  - strong consistency, relational audit trail, good for reporting.

### Migrations
- Alembic for FastAPI service.

---

## 5) Authentication & Authorization

### Auth (hosted mode)
- OAuth + email login (e.g., Google) OR passwordless magic link.
- Session strategy:
  - short-lived access token + refresh token rotation
- Store refresh token hashes only.

### Authorization
- RBAC per org/project:
  - `OWNER`, `MAINTAINER`, `REVIEWER`, `VIEWER`
- Default-deny across all endpoints.

### CLI Authentication (hosted mode)
- Device-code flow or API tokens scoped per project.

---

## 6) Caching & Performance

### CLI
- Local caching of:
  - token estimates (by content hash)
  - intermediate schemas
  - prompt templates
  - run manifests

### API (hosted mode)
- Redis for:
  - rate limiting
  - short-lived run status caching
  - job coordination

---

## 7) Job Execution (Hosted Mode)

Do **not** run untrusted code in the API service process.

Recommended approach:
- Dedicated worker(s) + sandboxed runners:
  - containerized jobs (Kubernetes / Nomad later)
  - or a dedicated “runner” service
- Queue:
  - Redis queue (RQ/Celery) for MVP
  - migrate to Kafka/NATS later if needed

---

## 8) Security Posture (Baseline)

### LLM Safety
- Never send secrets in prompts.
- Redact known secret patterns before transmitting.
- Require explicit user opt-in before uploading repo files.

### CI Safety
- Default to read-only permissions in PR workflows.
- No “auto-commit back to PR branch” unless restricted to trusted branches/users.

### Supply Chain
- Lockfiles enforced (`package-lock.json` / `pnpm-lock.yaml`).
- Dependabot enabled (later).

### API Hardening (hosted mode)
- Rate limiting per token and per IP.
- Audit logging for spec/run access.
- Strict CORS, CSRF protections (for cookie flows).

