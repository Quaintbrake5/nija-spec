# NijaSpec — Roadmap

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-30  

---

## 1) Principles

- Ship the CLI value loop first: **spec → tests → verify**.
- Reduce LLM brittleness with validation, prompt versioning, and deterministic constraints.
- Keep hosted mode optional until demand is proven.

---

## 2) Milestones

### v0 (MVP) — CLI + CI Verification ✅ Complete (2026-05-30)
Deliverables:
- `LLMProvider` adapters + fallback manager
- token estimate + NGN cost preview
- Chat-to-Spec wizard (Phase 1 JSON → Phase 2 canonical markdown)
- Jest test generation + verification runner
- run manifest + artifacts on disk
- Framework expansion: initial generators for Go, Java, C#, Python, PHP (in addition to Jest/TS)

Exit criteria:
- sample repo can onboard in < 10 minutes
- generated tests runnable rate ≥ 95% on internal sample sets
- at least 6 frameworks supported end-to-end with fixtures (JS/TS, Go, Java, C#, Python, PHP)

### v0.1 — Determinism & Safety Hardening ✅ Complete (2026-05-30)
Deliverables:
- prompt versioning + manifest provenance
- post-generation validation layer (syntax + invariants)
- redaction pipeline (no secrets sent or logged)
- safe CI templates (no writeback)

Exit criteria:
- repeated runs with same inputs produce stable output within tolerance
- no secrets appear in logs/artifacts in test suite

### v0.2 — Generator Interface Design ✅ Complete (2026-05-30)
Deliverables:
- Define standard generator interface: generate(semanticMap: JSON): string, validate(code: string): boolean
- Implement registry of supported languages and their corresponding generators
- Create deterministic templates for the Tier 1 languages (as listed in v0)
- Ensure the CLI accepts a --lang or --framework flag

Exit criteria:
- Generator interface is implemented and usable for at least one language
- CLI can generate tests for a specified language using the interface

> **Note:** v0 was published to npm as `nija-audit@1.0.0` on 2026-05-30.

### v1 (Optional) — Hosted Mode (API + Web) 🔜 Not Started
Deliverables:
- org/project/spec/run management (API)
- UI report viewer + artifact download
- secure job execution architecture (workers + isolated runners)
- billing hooks (optional)

Exit criteria:
- at least 10 active teams requesting hosted audit trails
- clear compliance/audit use-cases requiring persistence

---

## 3) Discovery & Validation Tasks (Parallel)

- 5 customer discovery interviews:
  - internal engineering teams
  - agency clients (payers) to validate “proof-of-work” demand
- collect anonymized specs to build benchmark suites for determinism/runnability metrics

