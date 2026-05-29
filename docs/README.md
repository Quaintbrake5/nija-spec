# NaijaSpec — Documentation Index

**Project:** NaijaSpec / nija-audit v1.0.0
**Last updated:** 2026-05-29
**Status:** Early prototype — functional `check` pipeline, documentation-heavy

---

## What Is NaijaSpec?

NaijaSpec is a **Nigeria-first Compliance-as-Code architectural auditing engine**. It reads a Markdown-based architecture specification, validates it against Nigerian regulatory frameworks (NDPA, CBN Cybersecurity Framework, SEC), and produces deterministic gap analysis reports, remediation patches, and integration test scaffolding.

**Core principle — the Trust Engine:** LLMs output structured JSON only (reasoning). Local deterministic code generates template-based code only (syntax). Never mix the two. This eliminates LLM hallucination risk in generated output.

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 0: Iron Gate (Deterministic)                         │
│  Markdown Parse → Credential Sanitize → Header Validation   │
├─────────────────────────────────────────────────────────────┤
│  Phase 1: Local Semantic Extraction                         │
│  Ollama/Qwen (JSON-mode) ←── 3-strike RetryLoop            │
│  (or --skip-llm → MockExtractor)                            │
├─────────────────────────────────────────────────────────────┤
│  Phase 2: Compliance Gap Analysis                           │
│  AJV Schema Validation → Breach Detection Matrix            │
├─────────────────────────────────────────────────────────────┤
│  Phase 3: Dual Enforcement                                  │
│  Hard Reject (exit 1) + Remediation Patches + Test Scripts  │
└─────────────────────────────────────────────────────────────┘
```

**Pipeline command:** `npm run check -- <spec.md> [--skip-llm]`

---

## Source Code Map

```
bin/nija.ts                              CLI entry point — orchestrates the full pipeline
│
├── src/parser/mdParser.ts               Markdown AST lexer (line splitter)
├── src/parser/sanitizer.ts              Credential/secret redaction (regex-based)
├── src/parser/headerValidator.ts        Required section enforcement (# Infrastructure, etc.)
│
├── src/orchestrator/localModel.ts       Ollama/Qwen JSON-mode HTTP handler
├── src/orchestrator/retryLoop.ts        3-strike circuit breaker for LLM output
├── src/orchestrator/mockExtractor.ts    Deterministic offline extractor (no LLM)
│
├── src/engine/compliance.ts             AJV schema validation engine
├── src/engine/breachDetector.ts         Breach Detection Matrix (NDPA/CBN/SEC rules)
│
├── src/remediation/patchGenerator.ts    Template-based Markdown patch output
└── src/remediation/testGenerator.ts     Deterministic Jest test scaffolding
```

---

## Documentation

### Product & Planning

| Doc | Description |
|-----|-------------|
| [PRD.md](./PRD.md) | Product Requirements — target users, MVP goals, CLI commands, success metrics, risks |
| [AppFlow.md](./AppFlow.md) | CLI and CI workflow documentation — first run, chat-to-spec wizard, self-heal loops |
| [GettingStarted.md](./GettingStarted.md) | 10-minute contributor walkthrough — prerequisites, setup, basic commands |
| [Roadmap.md](./Roadmap.md) | Milestone plan — v0 (MVP), v0.1 (Determinism), v0.2 (Generator Interface), v1 (Hosted) |

### Engineering

| Doc | Description |
|-----|-------------|
| [FullStackArchitecture.md](./FullStackArchitecture.md) | Scalable baseline — monorepo structure, REST+OpenAPI, PostgreSQL, OAuth/RBAC |
| [SDLC.md](./SDLC.md) | Software Development Life Cycle — 8 stages, quality gates, security gates, release management |
| [API-Spec.md](./API-Spec.md) | REST API specification — auth, resources, pagination, error format, idempotency |
| [DataModel.md](./DataModel.md) | PostgreSQL schema — 10 tables (users, orgs, projects, specs, runs, artifacts, etc.) |
| [CI-CD.md](./CI-CD.md) | GitHub Actions workflows — PR gates, main branch, self-heal in CI |
| [TestingStrategy.md](./TestingStrategy.md) | Test layers — unit, contract, golden file, integration, security tests |
| [Security.md](./Security.md) | Threat model, secret handling, LLM hardening, supply-chain controls |
| [Observability.md](./Observability.md) | Run manifests, correlation IDs, metrics, OpenTelemetry tracing, SLOs |
| [Deployment.md](./Deployment.md) | Deployment philosophy — CLI packaging, web/API deployment, secrets management |
| [tech-stack.md](./tech-stack.md) | Tech stack summary — TypeScript, AJV, Ollama, React, FastAPI, PostgreSQL |
| [Runbooks.md](./Runbooks.md) | Incident playbooks — LLM outage, token spike, secret leakage, CI misconfig |

### Architecture Decision Records

| Doc | Description |
|-----|-------------|
| [ADR/0001-foundation-architecture.md](./ADR/0001-foundation-architecture.md) | CLI-first, LLM adapter abstraction, monorepo, REST+OpenAPI, safe-by-default CI |

### Design

| Doc | Description |
|-----|-------------|
| [UI-UX.md](./UI-UX.md) | Web dashboard UX — key screens, CSS component system, WCAG AA accessibility |

### Diagrams

| Doc | Description |
|-----|-------------|
| [diagrams/system-flow.mmd](./diagrams/system-flow.mmd) | Mermaid flowchart — raw requirements through structuring, generation, verification, self-heal |

### Source Inputs (Original Analysis Documents)

| Doc | Description |
|-----|-------------|
| [source/NijaSpec_Analysis.md](./source/NijaSpec_Analysis.md) | Strategic analysis — market thesis, technical assessment, GTM, pricing, PMF score (7.5/10) |
| [source/NijaSpec_DeepBlueprint.md](./source/NijaSpec_DeepBlueprint.md) | Realist stress-test — 5 plot twists, 4 roadblocks, revised PMF (7/10) |
| [source/NijaSpec-Technical-Architecture-and-System-Engineering-Specs.md](./source/NijaSpec-Technical-Architecture-and-System-Engineering-Specs.md) | Engineering spec — LLMProvider interface, adapter pattern, CI pipeline blueprint |

### Standalone Architecture Docs (Root)

| Doc | Description |
|-----|-------------|
| [../NijaSpec_TrustEngine_Architecture.md](../NijaSpec_TrustEngine_Architecture.md) | Trust Engine deep-dive — why raw LLM code gen fails, the JSON/template inversion, economic analysis |
| [../NijaSpec_MasterBlueprint_v3.md](../NijaSpec_MasterBlueprint_v3.md) | Master blueprint — evolution from NijaSpec to nija-audit, architecture, roadmap, pricing, risks |

---

## Key Design Patterns

| Pattern | Purpose |
|---------|---------|
| **Trust Engine** | LLMs reason (JSON), local code compiles (templates). Never mix. |
| **Iron Gate** | Pre-AI deterministic validation. Specs must pass structural checks before any LLM call. |
| **Breach Detection Matrix** | Rules-based regulatory checking. Each rule maps to a framework article (NDPA 2.6.3, CBN 4.2, etc.) |
| **3-Strike Choke Point** | Circuit breaker for LLM output. 3 failures = pipeline halt, not silent corruption. |
| **Deterministic Compilation** | Patches and tests come from templates, not LLM output. Guarantees syntactic correctness. |
| **Adapter Pattern** | LLMProvider interface with Gemini/Ollama adapters and fallback routing (documented, partially implemented). |

---

## Quick Start

```bash
# Prerequisites: Node.js v18+
npm install

# Run with mock extractor (no Ollama needed)
npm run check -- test-spec.md --skip-llm

# Run with local Ollama (requires qwen2.5:7b)
npm run check -- test-spec.md
```

---

## Known Gaps

| Area | Status |
|------|--------|
| Test suite | None — no unit, integration, or contract tests for the tool itself |
| `axios` dependency | Used in `localModel.ts` but missing from `package.json` |
| Schema files | `schemas/` directory empty — compliance rules are inline in `bin/nija.ts` |
| Template files | `templates/` directory empty — patches/tests use hardcoded strings |
| CI/CD workflows | `.github/workflows/` empty — documented but not implemented |
| Build pipeline | No `build` script — `tsconfig.json` outputs to `dist/` but no compile step |
| LLMProvider abstraction | Documented in ADR/specs but only `LocalModel` class exists |
| Config file support | Docs reference `.nija-config.json` but no config loading is implemented |
