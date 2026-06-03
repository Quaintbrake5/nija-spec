# International Expansion Plan: NijaSpec

This document outlines the strategy for expanding NijaSpec to support global markets, focusing on accessibility, regional legality, and scalable infrastructure.

## 1. Multi-language Support (UI)

To enable a global user base, NijaSpec will transition from a hard-coded English UI to a dynamic internationalization (i18n) framework.

### Technical Approach

- **i18next Integration**: Implement `i18next` and `react-i18next` in the `nija-frontend`.
- **Translation Keys**: Replace all static text in components with translation keys (e.g., `t('dashboard.welcome')`).
- **Language Switching**: Add a language selector in the `Topbar` component allowing users to switch between supported languages.
- **Dynamic Loading**: Load translation bundles (`en.json`, `fr.json`, `es.json`, etc.) asynchronously to minimize initial bundle size.

### Supported Languages (Phase 1)

- English (Global Default)
- French (West African markets)
- Spanish (Latin American markets)
- Arabic (MENA region)

## 2. Localization (L10n)

Localization goes beyond translation to ensure the product feels native to each region.

### Key Areas of Focus

- **Date and Time Formatting**: Use `date-fns` or the native `Intl` API to handle regional date formats (e.g., DD/MM/YYYY vs MM/DD/YYYY) and time zones.
- **Currency & Number Formatting**: Implement locale-aware currency symbols and decimal separators (e.g., using `.` or `,`).
- **Right-to-Left (RTL) Support**: Implement RTL layout mirroring for languages like Arabic using CSS logical properties (e.g., `margin-inline-start` instead of `margin-left`).
- **Cultural Adaptation**: Review terminology and iconography to ensure they are culturally appropriate and avoid regional sensitivities.

## 3. Regional Compliance Frameworks

NijaSpec's core value is compliance. Expanding internationally requires integrating regional legal and technical standards.

### Targeted Frameworks

- **Europe (EU)**:
  - **GDPR**: General Data Protection Regulation for strict data privacy and "Right to be Forgotten."
  - **EU AI Act**: Ensuring AI-generated remediation follows transparency and risk-mitigation guidelines.
- **North America (USA/Canada)**:
  - **HIPAA**: For specifications involving healthcare data.
  - **SOC2**: Maintaining rigorous security and availability controls.
- **Asia-Pacific (APAC)**:
  - **APPI (Japan)**: Act on the Protection of Personal Information.
  - **PDPA (Singapore/Thailand)**: Personal Data Protection Acts.
- **Africa**:
  - **NDPA (Nigeria)**: Expanding current support for Nigerian Data Protection Act.
  - **POPIA (South Africa)**: Protection of Personal Information Act.

### Implementation Strategy

- **Compliance Matrices**: Expand the Breach Detection Matrix in the `engine/` to include regional-specific rule sets.
- **Pluggable Schemas**: Use JSON schemas in `schemas/` that can be toggled based on the organization's regional setting.

## 4. Global Deployment Strategies

To maintain performance and satisfy data residency laws, NijaSpec will move toward a distributed architecture.

### Infrastructure Strategy

- **Multi-Region Cloud Deployment**: Deploy backend instances across multiple AWS/Azure/GCP regions (e.g., `us-east-1`, `eu-central-1`, `af-south-1`).
- **Data Residency (Sovereignty)**: Implement "Regional Sharding" where user data is stored exclusively in the region where the organization is registered to comply with laws like GDPR.
- **Edge Acceleration**: Use a Content Delivery Network (CDN) like Cloudflare or AWS CloudFront to cache the `nija-frontend` assets globally.
- **Localized LLM Inference**:
  - Deploy local Ollama/Qwen instances in regional data centers to reduce latency.
  - Utilize regional API endpoints for cloud providers (Gemini/OpenAI) to ensure data stays within geopolitical boundaries.

## 5. Implementation Roadmap

| Phase | Focus | Key Milestone | Timeline |
| :--- | :--- | :--- | :--- |
| **Phase 1** | i18n Foundation | UI translated to French/Spanish; i18next integrated | Q3 2026 |
| **Phase 2** | Regional Compliance | GDPR and POPIA modules added to Trust Engine | Q4 2026 |
| **Phase 3** | Infrastructure | Multi-region deployment & data sharding active | Q1 2027 |
| **Phase 4** | Full L10n | RTL support and full cultural adaptation | Q2 2027 |
