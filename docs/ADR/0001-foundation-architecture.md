# ADR 0001 — Foundation Architecture (CLI-first, Scalable Baseline)

**Status:** Accepted (draft)  
**Date:** 2026-05-23  

---

## Context

NijaSpec must:

- enforce spec-to-implementation alignment via generated verification tests,
- remain resilient to vendor model changes and FX volatility,
- avoid “vibe-coded” architecture that collapses under growth,
- support both local-first usage and a future hosted product.

---

## Decision

1. **CLI-first product** is the primary value delivery mechanism.
2. **LLM provider abstraction** uses a strict adapter interface (`LLMProvider`) with cost estimation and fallback support.
3. **Monorepo structure** is used to enable a clean separation of:
   - `apps/cli` (Node + TypeScript)
   - `apps/web` (Vite + React + TypeScript + CSS3)
   - `apps/api` (Python + FastAPI) for hosted mode later
4. **API style:** REST + OpenAPI is the default for hosted mode; GraphQL is deferred unless clearly needed.
5. **CI policy:** safe-by-default, with no auto-commit/self-heal writeback in untrusted contexts.

---

## Consequences

- The CLI can ship value immediately without forcing hosted infrastructure.
- The provider adapter boundary reduces rework when Gemini pricing/models change or a different vendor is introduced.
- Hosted mode can be added incrementally without rewriting the CLI core.
- CI workflows remain secure and reduce supply-chain/permission risk.

---

## Alternatives Considered

- Hosted-first dashboard: rejected for MVP due to operational overhead and security surface area.
- GraphQL-first API: rejected due to complexity and weaker contract-testing ergonomics versus OpenAPI.
- Single-language everything: rejected because CLI + provider SDK ecosystem is strongest in Node/TS, while hosted API ergonomics and security controls are strong in FastAPI.
