# Contributing to NijaSpec

Thank you for your interest in contributing to NijaSpec! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and constructive in all interactions. We are building trust infrastructure for Nigerian compliance — professionalism matters.

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+
- Ollama (optional, for local LLM testing)

### Development Setup
```bash
# Clone the repository
git clone https://github.com/nijaspec/nija-audit.git
cd nija-audit

# Install dependencies
npm install

# Run tests
npm test

# Run type check
npm run typecheck

# Run the CLI
npm run check -- test-spec.md --skip-llm
```

## Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Make** your changes
4. **Run** `npm test` and `npm run typecheck` to verify
5. **Commit** with a clear message
6. **Push** to your fork
7. **Open** a Pull Request

## Code Style

- **TypeScript** — All source code is TypeScript with strict mode
- **No comments** — Code should be self-documenting
- **Template files** — Test templates go in `templates/`, not hardcoded in TypeScript
- **Generator interface** — New languages implement `src/generators/interface.ts`

## Testing

- Write tests for new features
- Run `npm test` before submitting
- All 65+ tests must pass
- Use `npm run test:coverage` to check coverage

## Pull Request Guidelines

- **Title**: Clear, concise description of the change
- **Description**: What changed, why, and how to test
- **Tests**: Include tests for new functionality
- **Documentation**: Update README.md if adding new features

## Reporting Bugs

Use the [GitHub Issues](https://github.com/naijaspec/nija-audit/issues) with the bug report template.

## Requesting Features

Use the [GitHub Issues](https://github.com/naijaspec/nija-audit/issues) with the feature request template.

## License

By contributing, you agree that your contributions will be licensed under the ISC License.
