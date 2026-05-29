# NijaSpec — App Flow (CLI + CI)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-22  

---

## 1) High-Level Flow

1. User inputs raw requirements (chat logs, notes, transcripts).
2. Phase 1 (“Structuring”): parse into `intermediate_schema.json`.
3. Phase 2 (“Standardization”): compile into canonical `nijaspec.md`.
4. Generate test scaffold(s) from `nijaspec.md`.
5. Run tests locally and/or in CI.
6. If failures occur, optionally run a bounded “heal” loop to produce a patch candidate.

---

## 2) CLI Flows

### 2.1 First Run / Bootstrap
- `nijaspec init`
  - creates `nijaspec.config.json`
  - creates `nijaspec.md` template
  - creates `.nijaspec/prompts/*` (versioned)

### 2.2 Chat-to-Spec Wizard
- Input: raw text file(s) (exported WhatsApp, notes, transcript)
- Output: `intermediate_schema.json` then `nijaspec.md`

Flow:
- `nijaspec spec from-text --input ./raw.txt --output ./.nijaspec/intermediate_schema.json`
- `nijaspec spec compile --input ./.nijaspec/intermediate_schema.json --output ./nijaspec.md`

### 2.3 Generate + Verify
Flow:
- `nijaspec estimate --spec ./nijaspec.md`
- `nijaspec generate --input ./nijaspec.md --output ./tests/nijaspec.spec.ts --framework jest`
- `nijaspec verify --tests ./tests/nijaspec.spec.ts`

### 2.4 Bounded Self-Heal (Opt-in)
Flow:
- `nijaspec verify` fails → writes `.nijaspec/runs/<id>/failure.json`
- `nijaspec heal --spec ./nijaspec.md --testFile ./tests/nijaspec.spec.ts --errorLog ./.nijaspec/runs/<id>/failure.json`
- produces a patch candidate:
  - `./tests/nijaspec.spec.ts` updated, and/or
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
  - `nijaspec generate` (or verify existing generated tests)
  - `nijaspec verify`
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

