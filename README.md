# NaijaSpec — Documentation Index

**Project:** NaijaSpec / nija-audit v1.0.0
**Last updated:** 2026-05-30
**Status:** Functional CLI engine — 6-breach detection, template remediation, 65 passing tests

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

**Pipeline command:** `npm run check -- <spec.md> [--skip-llm] [--endpoint URL] [--model NAME]`

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
| [PRD.md](docs/PRD.md) | Product Requirements — target users, MVP goals, CLI commands, success metrics, risks |
| [AppFlow.md](docs/AppFlow.md) | CLI and CI workflow documentation — first run, chat-to-spec wizard, self-heal loops |
| [GettingStarted.md](docs/GettingStarted.md) | 10-minute contributor walkthrough — prerequisites, setup, basic commands |
| [Roadmap.md](docs/Roadmap.md) | Milestone plan — v0 (MVP), v0.1 (Determinism), v0.2 (Generator Interface), v1 (Hosted) |

### Engineering

| Doc | Description |
|-----|-------------|
| [FullStackArchitecture.md](docs/FullStackArchitecture.md) | Scalable baseline — monorepo structure, REST+OpenAPI, PostgreSQL, OAuth/RBAC |
| [SDLC.md](docs/SDLC.md) | Software Development Life Cycle — 8 stages, quality gates, security gates, release management |
| [API-Spec.md](docs/API-Spec.md) | REST API specification — auth, resources, pagination, error format, idempotency |
| [DataModel.md](docs/DataModel.md) | PostgreSQL schema — 10 tables (users, orgs, projects, specs, runs, artifacts, etc.) |
| [CI-CD.md](docs/CI-CD.md) | GitHub Actions workflows — PR gates, main branch, self-heal in CI |
| [TestingStrategy.md](docs/TestingStrategy.md) | Test layers — unit, contract, golden file, integration, security tests |
| [Security.md](docs/Security.md) | Threat model, secret handling, LLM hardening, supply-chain controls |
| [Observability.md](docs/Observability.md) | Run manifests, correlation IDs, metrics, OpenTelemetry tracing, SLOs |
| [Deployment.md](docs/Deployment.md) | Deployment philosophy — CLI packaging, web/API deployment, secrets management |
| [tech-stack.md](docs/tech-stack.md) | Tech stack summary — TypeScript, AJV, Ollama, React, FastAPI, PostgreSQL |
| [Runbooks.md](docs/Runbooks.md) | Incident playbooks — LLM outage, token spike, secret leakage, CI misconfig |

### Architecture Decision Records

| Doc | Description |
|-----|-------------|
| [ADR/0001-foundation-architecture.md](docs/ADR/0001-foundation-architecture.md) | CLI-first, LLM adapter abstraction, monorepo, REST+OpenAPI, safe-by-default CI |

### Design

| Doc | Description |
|-----|-------------|
| [UI-UX.md](docs/UI-UX.md) | Web dashboard UX — key screens, CSS component system, WCAG AA accessibility |

### Diagrams

| Doc | Description |
|-----|-------------|
| [diagrams/system-flow.mmd](docs/diagrams/system-flow.mmd) | Mermaid flowchart — raw requirements through structuring, generation, verification, self-heal |

### Source Inputs (Root-Level)

| Doc | Description |
|-----|-------------|
| [NijaSpec_Analysis.md](./NijaSpec_Analysis.md) | Strategic analysis — market thesis, technical assessment, GTM, pricing, PMF score (7.5/10) |
| [NijaSpec_DeepBlueprint.md](./NijaSpec_DeepBlueprint.md) | Realist stress-test — 5 plot twists, 4 roadblocks, revised PMF (7/10) |
| [NijaSpec-Technical-Architecture-and-System-Engineering-Specs.md](./NijaSpec-Technical-Architecture-and-System-Engineering-Specs.md) | Engineering spec — LLMProvider interface, adapter pattern, CI pipeline blueprint |

### Standalone Architecture Docs (Root)

| Doc | Description |
|-----|-------------|
| [NijaSpec_TrustEngine_Architecture.md](./NijaSpec_TrustEngine_Architecture.md) | Trust Engine deep-dive — why raw LLM code gen fails, the JSON/template inversion, economic analysis |
| [NijaSpec_MasterBlueprint_v3.md](./NijaSpec_MasterBlueprint_v3.md) | Master blueprint — evolution from NijaSpec to nija-audit, architecture, roadmap, pricing, risks |

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

# Run with custom Ollama endpoint/model
npm run check -- test-spec.md --endpoint http://localhost:11434/api/generate --model qwen2.5:7b
```

### CLI Options

| Flag | Description | Default |
|------|-------------|---------|
| `--skip-llm` | Use deterministic mock extractor | — |
| `--endpoint URL` | Ollama endpoint | `http://localhost:11434/api/generate` |
| `--model NAME` | Ollama model name | `qwen2.5:7b` |
| `--help, -h` | Show help | — |
| `--version, -v` | Show version | — |

---

## Known Gaps

| Area | Status |
|------|--------|
| Template files | `templates/` directory exists but is empty — patches/tests use hardcoded strings in TypeScript |
| LLMProvider abstraction | ADR documents adapter pattern — only `LocalModel` (Ollama) and `MockExtractor` exist |
| Config file support | Docs reference `.nija-config.json` but no config loading is implemented |
| Ollama configuration | Endpoint and model are configurable via CLI flags but not via config file |
| Gemini/cloud LLM | Trust Engine Architecture describes Gemini integration — not implemented |
| Hosted mode | FullStackArchitecture describes FastAPI backend + PostgreSQL — not implemented |
| Web dashboard | UI-UX.md describes React dashboard — not implemented |

