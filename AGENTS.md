# Agent Guidance for NaijaSpec Repository

## Navigation

- Documentation is organized under docs/ by category:
  - Product & Planning: PRD.md, AppFlow.md, GettingStarted.md, Roadmap.md
  - Engineering: FullStackArchitecture.md, SDLC.md, CI-CD.md, TestingStrategy.md, Security.md, Observability.md, Deployment.md, DataModel.md, API-Spec.md
  - Design: UI-UX.md
  - Diagrams: system-flow.mmd (Mermaid syntax)
- Architecture Decision Records (ADRs) are in docs/ADR/
- The README.md serves as a master index; keep it updated when adding/removing docs.

## Key Starting Points

- New contributors: read docs/GettingStarted.md for a 10-minute walkthrough.
- Product understanding: read docs/PRD.md (Problem Statement, Goals, Success Metrics).
- Technical foundation: read docs/FullStackArchitecture.md, docs/SDLC.md, and NijaSpec_TrustEngine_Architecture.md (core architectural approach).
- API details: see docs/API-Spec.md (endpoints, auth, error format).
- CLI/CI workflows: see docs/AppFlow.md and docs/CI-CD.md.

## Verification & Quality

- Definition of Done: see docs/SDLC.md (Section 5).
- Testing strategy: see docs/TestingStrategy.md (unit, contract, golden tests).
- Security checks: see docs/Security.md (non-negotiable secret handling, CI policy).
- Observability: run manifests are defined in docs/Observability.md.
- Runbooks for incident response: see docs/Runbooks.md.

## Consistency Checks

- Following the Trust Engine pattern, examples should demonstrate separation of reasoning (LLM) and deterministic local processing where applicable.
- All docs should front-matter with Doc status: and Last updated:.
- API examples in API-Spec.md should match JSON schemas implied by the text.
- CLI command examples in AppFlow.md and GettingStarted.md should use `nija-audit` as the binary name.
- Links between docs use relative paths (e.g., ./API-Spec.md).

## Repo-Specific Conventions

- Following Trust Engine principles, LLMs can generate documentation content (including code examples) but ONLY within documentation principles and specifications to avoid hallucination and derailment (spec-driven programming).
- Versioning: docs use draft version numbers (v0.1) in header; no semantic versioning enforced.
- The repo contains runnable TypeScript source code in `src/` and `bin/`.
- When adding a new doc, list it in the appropriate section of README.md.
- Diagrams are Mermaid (*.mmd); edit with a Mermaid previewer.
- Avoid duplicating information: prefer linking to existing docs (e.g., API spec details live in API-Spec.md).

## Common Agent Mistakes to Avoid

- Do not ask LLMs to generate raw, syntactically-perfect code or documentation without clear specifications and separation of concerns.
- Do not conflate LLM reasoning strength with local system's syntactic guarantee — maintain clear separation of phases.
- Do not update README.md manually without preserving the categorized sections.
- Do not modify front-matter dates without reviewing doc content.
- Do not add new top-level folders outside docs/ without consensus (see SDLC for process).
