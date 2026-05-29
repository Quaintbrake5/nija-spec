# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm test` (runs all Jest tests)
- Test single file: `npm test -- <path-to-file>`

### CLI Tooling (NijaSpec)
- Initialize project: `nijaspec init`
- Create spec from text: `nijaspec spec from-text --input <file> --output <file>`
- Generate verification tests: `nijaspec generate --input <file> --output <dir> --framework <framework>`
- Run verification: `nijaspec verify --tests <dir>`
- Estimate costs: `nijaspec estimate --spec <file>`

## Architecture & Structure

### High-Level Design: The Trust Engine
NijaSpec follows the **Trust Engine** pattern to ensure deterministic and syntactically correct code generation:
1. **Cloud Reasoning**: LLMs (e.g., Gemini) extract semantic meaning from requirements into structured JSON.
2. **Local Deterministic Processing**: A local template engine converts JSON into verifiable test code.
3. **Verification**: The generated tests are executed against the implementation to ensure alignment.

### Project Structure (Monorepo)
The project is organized as a monorepo to separate the core orchestration from optional hosted components:
- `apps/cli/`: Core Node/TypeScript CLI for spec compilation, LLM orchestration, and test generation.
- `apps/web/`: React + Vite dashboard for visualizing specs and run history (Optional).
- `apps/api/`: FastAPI (Python) backend for auth, project management, and billing (Optional).
- `packages/`:
    - `spec/`: Spec parser, compiler, and JSON schemas.
    - `llm/`: Provider adapters (Gemini, Gemma) and the cost estimation engine.
    - `generators/`: Language-specific test templates and generators (Jest, Pytest, Go, etc.).
    - `shared/`: Shared types and utility functions.

### Tech Stack
- **CLI**: TypeScript, Node.js, Jest, ESLint.
- **Web**: React, Vite, CSS3.
- **API**: FastAPI, PostgreSQL, Redis, Alembic.
- **LLMs**: Google Gemini (Primary), Gemma 4 (Local Fallback).
