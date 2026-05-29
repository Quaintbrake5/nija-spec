# NijaSpec — Product Requirements Document (PRD)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-22  
**Owner:** Founder / Engineering  

---

## 1) Product Summary

NijaSpec is a **spec-as-truth** toolchain that converts human requirements into a canonical technical spec and then enforces that spec via **generated verification tests** (and optional self-healing loops). It is positioned as **trust infrastructure** for Nigerian (and Africa-first) software delivery: measurable alignment between “what was agreed” and “what shipped”.

Primary initial form factor: **CLI + CI integration** (GitHub Actions) with **LLM provider abstraction** and **optional local fallback** (Gemma 4 31B IT) to hedge API volatility and FX risk.

---

## 2) Problem Statement

Teams routinely ship systems with:
- Specs scattered across WhatsApp chats, voice notes, Figma comments, and ad-hoc messages.
- Senior engineer scarcity (“japa” dynamics) → less review bandwidth and increased implementation drift.
- High-cost, high-risk fintech integrations (Paystack/Flutterwave) where API drift and webhook signature errors cause silent revenue loss.
- Client/agency disputes because there’s no deterministic proof that deliverables match the agreed scope.

---

## 3) Target Users & Personas

### P1 — Product Engineering Teams (Core ICP)
- Fintech / e-commerce / logistics teams with production integrations and limited senior review capacity.
- Need: guardrails, regression detection, compliance evidence.

### P2 — Agencies (Secondary ICP)
- Agencies that want **differentiation**: “NijaSpec-verified delivery”.
- Need: milestone acceptance artifacts, standardized specs, fewer disputes.

### P3 — Paying Clients of Agencies (Long-term)
- Non-technical stakeholders who want a **green/red acceptance report**.
- Need: visibility, accountability, “receipt” per milestone.

---

## 4) Goals / Non-Goals

### Goals
- Convert unstructured requirements into a canonical spec with deterministic formatting rules.
- Generate runnable tests that verify alignment against implementation (API contracts, webhook signatures, auth boundaries) for multiple programming languages (JS/TS, Python, Go, Java, C#, PHP).
- Provide an LLM abstraction layer with:
  - multi-provider support,
  - token estimation + cost preview (in NGN),
  - cloud → local fallback.
- CI-native workflow: spec checks run on PRs and on main branch pushes.

### Non-Goals (MVP)
- “Fully autonomous code writing” as a primary value proposition.
- Replacing human product management or architecture review.
- Shipping a hosted multi-tenant dashboard in v0 (optional v1+).

---

## 5) Scope (MVP)

### 5.1 Core CLI Commands
- `nijaspec init` — bootstrap config and sample spec.
- `nijaspec spec from-text` — Phase 1: extract JSON schema from raw input.
- `nijaspec spec compile` — Phase 2: produce canonical `nijaspec.md`.
- `nijaspec generate` — generate tests from `nijaspec.md` (supports multiple languages via --lang flag).
- `nijaspec verify` — run generated tests, summarize pass/fail.
- `nijaspec estimate` — token + NGN cost preview for a run.
- `nijaspec heal` (optional/guarded) — attempt regeneration/patching on failing test output.

### 5.2 Fintech Localizations (MVP)
- Paystack:
  - webhook signature header: `x-paystack-signature`
  - mocked payload templates and signature verification test stubs
- Flutterwave:
  - verification header: `verif-hash`

### 5.3 Prompt Determinism & Governance (MVP)
- Prompt versioning:
  - prompts stored in-repo (git-tracked)
  - each run writes `run-manifest.json` with model + prompt version
- Post-generation validation:
  - static checks: syntax, imports, required assertions, required headers
   - fail-fast if generation is invalid/non-runnable

### 5.4 Language Support (MVP)
- Initial support for JS/TS (Jest/Supertest), Go (testing + httptest), Java (JUnit + REST Assured), C# (xUnit + FluentAssertions), Python (Pytest + Requests), PHP (PHPUnit + Guzzle).
- The `generate` command accepts a `--lang` flag to select the target language/framework.
- Generator interface ensures deterministic template-based output for each language.

---
## 6) Key User Stories (MVP)

- As an engineering lead, I can turn a messy WhatsApp requirements dump into a canonical spec file.
- As a developer, I can generate tests from the spec and run them locally in under 10 minutes.
- As a team, we can block PR merges when the implementation violates the spec.
- As a fintech team, we can detect webhook signature regressions before production.
- As a maintainer, I can switch LLM providers without refactoring core orchestration.

---

## 7) Success Metrics

### Adoption & Activation
- Time-to-first-value (TTFV): spec → first test run ≤ 10 minutes for a sample repo.
- CLI activation: % of installs that run `generate` + `verify` in first day.

### Quality & Reliability
- Generated test runnable rate ≥ 95% (no syntax/import errors).
- Determinism proxy: rerun with same inputs yields stable test structure (within defined tolerance).

### Economics
- Median run cost (NGN) visible **before** executing generation.
- Local fallback availability for ≥ 90% of “cloud outage” simulations.

---

## 8) Risks & Mitigations

- **LLM non-determinism → flaky tests**
  - Mitigate with prompt versioning, schema validation, and minimal output constraints.
- **FX volatility**
  - Mitigate with aggressive token minimization, local fallback, and pricing indexed to USD basket (policy-level).
- **CI security risks (auto-committing from CI)**
  - Default to “no write-back”; provide opt-in self-heal workflow restricted to trusted branches.
- **Behavior gap: teams don’t write specs**
  - Invest in “Chat-to-Spec” wizard and templates; make spec creation the easiest path.

---

## 9) Open Questions

- Is the primary buyer the engineering team or the client-side stakeholder?
- Which ecosystems are priority after Jest: Pytest, PHPUnit, Go test?
- What is the minimal spec format that still yields high-quality test generation?
- What are acceptable limits for self-healing (what can be auto-changed vs must be human-reviewed)?

