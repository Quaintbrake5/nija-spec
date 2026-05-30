"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sanitizer = void 0;
class Sanitizer {
    /**
     * Strips credentials, env vars, and sensitive patterns before any AI contact.
     * Prevents leaking API keys or secrets to cloud providers.
     */
    static sanitize(content) {
        return this.sanitizeWithReport(content).redactedContent;
    }
    /**
     * Sanitizes content and returns a detailed redaction report.
     */
    static sanitizeWithReport(content) {
        const secretPatterns = [
            { pattern: /(?:key|token|secret|password|auth)\w*\s*[:=]\s*['"]?[a-zA-Z0-9_\-]{16,}['"]?/gi, name: 'credential-key' },
            { pattern: /([a-zA-Z0-9]{32,})[=]{0,2}/g, name: 'long-alphanumeric' },
            { pattern: /sk_[a-zA-Z0-9]{32,}/g, name: 'secret-key-prefix' },
            { pattern: /(?:AKIA|ASIA)[A-Z0-9]{16}/g, name: 'aws-key' },
            { pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g, name: 'private-key' },
            { pattern: /(?:eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,})/g, name: 'jwt-token' },
        ];
        let sanitized = content;
        const foundPatterns = [];
        for (const { pattern, name } of secretPatterns) {
            const regex = new RegExp(pattern.source, pattern.flags);
            const matches = sanitized.match(regex);
            if (matches && matches.length > 0) {
                foundPatterns.push(`${name} (${matches.length} occurrences)`);
                sanitized = sanitized.replace(regex, '[REDACTED]');
            }
        }
        return {
            patterns: foundPatterns,
            count: foundPatterns.length,
            redactedContent: sanitized
        };
    }
}
exports.Sanitizer = Sanitizer;
