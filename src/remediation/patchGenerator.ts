export class PatchGenerator {
  /**
   * Compiles corrected architecture Markdown.
   * uses template-based output to ensure deterministic remediation.
   */
  static generatePatch(breachId: string, data: any): string {
    if (breachId === 'BREACH-004') {
      const residency = data.infrastructure?.data_residency;
      if (residency === 'Foreign') {
        return `## Data Residency (Remediation)\nSensitive PII data must be migrated to a Nigerian datacenter. Standard Contractual Clauses (SCCs) must be implemented for any remaining cross-border data transfers, as required by NDPA Article 2.10.`;
      }
      if (residency === 'Hybrid') {
        return `## Data Residency (Remediation)\nPartial compliance detected. All data categories must be documented, specifying which remain local and which are stored foreign, as required by NDPA Article 2.10.`;
      }
      return `## Data Residency (Remediation)\nThe system must ensure data residency compliance. Sensitive PII data should be stored within Nigeria or adequate safeguards must be in place for cross-border transfers, as required by NDPA Article 2.10.`;
    }

    const patches: Record<string, string> = {
      'BREACH-001': `## Data Retention Policy (Remediation)\nThe system must implement a hard-deletion protocol for PII data after ${data.retentionDays || 365} days as per NDPA Article 2.6.3.`,
      'BREACH-002': `## Transit Encryption (Remediation)\nAll endpoints must be upgraded to TLS 1.3 to meet CBN Cybersecurity Framework Section 4.2.`,
      'BREACH-003': `## PII Categories Documentation (Remediation)\nAll PII categories being processed by the system must be documented in the architecture spec. This includes, but is not limited to: names, addresses, biometric data, financial records, and health information, as required by NDPA Article 2.3.`,
      'BREACH-005': `## Multi-Factor Authentication (Remediation)\nMFA must be enabled for all user-facing endpoints and administrative access, as required by CBN Cybersecurity Framework Section 4.1.`,
      'BREACH-006': `## Security Classification (Remediation)\nA security classification level (PUBLIC, INTERNAL, CONFIDENTIAL, or RESTRICTED) must be assigned to the architecture spec, as required by CBN Section 3.5.`
    };

    return patches[breachId] || `## Remediation for ${breachId}\nPlease review the regulatory requirement and update the architecture spec.`;
  }
}

