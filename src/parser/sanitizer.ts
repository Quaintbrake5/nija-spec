export class Sanitizer {
  /**
   * Strips credentials, env vars, and sensitive patterns before any AI contact.
   * Prevents leaking API keys or secrets to cloud providers.
   */
  static sanitize(content: string): string {
    // Regex for common secret patterns (API keys, tokens, passwords)
    const secretPatterns = [
      /(?:key|token|secret|password|auth)\w*\s*[:=]\s*['"]?[a-zA-Z0-9_\-]{16,}['"]?/gi,
      /([a-zA-Z0-9]{32,})[=]{0,2}/g, // Generic long alphanumeric strings
      /sk_[a-zA-Z0-9]{32,}/g,        // Common secret key prefix
    ];

    let sanitized = content;
    for (const pattern of secretPatterns) {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    }

    return sanitized;
  }
}
