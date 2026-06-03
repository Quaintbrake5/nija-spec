# NijaSpec — Monetization Strategy

**Doc status:** Draft (v0.1)  
**Last updated:** 2026-06-03  
**Owner:** Product/Strategy  

---

## 1. Executive Summary

NijaSpec provides "Trust Infrastructure" for software delivery by ensuring measurable alignment between requirements (specs) and implementation (code). The monetization strategy leverages a **Freemium-to-Enterprise** model, transitioning from a free developer tool (CLI) to a high-value organizational compliance and audit platform (Hosted Dashboard).

The core value shift is:

- **Developer Level:** Efficiency and confidence (CLI).
- **Team Level:** Alignment and regression prevention (Hosted/Project Mgmt).
- **Org/Client Level:** Risk mitigation and proof-of-delivery (Compliance/Audit).

---

## 2. Value Proposition Mapping

| Tier | Primary User | Core Value | Primary Tooling |
| :--- | :--- | :--- | :--- |
| **Community** | Individual Dev / OS | "Does my code match the spec?" | CLI |
| **Pro** | Engineering Teams | "Are we shipping what we agreed?" | CLI + Team Dashboard |
| **Enterprise** | Agencies / Large Orgs | "Can we prove compliance and delivery?" | CLI + Full Trust Engine |

---

## 3. Pricing Tiers

### 3.1 Community (Free)

*Target: Individual developers, students, and open-source projects.*

- **Price:** $0 / mo
- **Features:**
  - Full access to `nija-audit` CLI.
  - Local LLM support (Ollama/Gemma).
  - Limited cloud LLM credits (initial onboarding).
  - Basic spec generation and verification.
  - Public project visibility (if using hosted mode).

### 3.2 Pro (Team)

*Target: Small-to-medium engineering teams and startups.*

- **Price:** $49 - $99 / month / team (or per-seat pricing)
- **Features:**
  - Everything in Community.
  - **Hosted Dashboard:** Project management, run history, and artifact persistence.
  - **Team Collaboration:** Shared specs, shared run manifests.
  - **CI/CD Integration:** Native GitHub/GitLab Actions templates with hosted reporting.
  - **Advanced LLM Options:** Access to premium models (GPT-4, Claude 3.5, Gemini 1.5 Pro).
  - **Increased Run Limits:** Higher quota for cloud-based spec extraction.

### 3.3 Enterprise (Organization/Agency)

*Target: Large fintechs, software agencies, and regulated industries.*

- **Price:** Custom Annual Contract (Enterprise License)
- **Features:**
  - Everything in Pro.
  - **Custom Compliance Matrices:** Define organization-specific breach detection rules (e.g., specific CBN/NDPA requirements).
  - **Self-Hosted / Private Cloud:** Deploy the Trust Engine within the organization's VPC for maximum security.
  - **"Verified Delivery" Certification:** Official NijaSpec reports for client milestone acceptance (the "Green/Red Receipt").
  - **SSO & Advanced IAM:** SAML/OIDC integration, granular role-based access control.
  - **Dedicated Support:** SLA-backed support and onboarding assistance.
  - **Audit Logs:** Full immutable history of spec changes and verification runs.

---

## 4. Subscription & Billing Model

### 4.1 Hybrid Billing

To balance the high cost of LLM tokens with predictable subscription revenue, NijaSpec uses a hybrid model:

- **Base Subscription:** Covers platform access, dashboard, and storage.
- **Usage Credits:** A quota of "Audit Credits" per month.
  - 1 Credit = 1 Spec Extraction or 1 Test Generation run.
  - Credits can be topped up as needed.
- **BYOK (Bring Your Own Key):** Enterprise users can provide their own LLM API keys to avoid credit limits and pay providers directly.

### 4.2 Regional Pricing (The African Context)

To penetrate the African market and hedge against FX volatility:

- **USD-Indexed, NGN-Payable:** Prices are pegged to a USD basket but payable in local currency (NGN, KES, GHS) via local gateways (Paystack/Flutterwave).
- **Localized Tiering:** Adjusted pricing for early-stage African startups to encourage adoption.

---

## 5. Key Monetizable Features (The "Paywalls")

1. **The Stakeholder Report:** The ability to generate a high-level, non-technical "Acceptance Report" for clients/managers is a primary driver for the Pro/Enterprise tiers.
2. **Compliance Guardrails:** Automated detection of regulatory breaches (e.g., "Missing webhook signature verification for Paystack") is a high-value Enterprise feature.
3. **Private Infrastructure:** Moving from shared cloud to private VPC for security-conscious fintechs.
4. **Verification-as-a-Service:** Agencies paying to certify their delivery as "NijaSpec Verified" to win more high-ticket contracts.

---

## 6. Go-to-Market Strategy

1. **Bottom-Up Adoption (PLG):** Drive CLI adoption among developers $\rightarrow$ introduce Team Dashboard $\rightarrow$ upsell to Enterprise.
2. **Agency Partnerships:** Partner with software agencies as a "Quality Assurance" partner. The agency pays for the tool, and the end-client receives the "Verified" report.
3. **Fintech Ecosystem Play:** Market specifically to teams integrating with African payment gateways, positioning NijaSpec as the "Standard for Fintech Integration Testing".
