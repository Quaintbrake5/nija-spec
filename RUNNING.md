# Running nija-spec

This guide explains how to set up and run the `nija-spec` compliance verification engine.

## 🛠️ Prerequisites

1. **Node.js**: v18 or higher installed.
2. **Ollama**: 
   - Install [Ollama](https://ollama.com/).
   - Pull the required model:
     ```bash
     ollama pull qwen2.5:7b
     ```
   - Ensure the Ollama server is running (usually starts automatically on port 11434).

## 🚀 Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Run an Audit
Use the `check` command to validate an architecture specification file:
```bash
npx ts-node bin/nija.ts check <path-to-your-spec.md>
# Or if installed globally:
nija-spec check <path-to-your-spec.md>
```

## 🧪 Testing the Engine

To verify that the engine is working correctly, create a sample specification file.

### Create `test-spec.md`
Save the following content to a file named `test-spec.md`:

```markdown
# Infrastructure
- Hosting: AWS (region: us-east-1)
- Data Residency: Foreign

# Authentication
- MFA: Disabled
- TLS: 1.1

# Data Lifecycle
- PII Categories: BVN, Phone
- Retention: None

# Audit Metadata
- Author: System Architect
- Version: 1.0.0
- Classification: FINTECH
```

### Run the Audit
```bash
npx ts-node bin/nija.ts check test-spec.md
# Or if installed globally:
nija-spec check test-spec.md
```

### Expected Results
The tool should:
1. **Pass the Iron Gate**: Recognize the required headers.
2. **Detect Breaches**: 
   - `BREACH-001`: Critical (Data Retention Policy Absent).
   - `BREACH-002`: High (TLS Version Unspecified/Low).
   - `BREACH-004`: Critical (Foreign Data Residency Without Adequate Safeguards).
   - `BREACH-005`: High (Multi-Factor Authentication Disabled).
3. **Generate Remediation**: Create patches and tests for each breach in `.nija/patches/`.
