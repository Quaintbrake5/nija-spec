# NijaSpec — Testing Strategy (Draft)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-22  

---

## 1) Philosophy

NijaSpec must prove reliability because it generates enforcement artifacts (tests). Testing focuses on:
- determinism (as much as feasible),
- safety (no secret leakage),
- correctness of compilation and validation steps,
- CI compatibility.

---

## 2) Test Layers

### 2.1 Unit Tests (CLI / packages)
- Spec parser/compiler:
  - raw input → intermediate schema (Phase 1 output validation)
  - intermediate schema → `nijaspec.md` (Phase 2 formatting invariants)
- Token estimator:
  - stable estimates for repeated content
- LLM adapter interface:
  - mock provider returning stable `LLMResponse`
  - fallback logic in `LLMManager`

### 2.2 Contract Tests
- Ensure generated tests always include mandatory checks:
  - webhook signature headers for fintech gateways
  - auth boundaries when specified

### 2.3 Golden File Tests
- Given a fixed input spec, generated output must match a committed snapshot:
  - `nijaspec.md`
  - test scaffold file
- Store prompt versions with snapshots.

### 2.4 Integration Tests (Optional later)
- Run the generated tests against a seeded sample API implementation.
- Validate CI artifacts and run manifests.

---

## 3) Security Tests

- Secret redaction:
  - known patterns (API keys, JWTs, private keys)
  - verify redaction happens before provider call
- Prompt injection resistance (best-effort):
  - ensure system prompts remain enforced
  - ensure “do not exfiltrate secrets” policies are applied

---

## 4) CI Test Matrix (Recommended)

- Node 20 (CLI)
- Python 3.12 (API, if introduced)
- OS: ubuntu-latest for CI baseline

