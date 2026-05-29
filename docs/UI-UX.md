# NijaSpec — UI/UX Spec (Web Dashboard, Optional v1+)

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-05-22  

---

## 1) UX Principles

- **Evidence-first:** the UI should feel like an audit report, not a chat app.
- **Deterministic outputs:** avoid “LLM vibe”; show inputs, prompts version, and artifacts.
- **Fast navigation:** projects → specs → runs should be < 3 clicks.
- **Readable without Tailwind:** plain CSS, tokens, and components.

---

## 2) Key Screens

### 2.1 Landing
- Value proposition: “Specs → tests → proof-of-work”
- CTA: “Install CLI” + “View sample report”

### 2.2 Auth
- Sign in (OAuth or magic link)
- Org selection / creation

### 2.3 Project Dashboard
- List projects
- Spec status summary:
  - latest spec version
  - last run status
  - failing endpoints count

### 2.4 Spec Viewer
- Render canonical `nijaspec.md`
- Diff view between versions
- “Export evidence” button

### 2.5 Run Report
- Run metadata:
  - prompt version
  - model identifier
  - token usage and NGN estimate
  - CI link
- Results:
  - pass/fail list by endpoint/check
  - failure details with log snippets
- Artifacts:
  - generated test file download
  - manifests

---

## 3) Component System (No Tailwind)

### 3.1 Tokens (CSS variables)
- Colors: background, surface, border, text, success, warning, danger
- Typography: font family, sizes, weights
- Spacing: 4px grid
- Radius: 6/10/14
- Shadows: subtle, 2 levels

### 3.2 Components (initial set)
- `Button`, `Input`, `Select`, `Tag`, `Alert`
- `Sidebar`, `Topbar`, `Breadcrumbs`
- `Table` (runs/spec history)
- `DiffViewer` (spec diff)
- `CodeBlock` (logs, manifests)

---

## 4) Accessibility

- WCAG AA contrast targets for text and status colors.
- Keyboard navigable:
  - tab order
  - focus ring visible
- All status indicators must have text labels (not color-only).

