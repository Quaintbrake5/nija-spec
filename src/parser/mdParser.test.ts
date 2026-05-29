import { MdParser } from './mdParser';

describe('MdParser', () => {
  it('should parse non-empty lines into AST', () => {
    const content = '# Infrastructure\n- Hosting: AWS\n\n# Auth\n- TLS: 1.2';
    const result = MdParser.parse(content);
    expect(result.success).toBe(true);
    expect(result.ast).toEqual(['# Infrastructure', '- Hosting: AWS', '# Auth', '- TLS: 1.2']);
  });

  it('should return null ast for empty content', () => {
    const result = MdParser.parse('');
    expect(result.success).toBe(true);
    expect(result.ast).toEqual([]);
  });

  it('should filter blank lines', () => {
    const content = 'line1\n\n\nline2\n\nline3';
    const result = MdParser.parse(content);
    expect(result.ast).toEqual(['line1', 'line2', 'line3']);
  });

  it('should handle Windows line endings', () => {
    const content = 'line1\r\nline2\r\nline3';
    const result = MdParser.parse(content);
    expect(result.ast).toEqual(['line1', 'line2', 'line3']);
  });
});
