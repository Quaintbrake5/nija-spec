# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-30

### Added

- **Core Engine**: 4-phase compliance pipeline (Iron Gate → Extraction → Analysis → Remediation)
- **CLI Commands**: `init`, `generate`, `verify`, `estimate`, `check`
- **Breach Detection**: 6 regulatory rules (NDPA + CBN frameworks)
- **Template Remediation**: Deterministic patches and tests from external template files
- **LLMProvider Abstraction**: Interface with Ollama, Gemini, and MockExtractor adapters
- **Prompt Versioning**: Versioned extraction prompts with manifest provenance
- **Redaction Pipeline**: Credential sanitization with redaction reports
- **Post-Generation Validation**: Syntax and structural checks before writing files
- **Config File Support**: `.nija-config.json` for endpoint, model, and API keys
- **NGN Cost Estimation**: Token-to-Naira calculation using Gemini pricing
- **Multi-Language Generators**: Jest/TypeScript, PyTest/Python, Go testing, JUnit/Java, xUnit/C#, PHPUnit/PHP
- **Run Manifest**: JSON output with timestamp, breaches, frameworks, prompt version, redaction summary
- **Security**: CI permissions, artifact upload, credential redaction

### Fixed

- Removed stale documentation references to `nijaspec` binary (now `nija-audit`)
- Fixed CLAUDE.md and AGENTS.md false "no source code exists" claims
- Added "Planned (V1+)" disclaimers to futuristic docs
- Updated system-flow.mmd diagram to reflect actual 4-phase pipeline
