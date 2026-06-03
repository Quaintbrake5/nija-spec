# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Backend Development

- Build: `npm run build`
- Dev mode: `npm run dev` (runs ts-node bin/nija.ts)
- Test: `npm test` (runs all Jest tests)
- Test single file: `npm test -- <path-to-file>`
- Test with coverage: `npm run test:coverage`
- Type check: `npm run typecheck`
- Lint: `npm run lint` (equivalent to tsc --noEmit)
- Initialize project: `nija-audit init`
- Run compliance check: `nija-audit generate <spec.md> --skip-llm`
- Verify generated tests: `nija-audit verify`
- Estimate tokens: `nija-audit estimate <spec.md>`
- Show help: `nija-audit --help`

### Frontend Development

- Dev server: `npm run dev` (from nija-frontend directory)
- Build for production: `npm run build` (from nija-frontend directory)
- Preview production build: `npm run preview` (from nija-frontend directory)
- Run tests: `npm test` (from nija-frontend directory)
- Run tests with coverage: `npm run test:coverage` (from nija-frontend directory)
- Run tests with UI: `npm run test:ui` (from nija-frontend directory)
- Lint code: `npm run lint` (from nija-frontend directory)
- Format code: `npm run format` (from nija-frontend directory)
- Type check: `npm run type-check` (from nija-frontend directory)

## Architecture & Structure

### High-Level Design: The Trust Engine

NijaSpec follows the **Trust Engine** pattern to ensure deterministic and syntactically correct code generation:

1. **Iron Gate**: Parse Markdown, sanitize credentials, validate required sections.
2. **Local Semantic Extraction**: Gemini or MockExtractor (offline/CI) extracts structured JSON.
3. **Compliance Gap Analysis**: AJV schema validation + Breach Detection Matrix (NDPA/CBN rules).
4. **Remediation**: Template-based patches and test scaffolding written to `.nija/patches/`.

### Project Structure

```
bin/nija.ts                              CLI entry point — orchestrates the full pipeline
src/
  parser/                                Markdown parsing, sanitization, header validation
  orchestrator/                          LLM integration (LocalModel, MockExtractor, RetryLoop)
  engine/                                Compliance validation and breach detection
  remediation/                           Patch and test generation from templates
  generators/                            Generator interface and language registry
templates/
  patches/                               Breach-specific remediation templates (.md)
  tests/                                 Jest/TypeScript test templates (.ts)
  tests-python/                          PyTest/Python test templates (.py)
schemas/                                 JSON schemas for compliance data and breach rules
nija-frontend/                           React-based web dashboard
  src/
    components/
      layout/                            Layout components (Sidebar, Topbar, MainLayout)
      ui/                                Reusable UI primitives (Button, Input, etc.)
      dashboard/                         Dashboard-specific components
      specs/                             Specification viewing components
      runs/                              Run history components
      auth/                              Authentication components
    hooks/                               Custom React hooks
    utils/                               Utility functions
    services/                            API service clients
    stores/                              Context providers
    types/                               TypeScript type definitions
    styles/                              CSS files and design tokens
    routes/                              Route definitions
```

### Tech Stack

- **Backend CLI**: TypeScript, Node.js, Jest, AJV (schema validation)
- **Backend LLMs**: Ollama/Qwen (local), MockExtractor (offline/CI), Gemini (cloud) — all via LLMProvider interface with fallback
- **Backend Testing**: Jest with ts-jest
- **Frontend**: React 19 with TypeScript, Vite, TanStack Query, React Router v6, React Hook Form + Zod, Axios, CSS Variables, Vitest + React Testing Library
