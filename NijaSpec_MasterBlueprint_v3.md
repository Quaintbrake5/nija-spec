# The Master Blueprint — v3.0
## From NijaSpec to nija-audit: A Complete Strategic & Technical Evolution

**Document Class:** Founder-Grade Living Blueprint  
**Version:** 3.0 (Integrates v1.0 Analysis + Deep Blueprint + Trust Engine + Compliance-as-Code)  
**Date:** May 2026  
**Audience:** Founder. No one else needs to read this yet.

---

> *"You started with a testing tool. You ended up with a compliance fortress. That's not a pivot — that's a founder who followed the problem instead of the solution."*

This document is the single source of truth. Everything that came before — the NijaSpec analysis, the Deep Blueprint, the Trust Engine architecture, and the Compliance-as-Code conversation — is synthesized here into one coherent strategy. Read it once. Then build.

---

## Part I: What Actually Happened (The Strategic Evolution)

Understanding the journey from NijaSpec to nija-audit matters because it explains *why* this version of the product is more defensible than the last.

### Stage 1 — NijaSpec (The Spark)
The original idea: generate Jest tests from API specs using Gemini. The problem being solved: Nigerian dev teams shipping untested integrations because writing tests from scratch is slow.

**What was right about it:** The market insight (spec-driven workflows reduce friction), the Trust Engine architecture (JSON-first, deterministic compilation), and the Naira-denominated pricing for local adoption.

**What was fragile about it:** NijaSpec was a *developer convenience* tool. It made existing work faster. But the Deep Blueprint exposed a structural weakness — agencies that under-deliver have no incentive to adopt a self-auditing tool. The market was a vitamin, not a painkiller.

### Stage 2 — The Blue Ocean Pivot (The Clarity)
The compliance conversation changed everything. The question stopped being "how do we make testing faster?" and started being "what problem are Nigerian companies actively bleeding cash to solve?"

The answer was hiding in plain sight: **regulatory survival.**

Companies are getting fined. Startups are failing due diligence. CBN and NDPA are enforcing. Nobody is building compliance tooling for engineers.

### Stage 3 — nija-audit (The Product)
The evolved product is not a test generator. It is a **Compliance-as-Code architectural auditing engine** — a CLI-first tool that sits in the developer's pipeline, validates architecture specifications against Nigerian regulatory frameworks, and produces deterministic, court-defensible gap analysis reports.

The genius of this evolution: the Trust Engine architecture from NijaSpec (LLM outputs JSON → local engine outputs code) is **directly inherited**. Nothing built for NijaSpec is wasted. The foundation transfers entirely.

---

## Part II: The Strategic Case (Why This Survives)

### The "Painkiller Test" — Passed

The Deep Blueprint's single most important question was: *"Is this a painkiller or a vitamin?"* NijaSpec was a vitamin. nija-audit is a painkiller, and here is the evidence:

Nigerian fintechs currently face:
- CBN Cybersecurity Framework compliance requirements
- NDPA (Nigeria Data Protection Act) enforcement with real financial penalties
- CBN licensing conditions that require documented security architecture
- Investor due diligence processes that increasingly demand proof of regulatory compliance

A startup that fails due diligence because its architecture spec doesn't demonstrate NDPA-compliant data retention has lost funding. That is not a slow, ambiguous pain. That is a company-ending event.

**nija-audit sells survival. NijaSpec sold convenience. These are fundamentally different products.**

### The Blue Ocean Validation

The gap identified is real and specific: existing compliance tools in Nigeria (AutoComply, BetterCreds, etc.) are **legal dashboards for accountants**. They track deadline calendars, automate tax filings, and manage regulatory form submissions. None of them touch the engineering layer.

This means:
- No direct competition for an engineering-focused compliance tool
- No existing category to fight for market share in
- No incumbent with distribution in the developer ecosystem

The market does not yet know it needs this product. That is both the opportunity and the challenge — creating category awareness is harder than winning an existing race, but the rewards are category-defining.

### The Defensibility Test — Passed

The three-layer moat that nija-audit builds is genuinely deep:

**Layer 1 — Regulatory Knowledge as Data:** The core product requires encoding NDPA, CBN Cybersecurity Framework, and SEC guidelines into structured compliance schemas. This is painstaking, expert work that cannot be done in a weekend. Every new regulatory module becomes an asset that competitors must replicate.

**Layer 2 — Architectural Complexity:** The Trust Engine pipeline (AST parsing → local model semantic extraction → strict JSON schema validation → deterministic code compilation) is not something a junior developer can clone. The system requires expertise in language parsing, LLM orchestration, schema design, and CI/CD integration simultaneously.

**Layer 3 — Developer Pipeline Integration:** Once nija-audit is embedded in a company's `.git/hooks/pre-commit` or GitHub Actions workflow, switching costs are significant. It's not a SaaS subscription you cancel — it's woven into the engineering culture of the organization.

---

## Part III: The Architecture (Complete & Production-Ready)

The architecture inherits the Trust Engine and extends it for compliance.

### System Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEVELOPER'S MACHINE                         │
│                                                                  │
│  [Markdown Spec]                                                 │
│       │                                                          │
│       ▼                                                          │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  PHASE 0: Iron Gate (Pre-AI Deterministic Lexer)     │       │
│  │                                                       │       │
│  │  • AST Parser scans Markdown for required headers    │       │
│  │  • Rejects hardcoded credentials, env vars           │       │
│  │  • Missing section = Fatal Error, Exit Code 1        │       │
│  │  • No AI involved. Pure deterministic parsing.       │       │
│  └──────────────────────────────────────────────────────┘       │
│       │  (sanitized, validated AST)                             │
│       ▼                                                          │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  PHASE 1: Local Semantic Extraction (Ollama/Qwen)    │       │
│  │                                                       │       │
│  │  • Runs 100% offline — no data leaves the machine   │       │
│  │  • Forced JSON-mode: no prose, no markdown output   │       │
│  │  • 3-retry choke point: malformed output = halt     │       │
│  │  • Maps architecture intent to canonical schema     │       │
│  └──────────────────────────────────────────────────────┘       │
│       │  (strict JSON payload)                                  │
│       ▼                                                          │
│  ┌──────────────────────────────────────────────────────┐       │
│  │  PHASE 2: Compliance Gap Analysis Engine             │       │
│  │                                                       │       │
│  │  • Validates JSON against compliance-spec.json       │       │
│  │  • Runs Breach Detection Matrix (NDPA, CBN, SEC)     │       │
│  │  • Each rule mapped to a regulatory article          │       │
│  │  • Deterministic: same input = same output, always  │       │
│  └──────────────────────────────────────────────────────┘       │
│       │  (breach report + remediation request)                  │
│       ▼                                                          │
│  ┌──────────────────────────────────────────────────────┐       │
└──│  PHASE 3: Dual Enforcement Engine                    │───────┘
   │                                                       │
   │  HARD REJECT PATH:                                   │
   │  • Exit Code 1 → blocks git commit/PR merge         │
   │  • Crimson terminal output with regulatory cite      │
   │                                                       │
   │  REMEDIATION PATH (simultaneous):                    │
   │  • Generates corrected architecture patch (.md)      │
   │  • Generates deterministic integration tests (.js)   │
   │  • Saved to .nija/patches/ for human review          │
   │                                                       │
   │  HUMAN-IN-THE-LOOP:                                  │
   │  • Developer reviews both outputs                    │
   │  • Approves patch → merge                            │
   │  • Disputes finding → cryptographic override         │
   └──────────────────────────────────────────────────────┘
```

### The Canonical Compliance Schema (compliance-spec.json)

This is the rigid data contract at the heart of the system. Every ingested architecture spec must compile into this shape before any analysis occurs:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "NijaAuditCanonicalSpec",
  "version": "1.0.0",
  "type": "object",
  "required": ["infrastructure", "data_lifecycle", "authentication", "audit_metadata"],
  "properties": {
    "audit_metadata": {
      "type": "object",
      "required": ["spec_version", "author", "system_classification"],
      "properties": {
        "system_classification": {
          "type": "string",
          "enum": ["FINTECH", "HEALTHTECH", "LOGISTICS", "GENERAL"]
        }
      }
    },
    "infrastructure": {
      "type": "object",
      "required": ["hosting_provider", "region", "data_residency"],
      "properties": {
        "data_residency": {
          "type": "string",
          "enum": ["NG_LOCAL", "REPLICATED", "FOREIGN"],
          "description": "NDPA requires explicit data residency declaration"
        }
      }
    },
    "data_lifecycle": {
      "type": "object",
      "required": ["encryption_at_rest", "encryption_in_transit", "retention_policy", "pii_categories"],
      "properties": {
        "retention_policy": {
          "type": "object",
          "required": ["expiry_days", "hard_deletion_protocol", "deletion_verification"]
        },
        "pii_categories": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["BVN", "NIN", "FINANCIAL_RECORDS", "BIOMETRIC", "ADDRESS", "PHONE"]
          }
        }
      }
    },
    "authentication": {
      "type": "object",
      "required": ["mfa_enforced", "token_expiry_seconds", "tls_version"],
      "properties": {
        "mfa_enforced": { "type": "boolean" },
        "tls_version": {
          "type": "string",
          "enum": ["1.2", "1.3"],
          "description": "CBN requires minimum TLS 1.2; 1.3 strongly recommended"
        }
      }
    },
    "payment_integrations": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["provider", "webhook_signature_validated", "idempotency_enforced"],
        "properties": {
          "provider": {
            "type": "string",
            "enum": ["PAYSTACK", "FLUTTERWAVE", "INTERSWITCH", "REMITA"]
          }
        }
      }
    }
  }
}
```

### The Breach Detection Matrix

| Component | Regulatory Framework | Failure Condition | Severity | Action Generated |
|---|---|---|---|---|
| Data Residency | NDPA Article 2.6 | PII stored exclusively on foreign servers without local fallback | CRITICAL | Block pipeline + generate storage adapter patch |
| Data Retention | CBN Cybersecurity Framework | Missing expiry or indefinite retention of KYC data | CRITICAL | Block pipeline + generate CRON deletion script |
| Authentication | CBN Guidelines 2.3 | Admin interface without MFA enforcement | HIGH | Block pipeline + generate MFA integration test |
| Transit Encryption | CBN / NDPA | TLS version below 1.2 on any data endpoint | CRITICAL | Block pipeline + generate TLS config fix |
| Webhook Validation | PCI-DSS / CBN | Payment webhook without signature verification | HIGH | Block pipeline + generate signature validation test |
| PII Classification | NDPA | BVN or NIN stored without explicit protection declaration | CRITICAL | Block pipeline + generate classification schema |
| Audit Logging | CBN Cybersecurity | No audit trail for admin actions or data access | MEDIUM | Warning + generate audit logger scaffold |

---

## Part IV: Repository Architecture

### The nija-audit Core Repository

```
nija-audit/
│
├── bin/
│   └── nija.js                     # CLI executable entry point
│
├── src/
│   ├── parser/
│   │   ├── mdParser.ts             # Deterministic Markdown AST Lexer
│   │   ├── sanitizer.ts            # Strips credentials, env vars before any AI contact
│   │   └── headerValidator.ts      # Required section enforcement (Iron Gate)
│   │
│   ├── orchestrator/
│   │   ├── localModel.ts           # Ollama/Qwen JSON-mode handler
│   │   ├── retryLoop.ts            # 3-strike choke point for malformed model output
│   │   └── cloudFallback.ts        # Gemini structured output (for paid tiers)
│   │
│   ├── engine/
│   │   ├── compliance.ts           # Core schema validation engine
│   │   ├── breachDetector.ts       # Breach Detection Matrix execution
│   │   └── reportCompiler.ts       # Generates human-readable breach report
│   │
│   ├── remediation/
│   │   ├── patchGenerator.ts       # Compiles corrected architecture Markdown
│   │   ├── testGenerator.ts        # Deterministic integration test scaffolding
│   │   └── overrideLogger.ts       # Records cryptographic override signatures
│   │
│   └── integrations/
│       ├── githubActions.ts        # GitHub Actions workflow generator
│       ├── gitHooks.ts             # pre-commit hook installer
│       └── sonarBridge.ts          # SonarQube findings bridge
│
├── schemas/
│   ├── compliance-spec.json        # Canonical validation schema (the constitution)
│   ├── ndpa-rules.json             # NDPA Article mappings
│   ├── cbn-rules.json              # CBN Cybersecurity Framework mappings
│   └── sec-rules.json              # SEC guidelines mappings
│
├── templates/
│   ├── patches/
│   │   ├── data-retention.md       # Template: data retention clause
│   │   ├── tls-config.md           # Template: TLS 1.3 configuration
│   │   └── mfa-enforcement.md      # Template: MFA architecture clause
│   └── tests/
│       ├── retention-test.js       # Template: NDPA retention integration test
│       ├── webhook-sig-test.js     # Template: Payment webhook signature test
│       └── auth-test.js            # Template: Auth architecture test
│
├── .nija-config.json               # Local environment: Ollama endpoint, model selection
├── package.json
└── tsconfig.json
```

### The Three CLI Commands

```bash
# Initialize nija-audit in a project
nija-audit init
# Drops compliance-spec.json + .nija-config.json + .git/hooks/pre-commit hook
# Prompts: system classification (FINTECH / HEALTHTECH / GENERAL)

# Primary validation pipeline
nija-audit check ./architecture/spec.md
# Runs: Iron Gate → Local Extraction → Schema Validation → Breach Detection
# Output: Colored terminal report + .nija/patches/ if breaches found

# Apply AI-generated remediation
nija-audit patch apply --id=<breach-id>
# Merges the generated architecture patch and integration test into project
# Requires human confirmation before writing to disk
```

### Terminal Output Design (The UX That Matters)

```bash
> nija-audit check ./architecture/payment-service.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  nija-audit v1.0.0 — Compliance Verification Engine
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[GATE]   Parsing Markdown AST...                ✓
[GATE]   Sanitizing for credential exposure...  ✓
[LOCAL]  Running local semantic extraction...   ✓
[ENGINE] Compiling against CBN schema...        ✓
[ENGINE] Compiling against NDPA schema...       ✓
[ENGINE] Running Breach Detection Matrix...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  BREACH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ [BREACH-001] CRITICAL — Data Retention Policy Absent
   Framework: NDPA Article 2.6.3 (Data Lifecycle Management)
   Finding:   Architecture declares BVN storage with no expiry protocol.
   Risk:      Regulatory fine + failed CBN audit.

❌ [BREACH-002] HIGH — TLS Version Unspecified
   Framework: CBN Cybersecurity Framework Section 4.2
   Finding:   Auth service transit encryption version not declared.
   Risk:      Automatic CBN non-compliance flag.

✅ [PASS]     MFA enforcement declared
✅ [PASS]     Payment webhook signature validation present
✅ [PASS]     Data residency declared as NG_LOCAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  REMEDIATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛠️  2 patches generated:
    → .nija/patches/BREACH-001-retention-fix.md
    → .nija/patches/BREACH-001-retention-test.js
    → .nija/patches/BREACH-002-tls-fix.md

    Run: nija-audit patch apply --id=BREACH-001
    Run: nija-audit patch apply --id=BREACH-002

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROCESS EXITED WITH CODE 1. Pipeline halted.
```

---

## Part V: The Realist's Assessment (New Risks in the Compliance Direction)

This is the section the original Compliance-as-Code conversation glossed over. Every strategic evolution introduces new risks. These must be named before they become surprises.

### New Risk #1: The Regulatory Currency Problem

The value of nija-audit's compliance rules depends entirely on those rules being **current and accurate**. Nigerian regulatory frameworks are not static documents:

- The CBN updates its cybersecurity framework guidelines periodically
- The NDPA implementing regulations are still being finalized by NITDA
- The SEC has evolving fintech-specific guidelines

**The uncomfortable implication:** nija-audit's core asset — its encoded regulatory rules — has a shelf life. Rules that were accurate in Q1 2026 may be incomplete by Q3 2026. If a startup uses nija-audit to "pass" a compliance check and then fails an actual CBN audit because nija-audit's rules were outdated, the reputational damage could be terminal.

**The mitigation:**
- Never market nija-audit as a *compliance certification* tool. Market it as a *gap analysis and architecture hygiene* tool. The semantic difference is significant: gap analysis surfaces risks; certification guarantees absence of risk. Only use language like "identifies potential non-compliance vectors" — never "certifies compliance."
- Build a regulatory update mechanism: quarterly schema updates with version-pinned changelogs. When a user runs `nija-audit check`, they should see: `Schema: CBN-Framework-v2.3.1 (Last updated: March 2026)`.
- Partner with a Nigerian compliance law firm (even informally) to validate schema updates. A single relationship with a tech-focused solicitor in Lagos who reviews quarterly schema updates is enough — this person becomes a validator and an advocate.

### New Risk #2: The Enterprise Sales Paradox

nija-audit's most valuable customers — established fintechs with CBN licenses and real regulatory exposure — also have the longest, most conservative procurement cycles.

**The realistic timeline:**
- A junior developer discovers nija-audit: Day 1
- They demo it to their tech lead: Week 2
- Tech lead brings it to the CTO: Month 2
- CTO sends it to legal for vendor assessment: Month 3
- Legal reviews ToS and data handling: Month 4–5
- Procurement negotiates pricing: Month 6
- nija-audit gets approved for use: Month 7–8

Meanwhile, the startup needs revenue in Month 2. This creates a funding gap that the original roadmap doesn't address.

**The two-track revenue model:**
- Track A (Individual Devs, Fast): Free tier and Startup tier (₦35k/month) targeting independent developers and small agencies who adopt immediately, no procurement cycle. This pays the API bills.
- Track B (Enterprise, Slow): Pilot programs with target fintechs — offer a 90-day free enterprise evaluation in exchange for a case study and introduction to their network. This closes at ₦200k–500k/month but takes 6–8 months to land.

Run both tracks in parallel from Day 1. Never let Track B's slow cycle starve Track A's momentum.

### New Risk #3: The "We Already Have SonarQube" Objection

Any mature engineering team will respond to nija-audit's pitch with: *"We already run SonarQube / Snyk / Checkmarx in our pipeline. How is this different?"*

This is not a dismissal — it is a legitimate technical question that requires a crisp, specific answer.

**The answer that works:** "SonarQube finds code-level vulnerabilities in what you've already written. nija-audit audits your architectural specifications *before a line of code is written*. It checks whether your system design is compliant with Nigerian regulatory frameworks. By the time SonarQube sees the code, the architectural decisions that create compliance risk are already locked in. nija-audit catches those decisions at the blueprint stage."

This framing is accurate and positions nija-audit as **complementary to, not competing with** existing security tooling. It actually *bridges to SonarQube* (the sonarBridge.ts module) by generating failing tests that surface in existing pipelines.

Prepare this answer. Practice it until it takes 20 seconds to deliver. You will need it in every enterprise conversation.

### New Risk #4: The Knowledge Gap Is Bidirectional

nija-audit's Iron Gate requires that developers write structured Markdown specifications before the tool can add value. The Deep Blueprint raised this exact problem as the "Who owns the spec?" roadblock — and it applies here even more acutely.

Enterprise fintechs have architecture documents — but they're in Confluence, Notion, Google Docs, or PowerPoint decks written by non-technical project managers. Not Markdown.

**The solution is the same as proposed in the Deep Blueprint, but even more important here:** Build a `nija-audit convert` command that accepts:
- Unstructured text (paste from Confluence)
- PDF documents
- Plain English description

And outputs a draft architecture spec in the required Markdown format, which the developer then reviews and commits. This is the "spec wizard" pattern — and for the compliance use case, it's not a nice-to-have. It is the onboarding ramp without which most enterprise customers will never reach the core product.

---

## Part VI: The Product Roadmap (Integrated & Realistic)

### Phase 1: The Iron Core (Weeks 1–4)
*Goal: Working CLI that validates a Markdown spec against one regulatory rule set.*

| Week | Task | Output |
|---|---|---|
| 1 | Build `mdParser.ts` — AST lexer with required header enforcement | Iron Gate that halts on missing sections |
| 1 | Write the NDPA data retention rule schema (one rule, done properly) | `ndpa-rules.json` v0.1 |
| 2 | Build `localModel.ts` — Ollama/Qwen JSON-mode integration | Semantic extraction pipeline |
| 2 | Build `retryLoop.ts` — 3-strike malformed output halter | Choke point that never passes bad JSON |
| 3 | Build `breachDetector.ts` — validate extracted JSON against rule schema | Breach report with regulatory citations |
| 3 | Build `patchGenerator.ts` — template-based Markdown patch output | First generated fix file |
| 4 | Wire into CLI: `nija-audit check <file>` | Runnable end-to-end demo |

**Week 4 success criterion:** Run `nija-audit check` on a deliberately broken architecture spec and see: (1) the Iron Gate pass, (2) the breach identified with NDPA article citation, (3) a generated patch in `.nija/patches/`. If all three work, Phase 1 is complete.

### Phase 2: The Regulatory Library (Weeks 5–8)
*Goal: Cover the three core frameworks that matter for Nigerian fintechs.*

| Week | Task | Output |
|---|---|---|
| 5 | Encode CBN Cybersecurity Framework rules (authentication, transit, audit logging) | `cbn-rules.json` v1.0 |
| 6 | Encode NDPA rules (PII classification, data residency, retention) | `ndpa-rules.json` v1.0 |
| 7 | Build `testGenerator.ts` — deterministic integration test scaffolding for each breach type | Working test file generation |
| 7 | Add `nija-audit init` command with Git hook installer | One-command project setup |
| 8 | Add `nija-audit patch apply` command | Full dual-enforcement loop |

**Week 8 success criterion:** A complete, realistic architecture spec runs through the full pipeline — Iron Gate → extraction → two regulatory checks → breach report → patch generation → test file generation. Share with three beta users from developer communities.

### Phase 3: The Distribution Layer (Weeks 9–12)
*Goal: Get nija-audit into real development pipelines.*

| Week | Task | Output |
|---|---|---|
| 9 | Build GitHub Actions workflow generator (`nija-audit actions init`) | CI/CD integration with one command |
| 10 | Publish to npm registry (`npm install -g nija-audit`) | Public, discoverable package |
| 10 | Create demo repo with sample architecture specs and recorded terminal output | Marketing asset for content |
| 11 | Write 3 blog posts: "Your Nigerian fintech spec probably violates NDPA", "What CBN actually requires from your auth architecture", "How we caught a data retention violation at the spec stage" | SEO-grade developer content |
| 12 | Reach out to 5 Nigerian fintech CTOs — offer free 90-day enterprise pilot | First enterprise pipeline |

### Phase 4: Revenue Activation (Month 4–6)
*Goal: First ₦100k MRR milestone.*

| Action | Target | Timeline |
|---|---|---|
| Launch paid Startup tier (₦35k/month) — personal API key, unlimited checks | 5 paying customers | Month 4 |
| Launch paid Agency tier (₦75k/month) — multi-project, priority support | 2 paying customers | Month 5 |
| Close first enterprise pilot (₦150k–200k/month, 90-day commitment) | 1 enterprise customer | Month 6 |
| Monthly MRR at end of Phase 4 | ₦5 × ₦35k + ₦2 × ₦75k + ₦1 × ₦175k | ~₦500k/month |

---

## Part VII: The Pricing Architecture (Revised)

### Tier Structure

| Tier | Monthly | Annual | Target Customer | Core Value |
|---|---|---|---|---|
| Free | ₦0 | N/A | Individual devs, open source | 3 checks/day, NDPA rules only |
| Developer | ₦25,000 | ₦240,000 | Indie devs, freelancers | Unlimited checks, all rule sets, personal API key |
| Startup | ₦60,000 | ₦576,000 | Small product teams (< 10 devs) | Team workspace, GitHub Actions, email support |
| Agency | ₦120,000 | ₦1,152,000 | Dev agencies, 10–50 dev teams | Multi-project, SonarQube bridge, priority support |
| Enterprise | ₦250,000+ | Custom | Licensed fintechs, banks, enterprise | Custom rule sets, audit reports, SLA, onboarding |

### The Annual Plan Psychology
Getting customers on annual plans is the single highest-leverage pricing action available. A startup team that pays ₦576,000 upfront will push through product rough patches that would cause a monthly subscriber to churn.

Set the annual discount at exactly 20% (two months free). Not 10%, not 30%. Twenty percent is the psychological sweet spot — large enough to feel like a real deal, small enough to preserve margin.

### The Enterprise Compliance Report Premium
Add-on for Enterprise tier: ₦50,000 per audit report. This is a PDF-format, human-readable compliance gap analysis report generated from a full spec scan — formatted for a CTO to present to their board, to include in a CBN submission, or to attach to investor due diligence materials.

The engineering cost of generating this report is minimal (template + structured output). The willingness to pay is high — if this report helps a startup pass due diligence and close a ₦200 million Series A, ₦50,000 is noise.

---

## Part VIII: The Honest Risk Register (Updated)

| Risk | Probability | Impact | Status |
|---|---|---|---|
| Regulatory rules become outdated | HIGH | HIGH | Mitigate: quarterly schema updates + law firm partner |
| Enterprise procurement cycles starve early revenue | HIGH | HIGH | Mitigate: two-track revenue model |
| "We already have SonarQube" objection | HIGH | MEDIUM | Mitigate: "design-time vs. code-time" positioning |
| Spec authoring behavior gap | HIGH | HIGH | Mitigate: `nija-audit convert` command (spec wizard) |
| Naira depreciation erodes margins | HIGH | HIGH | Mitigate: USD-indexed pricing tier, USD enterprise invoicing |
| Well-funded diaspora clone | MEDIUM | HIGH | Window: 18 months. Move fast. |
| Legal liability if compliance report fails | MEDIUM | HIGH | Mitigate: "gap analysis" language, never "certification" |
| Solo founder burnout | HIGH | EXISTENTIAL | Mitigate: co-maintainer agreement, explicit SLA disclosure |
| Ollama local model quality insufficient | MEDIUM | HIGH | Mitigate: Gemini cloud fallback, paid tier uses Gemini |
| nija-audit generates false positive — blocks valid spec | MEDIUM | MEDIUM | Mitigate: cryptographic override mechanism + feedback loop |

---

## Part IX: What Has Not Changed

Across all three iterations — NijaSpec, the Deep Blueprint, and now nija-audit — certain fundamentals have remained constant and deserve explicit acknowledgment:

**1. The Trust Engine Architecture Is The Foundation**
The JSON-first, deterministic compilation pattern from the Trust Engine document is nija-audit's core technical advantage. Do not deviate from it. The LLM handles understanding. The local script handles code. The schema handles correctness.

**2. The CLI Comes First**
No dashboard, no web app, no browser extension until the CLI proves the core loop. The CLI is not a simplified version of the real product — it *is* the real product. The dashboard is just paint on steel.

**3. Spec-Driven Architecture Is the Entire Business
The entire value chain of nija-audit depends on specifications existing and being treated as the source of truth. Every marketing effort, every demo, every enterprise conversation must reinforce this: *write the spec first, and nija-audit will verify everything downstream.* This is not just a product feature — it is a behavioral change mission.

**4. Nigerian Regulatory Context Is the Moat**
A generic "compliance-as-code" tool built for any market is a feature, not a company. A compliance-as-code tool that knows Nigerian regulatory frameworks by name, by article number, and by fine structure is a necessity for any Nigerian tech company that wants to survive. Never generalize this too early. Own the Nigerian market first, then expand.

---

## Final Note: What This Document Means

You began with an idea about making Nigerian developers test their APIs faster. Through three iterations of rigorous thinking, that idea has evolved into a compliance enforcement engine designed to sit at the entry point of every Nigerian software delivery pipeline.

That evolution happened because you asked better questions at each stage: *Who is actually in pain? Why would they pay? What would kill this business? What makes this defensible?*

The terminal is not waiting for a testing tool anymore. It is waiting for a compliance fortress.

**The name of the project folder is `nija-audit`.**  
**The first file you write is `mdParser.ts`.**  
**The first rule you encode is NDPA Article 2.6.3.**

Everything else follows from that.

---

**Document Version:** 3.0  
**Supersedes:** NijaSpec_Analysis.md v1.0, NijaSpec_DeepBlueprint.md v2.0, NijaSpec_TrustEngine_Architecture.md  
**Next Review Trigger:** After first 5 beta users complete full check pipeline
