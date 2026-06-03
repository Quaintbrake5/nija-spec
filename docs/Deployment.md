# NijaSpec — Deployment & Environments

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-23  

---

## 1) Deployment Philosophy

- MVP ships as **CLI-first** with CI integration; hosted services are optional.
- Treat hosted components as independently deployable units:
  - `apps/web` (static frontend)
  - `apps/api` (FastAPI service)
  - background worker/runners (only when hosted execution is introduced)
- Security first: secrets managed centrally; CI safe-by-default.

---

## 2) Environments

### 2.1 Standard Environments

- **Local** (developer workstation)
- **CI** (GitHub Actions)
- **Staging** (hosted mode)
- **Production** (hosted mode)

### 2.2 Configuration Rules

- All environment config uses explicit env vars (no magic defaults in prod).
- Never store secrets in git.
- Explicit "provider mode" selection:
  - cloud provider (Gemini, etc.) vs optional local provider (Gemma 4 31B IT)

---

## 3) CLI Deployment

### 3.1 Packaging

- Node/TypeScript compiled build output: `dist/`
- Distribution options:
  - npm package (recommended)
  - standalone binaries later (optional)

### 3.2 CLI Config

- Local config file: `nijaspec.config.json` (non-secret settings)
- Secret keys:
  - env vars (e.g., `GEMINI_API_KEY`)
  - never written into the config file

---

## 4) Web Deployment (Optional v1+)

### 4.1 Artifact

- Static build output (`dist/` from Vite)

### 4.2 Hosting

- Any static host is acceptable (keep provider-agnostic).
- If using cookies/sessions with the API, ensure:
  - HTTPS-only
  - correct domain scoping
  - CSRF protections at the API

---

## 5) API Deployment (Optional v1+)

### 5.1 Runtime

- FastAPI behind a reverse proxy / load balancer
- Run with:
  - `uvicorn` for dev
  - `gunicorn`+`uvicorn` worker class for prod (recommended)

### 5.2 Containers

- Build a Docker image for `apps/api`
- Run with:
  - non-root user
  - minimal base image
  - pinned dependencies

### 5.3 Database

- PostgreSQL (managed or self-hosted)
- Migrations via Alembic
- Backups:
  - daily snapshots
  - tested restore procedure

### 5.4 Caching / Rate Limiting

- Redis for:
  - rate limiting
  - short-lived cache
  - job queue coordination (if workers exist)

---

## 6) Secrets Management

### 6.1 Required Secrets (examples)

- LLM provider keys: `GEMINI_API_KEY` (and later equivalents)
- DB: `DATABASE_URL`
- Redis: `REDIS_URL`
- Auth provider secrets (OAuth) if used

### 6.2 Rotation

- Keys must be rotatable without downtime.
- Documented in `Runbooks.md`.

---

## 7) CI/CD Deployment Strategy (Hosted mode)

### 7.1 Build Steps

- Web: lint → typecheck → build
- API: lint → unit tests → container build
- CLI: lint → unit tests → build → publish (main-only)

### 7.2 Releases

- Semantic versioning for CLI.
- Tag releases in git.

---

## 8) Hosted Job Execution (Future)

Do not run untrusted code inside the API process.

When hosted verification is introduced:

- use dedicated workers and isolated runners
- store artifacts in object storage
- limit run concurrency per org/project
