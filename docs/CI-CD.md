# NijaSpec — CI/CD Documentation (GitHub Actions)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-22  

---

## 1) CI/CD Objectives

- Prevent spec drift by running NijaSpec verification on every PR.
- Keep workflows safe-by-default (no write permissions on untrusted PRs).
- Produce auditable artifacts (run manifest, generated tests, failure logs).
- Support a monorepo:
  - `apps/web` (Vite + React)
  - `apps/api` (FastAPI)
  - `apps/cli` (Node + TypeScript)

---

## 2) Workflow Overview

### 2.1 Pull Request CI (default)

Runs on `pull_request`:

- install dependencies (Node and Python)
- lint / typecheck / unit tests
- run `nija-audit estimate` (cost preview) as an informational step
- run `nija-audit generate` (optional if committed artifacts aren’t used)
- run `nija-audit verify`
- upload artifacts

Security posture:

- `permissions: read-all` (or tighter)
- never pushes commits back to the branch

### 2.2 Main Branch CI

Runs on `push` to `main`:

- same checks as PR
- optional:
  - publish CLI package
  - build/push docker image for API
  - deploy web/app (when hosting exists)

---

## 3) Secrets & Configuration

### 3.1 Required Secrets (if using cloud LLMs in CI)

- `GEMINI_API_KEY` (or provider equivalent)

Recommendation:

- CI should be able to run without cloud keys by using:
  - local adapters (not available in GitHub runners), or
  - “verification-only mode” where generated tests are committed and CI only runs them.

### 3.2 Artifact Retention

Store artifacts for traceability:

- `.nija-audit/run-manifest.json`
- generated tests (if generated in CI)
- failure logs / structured summaries

---

## 4) Self-Healing in CI (Opt-in, Restricted)

Auto-modifying code from CI is high risk.

If you want “self-healing”:

- only allow it on:
  - trusted branches (not forks)
  - manually triggered workflows (`workflow_dispatch`)
- require human review before merge

Recommended pattern:

- CI generates a patch diff artifact instead of pushing commits.

---

## 5) Suggested GitHub Actions Blueprint (Safe-by-Default)

Use as a starting point once the monorepo structure exists.

```yaml
name: CI

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

permissions: read-all

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      # Install Node deps (example; adapt to your package manager / workspace)
      - name: Install CLI deps
        run: |
          cd apps/cli
          npm ci

      - name: Build CLI
        run: |
          cd apps/cli
          npm run build

      # Optional: verify spec alignment (verification-only mode is recommended for PRs)
      - name: Verify spec
        env:
          GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: |
          cd apps/cli
          node dist/cli.js verify --spec ../../nija-audit.md
```
