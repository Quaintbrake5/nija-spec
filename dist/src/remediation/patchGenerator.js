"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchGenerator = void 0;
class PatchGenerator {
    /**
     * Compiles corrected architecture Markdown.
     * uses template-based output to ensure deterministic remediation.
     */
    static generatePatch(breachId, data) {
        const patches = {
            'BREACH-001': `## Data Retention Policy (Remediation)
The system must implement a hard-deletion protocol for PII data after ${data.retentionDays || 365} days as per NDPA Article 2.6.3.`,
            'BREACH-002': `## Transit Encryption (Remediation)
All endpoints must be upgraded to TLS 1.3 to meet CBN Cybersecurity Framework Section 4.2.`
        };
        return patches[breachId] || `## Remediation for ${breachId}
Please review the regulatory requirement and update the architecture spec.`;
    }
}
exports.PatchGenerator = PatchGenerator;
