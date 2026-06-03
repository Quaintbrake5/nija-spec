# NijaSpec — App Flow (CLI + CI)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-22  

---

## 1) High-Level Flow

1. User inputs raw requirements (chat logs, notes, transcripts).
2. Phase 1 (“Structuring”): parse into `intermediate_schema.json`.
3. Phase 2 (“Standardization”): compile into canonical `nija-audit.md`.
4. Generate test scaffold(s) from `nija-audit.md`.
5. Run tests locally and/or in CI.
6. If failures occur, optionally run a bounded “heal” loop to produce a patch candidate.

---

## 2) CLI Flows

### 2.1 First Run / Bootstrap

- `nija-audit init`
  - creates `nija-audit.config.json`
  - creates `nija-audit.md` template
  - creates `.nija-audit/prompts/*` (versioned)

### 2.2 Chat-to-Spec Wizard

- Input: raw text file(s) (exported WhatsApp, notes, transcript)
- Output: `intermediate_schema.json` then `nija-audit.md`

Flow:

- `nija-audit spec from-text --input ./raw.txt --output ./.nija-audit/intermediate_schema.json`
- `nija-audit spec compile --input ./.nija-audit/intermediate_schema.json --output ./nija-audit.md`

### 2.3 Generate + Verify

Flow:

- `nija-audit estimate --spec ./nija-audit.md`
- `nija-audit generate --input ./nija-audit.md --output ./tests/nija-audit.spec.ts --framework jest`
- `nija-audit verify --tests ./tests/nija-audit.spec.ts`

### 2.4 Bounded Self-Heal (Opt-in)

Flow:

- `nija-audit verify` fails → writes `.nija-audit/runs/<id>/failure.json`
- `nija-audit heal --spec ./nija-audit.md --testFile ./tests/nija-audit.spec.ts --errorLog ./.nija-audit/runs/<id>/failure.json`
- produces a patch candidate:
  - `./tests/nija-audit.spec.ts` updated, and/or
  - a human-reviewable diff artifact

Constraints:

- Max attempts (default 1–2)
- No file writes outside allowed target directories
- Always require a final “human confirm” in local mode

---

## 3) CI Flows (GitHub Actions)

### 3.1 Pull Request

- Run:
  - dependency install
  - build/lint/test for repo
  - `nija-audit generate` (or verify existing generated tests)
  - `nija-audit verify`
- Output:
  - check status (pass/fail)
  - optional artifacts:
    - generated tests
    - run manifest
    - failure logs

### 3.2 Main Branch

- Same as PR, plus:
  - optional release tagging
  - publishing CLI packages (if applicable)

---

## 4) Product Flow (Future Hosted Dashboard, Optional)

If/when hosting is introduced:

- Workspace → Projects → Specs → Runs → Reports
- Roles:
  - Owner, Maintainer, Reviewer, Viewer
- Reports:
  - spec diff, run diff, pass/fail history, evidence export
