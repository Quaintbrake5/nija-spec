# NijaSpec — Software Development Life Cycle (SDLC)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-23  

---

## 1) Purpose

This SDLC defines how NijaSpec is built and shipped as a high-trust engineering product (not “vibe-coded”). It governs:

- planning (PRDs, ADRs),
- implementation standards,
- security and quality gates,
- release and operations,
- scalability decisions (including load balancers) for hosted mode.

---

## 2) Lifecycle Stages

### Stage A — Discovery (Problem → Scope)

Inputs:

- user interviews, support tickets, internal findings
Outputs:
- problem statement
- initial acceptance criteria
- identified risks (security, cost, determinism)

Exit criteria:

- scope is bounded and testable

### Stage B — Requirements (PRD)

Inputs:

- Discovery outputs
Outputs:
- PRD update or new PRD section
- success metrics + non-goals

Exit criteria:

- PRD has measurable acceptance criteria

### Stage C — Architecture (ADR)

Inputs:

- PRD requirements
Outputs:
- ADR(s) for major decisions (API style, storage, security posture, CI permissions, job execution isolation)

Exit criteria:

- ADR accepted (even if “draft accepted”) before coding starts for structural changes

### Stage D — Design (UI/UX where applicable)

Inputs:

- PRD/ADR decisions
Outputs:
- UI/UX spec updates
- component/token updates (CSS3 tokens; no Tailwind dependency)

Exit criteria:

- flows and states defined; accessibility constraints noted

### Stage E — Implementation

Inputs:

- PRD + ADR + design constraints
Outputs:
- code changes + docs + tests

Exit criteria:

- passes local checks and CI gates

### Stage F — Verification (CI + Evidence)

Inputs:

- PR changes
Outputs:
- green CI checks
- artifacts (run manifests, logs, generated tests when applicable)

Exit criteria:

- “Definition of Done” satisfied

### Stage G — Release

Inputs:

- merged changes on `main`
Outputs:
- version bump (SemVer), tag, changelog
- published CLI package (when packaging exists)

Exit criteria:

- release notes + rollback plan exist

### Stage H — Operate (Runbooks + Observability)

Inputs:

- production incidents, performance, cost signals
Outputs:
- runbook updates, postmortems, SLO adjustments

Exit criteria:

- root causes addressed with preventive controls

---

## 3) Work Item Types

- **Feature:** user-visible capability with acceptance criteria.
- **Bug:** regression or incorrect behavior with reproduction steps.
- **Security fix:** vulnerability or policy violation (priority escalation).
- **Tech debt:** refactors, reliability improvements, determinism hardening.
- **Docs:** documentation-only change (must still meet clarity and correctness standards).

---

## 4) Definition of Ready (DoR)

A work item is Ready when it has:

- clear acceptance criteria (pass/fail)
- scope boundaries and non-goals
- security notes (secret handling, CI permissions impact, data retention impact)
- test plan (unit/contract/golden/integration as applicable)
- observability impact noted (new metrics/log fields/manifest fields)

---

## 5) Definition of Done (DoD)

A work item is Done when:

- code compiles and passes all relevant tests locally and in CI
- docs updated (PRD/ADR/UI/UX/etc.) where behavior/architecture changes
- security checklist completed (no secrets logged/sent; permissions safe; validation gates present)
- run manifests/artifacts remain non-sensitive by default
- release notes updated if the change is user-facing

---

## 6) Branching & Change Control

### 6.1 Branching

- `main` is protected.
- Use short-lived feature branches.

### 6.2 Pull Requests

Every change ships via PR with:

- a summary of behavior change
- risk assessment (security/cost/determinism)
- test evidence (what was run)

---

## 7) Mandatory Quality Gates

### 7.1 CI gates (baseline)

- lint
- typecheck
- unit tests

### 7.2 NijaSpec-specific gates

- prompt versioning and manifest provenance present for generation-related changes
- post-generation validation must exist for any generator output
- token estimation must be surfaced before cost-incurring runs (where applicable)

---

## 8) Security Gates (Non-Negotiable)

- Secret redaction runs before any LLM-provider call.
- No raw prompts or raw provider outputs logged by default.
- CI workflows are **safe-by-default**:
  - PRs do not get write permissions
  - PR workflows do not push commits
  - “self-heal writeback” is opt-in and restricted to trusted branches/triggers
- Dependency lockfiles are enforced.

Reference:

- `C:\Users\DELL\OneDrive\Documents\NaijaSpec\docs\Security.md`

---

## 9) Testing Gates (How tests fit the SDLC)

### 9.1 Unit tests

Required for:

- spec parser/compiler logic
- token estimator
- provider adapters (mocked)
- fallback logic

### 9.2 Contract tests

Required for:

- fintech gateway invariants (signature headers, validation rules)
- auth boundary enforcement when specified

### 9.3 Golden tests

Required for:

- deterministic outputs from fixed inputs (spec → generated files snapshots)

Reference:

- `C:\Users\DELL\OneDrive\Documents\NaijaSpec\docs\TestingStrategy.md`

---

## 10) Release Management

### 10.1 Versioning

- CLI: SemVer
  - MAJOR: breaking CLI behavior/spec format changes
  - MINOR: new commands/features
  - PATCH: fixes and internal improvements

### 10.2 Rollback

- Hosted mode (future): redeploy previous container image/tag.
- CLI: publish hotfix patch; document migration notes for breaking changes.

---

## 11) Observability Requirements

Every run should be diagnosable via:

- run manifests (structured)
- sanitized logs
- correlation IDs (`runId`, `requestId`)

Reference:

- `C:\Users\DELL\OneDrive\Documents\NaijaSpec\docs\Observability.md`

---

## 12) Scalability & Load Balancers (Hosted Mode)

### 12.1 When load balancers are required

Load balancers become relevant when:

- you run a hosted API with multiple concurrent users,
- you need horizontal scaling (multiple API instances),
- you need safe TLS termination + health checks + controlled ingress.

They are **not** required for CLI-first usage.

### 12.2 Baseline hosted architecture (scalable)

- **Load balancer / reverse proxy** in front of the API:
  - TLS termination
  - routing
  - health checks
  - rate limiting/WAF (either here or via managed edge)
- **Stateless FastAPI instances** behind the load balancer (horizontal scale).
- **PostgreSQL** for authoritative data (orgs/projects/specs/runs).
- **Redis** for rate limiting and job coordination (when workers exist).
- **Object storage** for artifacts (logs/manifests/generated files).
- **Workers + isolated runners** for any untrusted code execution (future).

### 12.3 SDLC requirement before scaling hosted mode

Before production hosted rollout:

- staging environment exists
- SLOs defined
- alerting exists
- runbooks cover outages, rotations, backups, restores

---

## 13) Governance: What requires an ADR

Write an ADR for:

- spec format changes that affect generated outputs
- provider strategy changes (pricing, routing, fallback behavior)
- CI permission model changes
- hosted execution / runner isolation design
- data retention changes
