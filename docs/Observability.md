# NijaSpec — Observability (Logging, Metrics, Tracing)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-23  

---

## 1) Objectives

- Make CLI runs diagnosable without “LLM mystery”.
- Make CI runs auditable and easy to debug.
- Provide a clean path to production observability if/when an API is introduced.

---

## 2) Core Concepts

### Run Manifest (single source of truth)

Every execution writes a structured manifest (example path):

- `.nijaspec/runs/<runId>/run-manifest.json`

Include:

- timestamps, duration
- command + args (sanitized)
- provider id + model identifier
- prompt version
- token usage + NGN estimate
- artifacts list (paths + hashes)
- error summaries (no secrets)

### Correlation IDs

- Generate `runId` at the start of each CLI run.
- Propagate `runId` into logs, artifact names, and (hosted mode) request IDs.

---

## 3) Logging

### 3.1 CLI Logging Requirements

- Levels: `debug`, `info`, `warn`, `error`
- Always log:
  - provider selection (primary/fallback)
  - token estimate result
  - output validation result
  - file write targets

### 3.2 Redaction

- Apply the same redaction policy used for prompts to logs.
- Never log raw prompts or raw provider responses in default mode.

---

## 4) Metrics (Hosted mode later; CLI can emit JSON stats)

Suggested metrics:

- `runs_total` (by command, provider, status)
- `run_duration_ms` (histogram)
- `tokens_total` (by provider, model)
- `fallback_rate` (cloud → local fallback)
- `generation_invalid_rate` (output validation failures)

---

## 5) Tracing (Hosted mode)

If/when a FastAPI service is added:

- OpenTelemetry instrumentation for:
  - request traces
  - background job traces
- Propagate `requestId`/`runId` across services and workers.

---

## 6) SLOs (Targets)

MVP targets (CLI + CI):

- Generated test runnable rate ≥ 95%
- P95 run time (small spec) ≤ 2 minutes (local machine baseline)

Hosted mode targets (future):

- API availability ≥ 99.9%
- P95 API latency ≤ 300ms for read endpoints

---

## 7) Alerting (Hosted mode)

Alert on:

- elevated failure rate in runs
- provider outage (sustained errors)
- abnormal token usage spikes (potential prompt bloat regression)
