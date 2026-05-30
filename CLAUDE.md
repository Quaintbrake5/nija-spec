# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
- Build: `npm run build`
- Type check: `npm run typecheck`
- Test: `npm test` (runs all Jest tests)
- Test single file: `npm test -- <path-to-file>`

### CLI Tooling (nija-audit)
- Initialize project: `nija-audit init`
- Run compliance check: `nija-audit generate <spec.md> --skip-llm`
- Verify generated tests: `nija-audit verify`
- Estimate tokens: `nija-audit estimate <spec.md>`
- Show help: `nija-audit --help`

## Architecture & Structure

### High-Level Design: The Trust Engine
NijaSpec follows the **Trust Engine** pattern to ensure deterministic and syntactically correct code generation:
1. **Iron Gate**: Parse Markdown, sanitize credentials, validate required sections.
2. **Local Semantic Extraction**: Ollama/Qwen extracts structured JSON (or MockExtractor for offline/CI).
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
```

### Tech Stack
- **CLI**: TypeScript, Node.js, Jest, AJV (schema validation)
- **LLMs**: Ollama/Qwen (local), MockExtractor (offline/CI), Gemini (cloud) — all via LLMProvider interface with fallback
- **Testing**: Jest with ts-jest
