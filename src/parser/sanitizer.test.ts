import { Sanitizer } from './sanitizer';

describe('Sanitizer', () => {
  it('should redact API keys', () => {
    const input = 'api_key: abcdefghijklmnop1234';
    const result = Sanitizer.sanitize(input);
    expect(result).toContain('[REDACTED]');
    expect(result).not.toContain('abcdefghijklmnop1234');
  });

  it('should redact token patterns', () => {
    const input = 'token=abcdefghij1234567890';
    const result = Sanitizer.sanitize(input);
    expect(result).toContain('[REDACTED]');
  });

  it('should redact sk_ prefixed secrets', () => {
    const input = 'sk_abcdefghijklmnopqrstuvwxyz123456';
    const result = Sanitizer.sanitize(input);
    expect(result).toContain('[REDACTED]');
  });

  it('should not redact short strings', () => {
    const input = 'short: abc';
    const result = Sanitizer.sanitize(input);
    expect(result).toBe(input);
  });

  it('should handle multiple secrets in one string', () => {
    const input = 'key1: abcdefghijklmnop1234 and token=abcdefghijklmnop1234';
    const result = Sanitizer.sanitize(input);
    const redactedCount = (result.match(/\[REDACTED\]/g) || []).length;
    expect(redactedCount).toBeGreaterThanOrEqual(2);
  });
});
