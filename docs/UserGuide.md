# NijaSpec User Guide

Welcome to NijaSpec, a **Nigeria-first Compliance-as-Code architectural auditing engine**. NijaSpec allows you to validate your system architecture specifications against Nigerian regulatory frameworks (NDPA, CBN, SEC) and receive deterministic remediation guidance.

---

## 🚀 Getting Started

NijaSpec provides two ways to interact with the Trust Engine: via a high-performance CLI for developers and a web-based Dashboard for organization-wide management.

### CLI Setup

1. **Prerequisites**: Ensure you have [Node.js v18+](https://nodejs.org/) installed.
2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run Your First Audit**:
   Use the provided `test-spec.md` to verify the installation:

   ```bash
   # Run with the mock extractor (no LLM required)
   npm run check -- test-spec.md --skip-llm
   ```

### Web Dashboard Setup

1. **Backend**:
   - Navigate to `nija-backend/`.
   - Install Python dependencies and start the FastAPI server.
2. **Frontend**:
   - Navigate to `nija-frontend/`.
   - Run `npm install` and `npm run dev`.
3. **Access**: Open your browser to the local development URL (usually `http://localhost:5173`).

---

## 🛠 Feature Overview

### The Trust Engine

NijaSpec uses a deterministic pipeline to eliminate LLM hallucinations:

1. **Iron Gate**: Validates the Markdown structure and sanitizes secrets before any AI processing.
2. **Local Semantic Extraction**: Extracts structured JSON from the specification using local LLMs (via Ollama/Qwen) or cloud LLMs (Gemini).
3. **Compliance Gap Analysis**: Compares the extracted JSON against a **Breach Detection Matrix** based on NDPA and CBN rules.
4. **Dual Enforcement**: Generates template-based remediation patches and integration test scaffolding.

### CLI vs. Dashboard

| Feature | CLI (`nija-audit`) | Web Dashboard |
| :--- | :--- | :--- |
| **Primary User** | Developer / DevOps | Compliance Officer / Architect |
| **Workflow** | Local file $\rightarrow$ Local report | Org $\rightarrow$ Project $\rightarrow$ Spec $\rightarrow$ Run |
| **Speed** | Instant / CI-integrated | Managed / Historical tracking |
| **Output** | Console / `.nija/patches/` | Visual reports / Analytics |

---

## 🔑 Authentication

The Web Dashboard supports enterprise-grade authentication to ensure regulatory data is protected.

- **Google OAuth2**: Quick sign-in using corporate Google accounts.
- **Magic Links**: Passwordless authentication via email verification.
- **Session Management**: Secure token-based access with refresh mechanisms.

---

## 📁 Project Management

NijaSpec organizes work in a hierarchical structure:
**Organization** $\rightarrow$ **Project** $\rightarrow$ **Specification** $\rightarrow$ **Audit Run**

### Organizations & Projects

- **Organizations**: The top-level entity (e.g., your company).
- **Projects**: Specific products or infrastructure components (e.g., "Payment Gateway v2").
- **Project Analytics**: View overall compliance scores and breach trends across all specifications in a project.

---

## 📄 Specification Handling

Specifications are written in Markdown and must follow a specific structure to pass the **Iron Gate**.

### Creating Specifications

- **Required Sections**: Your spec must include sections like `# Infrastructure`, `# Data Flow`, and `# Security Controls`.
- **Management**: In the Dashboard, you can upload existing `.md` files or create new ones using the built-in editor.
- **Versioning**: Track changes between specification versions and view structural diffs to see how architecture evolved.

---

## 🔍 Audit Execution

### Running Audits via CLI

The CLI is optimized for CI/CD pipelines and local development.

```bash
# Basic run
npm run check -- <spec.md>

# Use a specific Ollama model
npm run check -- <spec.md> --model qwen2.5:7b

# Use Gemini Cloud
npm run check -- <spec.md> --gemini --gemini-key YOUR_KEY
```

### Running Audits via Dashboard

1. Select a **Project**.
2. Choose a **Specification**.
3. Click **Start Run**.
4. **Monitor**: The run executes in the background. You can track progress and cancel the run if needed.
5. **Review**: Once complete, view the **Results** (compliance gaps) and **Artifacts** (remediation patches and test scripts).

---

## ❓ Troubleshooting

### Common CLI Issues

- **"Structural Validation Failed"**: Your Markdown file is missing a required header (e.g., `# Infrastructure`). Refer to the `test-spec.md` for a valid example.
- **LLM Connection Timeout**: If using Ollama, ensure the service is running (`ollama serve`) and the model is pulled (`ollama pull qwen2.5:7b`).
- **JSON Parsing Error**: The LLM failed to produce valid JSON. NijaSpec will automatically retry 3 times before halting.

### Common Dashboard Issues

- **API Connection Error**: Ensure the `nija-backend` is running and the `VITE_API_URL` in the frontend environment matches the backend port.
- **Unauthorized (401)**: Your session may have expired. Try logging out and logging back in via Magic Link.
