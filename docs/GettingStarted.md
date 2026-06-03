# Getting Started with NijaSpec

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-23  

---

## 10-Minute Walkthrough

Welcome to NijaSpec! This guide will help you understand the core concepts and how to use the toolchain in just 10 minutes.

### What is NijaSpec?

NijaSpec is a **spec-as-truth** toolchain that converts human requirements into a canonical technical spec and then enforces that spec via **generated verification tests**. It is positioned as **trust infrastructure** for software delivery.

### Core Concepts

#### The Trust Engine Architecture

NijaSpec uses a unique architectural approach called the **Trust Engine** that eliminates LLM code generation risks:

1. **Phase 1 - Cloud Reasoning**: LLM extracts semantic meaning from requirements and outputs structured JSON
2. **Phase 2 - Local Deterministic Processing**: Local system converts JSON to syntactically-perfect test code using templates

This separation ensures:

- ✅ 100% syntax correctness (no hallucinated code errors)
- ✅ Deterministic output (same input → same output)
- ✅ 40-60% token reduction (LLM only outputs data, not boilerplate)
- ✅ Trust through verification, not blind generation

### Quick Start

#### Prerequisites

- Node.js (v18+)

#### Installation

```bash
git clone <repository-url>
cd NaijaSpec
npm install
```

#### Basic Workflow

1. **Run an audit with mock extractor** (no Ollama needed)

   ```bash
   npm run check -- test-spec.md --skip-llm
   ```

2. **Run an audit with cloud extraction** (requires Gemini API key)

   ```bash
   npm run check -- test-spec.md --gemini
   ```

3. **View generated patches**

   ```bash
   cat .nija/patches/BREACH-002-fix.md
   ```

4. **Run the test suite**

   ```bash
   npm test
   ```

### Key Features

- **Multi-LLM Support**: Switch between providers (Gemini, optional local Gemma 4 31B IT, etc.) without changing workflows
- **Cost Awareness**: See NGN cost estimates before any generation
- **CI Integration**: Built for GitHub Actions and other CI systems
- **Fintech Focus**: Built-in templates for Paystack/Flutterwave webhook validation
- **Self-Healing**: Optional bounded repair loop for failing tests (requires human confirmation)

### Where to Go Next

- **Ollama Migration**: Read [OllamaDeprecation.md](./OllamaDeprecation.md) for deprecation timeline and migration steps
- **Product Understanding**: Read [PRD.md](./PRD.md) for problem statement, goals, and success metrics
- **Technical Deep Dive**: Review [NijaSpec_TrustEngine_Architecture.md](../NijaSpec_TrustEngine_Architecture.md) for the core architectural approach
- **API Details**: See [API-Spec.md](./API-Spec.md) for hosted API specifications
- **CLI/CI Workflows**: Explore [AppFlow.md](./AppFlow.md) and [CI-CD.md](./CI-CD.md)
- **Agent Guidance**: Consult [AGENTS.md](./AGENTS.md) for best practices when working with AI agents in this repo

### Need Help?

- Check the [Runbooks.md](./Runbooks.md) for troubleshooting common issues
- Review [TestingStrategy.md](./TestingStrategy.md) for our approach to reliability
- See [Observability.md](./Observability.md) for debugging and monitoring capabilities

Remember: NijaSpec is about **verifiable trust**, not automated coding. The goal is to provide measurable alignment between "what was agreed" and "what shipped" through deterministic, verifiable processes.
