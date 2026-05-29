# NijaSpec — Runbooks (Operations Playbooks)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-23  

---

## 1) Scope

These runbooks cover:
- CLI + CI operational issues (now)
- hosted mode operational issues (future)

---

## 2) Incident Triage Template

Capture:
- impact window (start/end time)
- affected users/orgs/projects
- symptom summary
- runId(s) / requestId(s)
- provider/model identifiers involved
- mitigation applied + verification steps
- follow-up action items

---

## 3) LLM Provider Outage / Degradation

Symptoms:
- elevated `FAILED` runs
- provider timeouts / 5xx errors

Mitigation:
- switch provider (if configured)
- enable local fallback in CLI workflows (where possible)
- reduce prompt payload size (disable repo context uploads)

Verification:
- run a known small spec through `estimate` and `generate`
- confirm run manifests show expected provider and stable token usage

---

## 4) Token Cost Spike / Prompt Bloat Regression

Symptoms:
- token totals increase unexpectedly across releases
- CI runs become slow/expensive

Mitigation:
- enable token minimizer (strip markdown noise, normalize whitespace)
- add a hard token threshold in CI (fail-fast)
- diff prompt versions + spec hashes for bloat sources

Verification:
- compare `run-manifest.json` token totals before/after fix

---

## 5) Secret Leakage (Highest Severity)

Symptoms:
- secrets appear in logs, artifacts, or prompts

Immediate actions:
- revoke/rotate exposed keys
- delete affected artifacts from storage (hosted mode)
- invalidate sessions/tokens if applicable

Root cause fixes:
- improve redaction patterns
- blocklist known sensitive files by default (`.env`, key files)
- add automated tests that assert “no secrets in artifacts”

---

## 6) CI Permission Misconfiguration

Symptoms:
- workflow has `contents: write` unexpectedly
- CI attempts to push commits from PR contexts

Mitigation:
- set `permissions: read-all` globally
- remove any auto-commit steps from PR workflows
- restrict writeback workflows to `workflow_dispatch` on trusted branches

Verification:
- re-run PR workflow from fork and confirm secrets are not accessible and workflow can’t write

---

## 7) Hosted Mode (Future) — Database Restore Drill

Steps:
- restore last backup into staging
- run integrity checks on:
  - orgs/projects
  - specs versions
  - run metadata
  - artifact pointers
- verify API read endpoints and artifact download URLs work

---

## 8) Hosted Mode (Future) — Artifact Retention Cleanup

Steps:
- apply lifecycle policy in object storage
- run DB cleanup job:
  - delete expired artifact rows
  - keep `RUN_MANIFEST` and `PATCH_DIFF` longer by policy
- verify no “dangling pointers” remain

