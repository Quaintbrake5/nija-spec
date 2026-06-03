# NijaSpec — Security Specification

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-23  

---

## 1) Security Objectives

- Prevent secret exfiltration (local, CI, and LLM-provider paths).
- Make CI safe-by-default (no write permissions, no untrusted auto-modifications).
- Ensure generated artifacts (tests, specs, logs) are non-sensitive and reviewable.
- Provide a security posture that scales into a hosted product without rewrites.

---

## 2) Threat Model (Concise)

### Assets

- Source code + proprietary logic
- API keys (Gemini/OpenAI/etc.), auth tokens, webhook secrets
- User/org data (hosted mode)
- Run artifacts: manifests, logs, generated tests

### Adversaries

- Malicious contributor via PR (especially from forks)
- Supply-chain attacks via dependencies
- Prompt injection / data exfiltration via spec inputs
- Misconfiguration (over-permissive CI tokens, logging secrets)

### Trust Boundaries

- Local machine boundary (developer workstation)
- CI runner boundary (GitHub-hosted runner)
- LLM provider boundary (external API, USD-billed)
- Local model boundary (Gemma 4 31B IT) — still treat as untrusted process
- Hosted boundary (FastAPI + DB + cache), if/when added

---

## 3) Secret Handling Policy (Non-Negotiable)

### 3.1 Never send secrets to LLMs

Before any provider call, run a redaction pass over all prompt payloads:

- `.env`-style keys
- JWT-like patterns
- private keys (PEM blocks)
- known provider key formats (best-effort)

Behavior:

- Replace with placeholders (e.g., `REDACTED_SECRET_1`)
- Emit a redaction report in the run manifest (counts only; no values)

### 3.2 Least exposure

Default CLI behavior should:

- avoid uploading whole repos
- require explicit include paths / globs for file context
- warn when sending large blocks of code

### 3.3 Storage rules

- Do not persist raw prompts containing user code unless explicitly requested.
- If storing run artifacts, encrypt-at-rest in hosted mode.

---

## 4) CI Security Policy

### 4.1 Default permissions

- PR workflows: `permissions: read-all` (or stricter).
- Never push commits or write back to PR branches by default.

### 4.2 Self-heal restrictions

If “self-heal” exists in CI:

- only allow on trusted branches + non-fork PRs
- prefer artifacting a patch diff rather than pushing commits
- require manual approval or `workflow_dispatch` trigger

### 4.3 Secrets in CI

- Never expose secrets to forked PRs.
- When secrets are required, run generation only on:
  - push to `main`, or
  - trusted internal PRs

---

## 5) LLM Interaction Hardening

### 5.1 Prompt versioning

Prompts must be:

- git-tracked
- referenced by immutable version in `run-manifest.json`

### 5.2 Prompt injection resistance (best-effort)

- System prompts are always enforced.
- User inputs are treated as untrusted.
- Output must be validated against schemas and invariants (fail-fast).

### 5.3 Output validation

Before writing generated code to disk:

- ensure it parses (TypeScript parser / ESLint in CLI pipeline later)
- ensure required security assertions exist for fintech endpoints
- ensure no filesystem/network calls are introduced in generated tests unless explicitly allowed

---

## 6) Dependency / Supply-Chain Controls

- Lockfiles required and enforced in CI.
- Pin critical dependencies where possible.
- Add automated dependency update tooling (Dependabot) when repo is public.
- Consider SBOM generation later (CycloneDX) for enterprise buyers.

---

## 7) Hosted Mode Security (Future)

### 7.1 Authentication

- Prefer OAuth or passwordless magic links over passwords.
- Token rotation and short-lived access tokens.

### 7.2 Authorization

- RBAC enforced at the API boundary for every resource.
- Default deny.

### 7.3 Job execution isolation

- Never execute arbitrary user code inside the API server process.
- Use isolated runners (containers/microVM) for any verification that runs untrusted code.

---

## 8) Auditability

Minimum audit fields for each run:

- who triggered it (user/CI actor)
- prompt version + model identifier
- spec version hash
- redaction summary (counts only)
- artifacts produced (paths + hashes)
