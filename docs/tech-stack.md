# NijaSpec — Tech Stack

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-29  

---

## 1) Overview

NijaSpec uses a CLI-first architecture with the Trust Engine pattern:
- **LLM Reasoning**: Cloud (Gemini) or local (Ollama/Gemma 4) for structured JSON extraction
- **Deterministic Processing**: Local template engine for syntactically-perfect code generation
- **Compliance-as-Code**: Strict validation of architectural intent against regulatory schemas (NDPA, CBN) using AJV

---

## 2) Core CLI (MVP)

| Category | Technology | Purpose |
|----------|------------|---------|
| Language | TypeScript / Node.js (v18+) | CLI core, LLM adapters, spec parser |
| Package Manager | npm / pnpm | Dependency management |
| Testing | Jest, Supertest, Nock | CLI testing & API mocking |
| Linting | ESLint | Code quality |
| Build | TypeScript compiler | Compilation to dist/ |
| Schema Validation | AJV | Strict JSON schema enforcement (Compliance) |

---

## 3) LLM Providers

| Provider | Model | Role |
|----------|-------|------|
| Google Gemini | gemini-2.5-flash | Primary (structured output) |
| Local Runtime | Ollama | Local semantic extraction (Privacy-first) |
| Local Model | Gemma 4 31B IT | Optional FX volatility hedge / Offline mode |

---

## 4) Web Dashboard (Optional v1+)

| Category | Technology |
|----------|------------|
| Framework | React |
| Build Tool | Vite |
| Styling | CSS3 (no Tailwind) |
| Language | TypeScript |

---

## 5) API Service (Optional v1+)

| Category | Technology |
|----------|------------|
| Framework | FastAPI (Python) |
| Server | uvicorn / gunicorn |
| Database | PostgreSQL |
| Migrations | Alembic |
| Cache/Queue | Redis |

---

## 6) CI/CD

| Category | Technology |
|----------|------------|
| Platform | GitHub Actions |
| Runner | ubuntu-latest |
| Container | Docker (API) |

---

## 7) Data Storage

| Category | Technology |
|----------|------------|
| Primary DB | PostgreSQL |
| Object Storage | S3 / R2 / MinIO |
| Cache | Redis |

---

## 8) Generated Test Targets

| Language | Framework |
|----------|-----------|
| JS/TS | Jest, Supertest |
| Python | Pytest, Requests |
| Go | Go testing, httptest |
| Java | JUnit, REST Assured |
| C# | xUnit, FluentAssertions |
| PHP | PHPUnit, Guzzle |

---

## 9) Security & Auth

| Category | Technology |
|----------|------------|
| Authentication | OAuth (Google), Magic Links |
| Authorization | RBAC |
| Standards | CORS, CSRF, WCAG AA |

---

## 10) Observability

| Category | Technology |
|----------|------------|
| Tracing | OpenTelemetry (hosted) |
| Logs | Structured JSON |
| Monitoring | Run manifests |

---

## 11) Fintech Integration

| Gateway | Header |
|---------|--------|
| Paystack | x-paystack-signature |
| Flutterwave | verif-hash |

---

## 12) Deployment

| Component | Strategy |
|-----------|----------|
| CLI | npm package |
| Web | Static hosting |
| API | Docker + reverse proxy |
