# Agent Guidance for NaijaSpec Repository

## Essential Commands

- **Core workflow**: `npm run check -- <spec.md> [--skip-llm]` - validates architecture spec against Nigerian regulations
- **Development**: `npm run dev` - runs CLI with ts-node for immediate feedback
- **Testing**: `npm test` - runs Jest test suite
- **Type checking**: `npm run typecheck` - equivalent to `tsc --noEmit`
- **Building**: `npm run build` - compiles TypeScript to dist/
- **Linting**: `npm run lint` - runs typecheck (no separate ESLint)

## Key Architecture Points

- **Trust Engine Pattern**: Critical - LLMs only output structured JSON (reasoning), local deterministic code handles syntax/templates. Never mix LLM output with code generation.
- **Pipeline Phases**: 
  1. Iron Gate (deterministic validation)
  2. Local Semantic Extraction (LLM with 3-strike retry or --skip-llm for mock)
  3. Compliance Gap Analysis (AJV validation)
  4. Dual Enforcement (hard exit + patches + test scripts)
- **Entry Point**: `bin/nija.ts` orchestrates the full pipeline
- **Binaries**: After build, `nija` command available (points to `dist/bin/nija.js`)

## Important Conventions

- **Documentation**: All docs under `docs/` by category; README.md is master index
- **CLI Examples**: Use `nija-audit` as binary name in documentation (per existing AGENTS.md)
- **Doc Front-matter**: All documentation should include `Doc status:` and `Last updated:` headers
- **Links**: Use relative paths between docs (e.g., `./API-Spec.md`)
- **Diagrams**: Mermaid syntax (*.mmd files in docs/diagrams/)
- **Avoid Duplication**: Prefer linking to existing docs (e.g., API spec details in API-Spec.md) rather than copying content
- **README Updates**: When adding a new doc, list it in the appropriate section of README.md

## Common Pitfalls to Avoid

- **LLM Usage**: Never ask LLMs to generate syntactically-perfect code - violates Trust Engine principle
- **README Updates**: Don't modify categorized sections manually without preserving structure
- **Front-matter Dates**: Only update after reviewing content changes
- **Top-level Folders**: Don't add outside `docs/` without consensus (see SDLC process)
- **Config Priority**: CLI flags override `.nija-config.json` settings

## CI/CD Information

- **GitHub Actions**: Runs on Ubuntu with Node.js 18.x and 20.x
- **Workflow Order**: lint → typecheck → test → build → upload artifacts
- **Artifacts**: `.nija/` directory contents retained for 7 days
- **Triggers**: Push and PR to master branch

## Project Structure Highlights

- **Source**: TypeScript in `src/` and `bin/`
- **Templates**: Handlebar templates in `templates/` for remediation
- **Schemas**: JSON schemas in `schemas/` for AJV validation
- **Data**: `.nijaspec/` directory for runtime data
