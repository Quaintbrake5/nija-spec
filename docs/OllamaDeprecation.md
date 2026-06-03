# Ollama Deprecation & Migration Guide

## Overview

As of **June 2026**, support for local LLM extraction via Ollama is officially deprecated in NijaSpec. To ensure higher extraction quality, better consistency across environments, and streamlined maintenance, NijaSpec is transitioning towards cloud-based extraction (Gemini) and deterministic mock extraction for development and CI/CD pipelines.

## Deprecation Timeline

| Milestone | Date | Status | Action |
| :--- | :--- | :--- | :--- |
| **Deprecation Announcement** | June 2026 | ⚠️ Warning | CLI warnings introduced; alternatives recommended. |
| **End of Life (EOL)** | December 2026 | 🛑 Removed | Ollama support will be completely removed from the codebase. |

## Reasons for Deprecation

While local extraction provided privacy and cost benefits, several factors led to this decision:

1. **Extraction Quality**: Local models (e.g., Qwen 2.5) occasionally struggle with complex schema adherence compared to frontier cloud models.
2. **Operational Overhead**: Requiring users to install and manage a local Ollama instance increased the barrier to entry for new contributors and users.
3. **Deterministic Testing**: The `MockExtractor` provides a more reliable and faster way to verify compliance logic without the variance of LLM outputs.

## Migration Instructions

Depending on your use case, choose one of the following alternatives:

### 1. Transition to Cloud Extraction (Gemini)

If you require high-accuracy semantic extraction of Markdown specifications:

- **Old Command**: `nija-audit generate <spec.md> --endpoint http://localhost:11434/api/generate --model qwen2.5:7b`
- **New Command**: `nija-audit generate <spec.md> --gemini`

*Note: Ensure you have your Gemini API key configured in your environment variables.*

### 2. Transition to Mock Extraction

If you are running tests, working in CI/CD, or do not require live LLM reasoning:

- **Old Command**: `nija-audit generate <spec.md> --endpoint http://localhost:11434/api/generate --model qwen2.5:7b` (or similar local setup)
- **New Command**: `nija-audit generate <spec.md> --skip-llm`

The `--skip-llm` flag triggers the `MockExtractor`, providing deterministic outputs based on the specification's structure.

## Summary of CLI Changes

| Deprecated Flag | Recommended Alternative | Purpose |
| :--- | :--- | :--- |
| `--endpoint <url>` | `--gemini` or `--skip-llm` | Specify the LLM provider/mode |
| `--model <name>` | `--gemini` or `--skip-llm` | Specify the model to use |

## Support

If you have questions regarding this migration or need assistance setting up the Gemini API, please refer to the [Development Guide](docs/DevelopmentGuide.md) or open an issue in the repository.
