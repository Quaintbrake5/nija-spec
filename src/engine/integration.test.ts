import { MdParser } from '../parser/mdParser';
import { Sanitizer } from '../parser/sanitizer';
import { HeaderValidator } from '../parser/headerValidator';
import { MockExtractor } from '../orchestrator/mockExtractor';
import { ComplianceEngine } from './compliance';
import { BreachDetector } from './breachDetector';
import { Breach } from './breachDetector';
import fs from 'fs';
import path from 'path';

describe('Full Pipeline Integration (Golden Test)', () => {
  const testSpecPath = path.join(__dirname, '..', '..', 'test-spec.md');
  let rawContent: string;
  let allRules: any[];
  let complianceSchema: any;

  beforeAll(() => {
    rawContent = fs.readFileSync(testSpecPath, 'utf8');
    const ndpaRules = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'schemas', 'ndpa-rules.json'), 'utf8')
    );
    const cbnRules = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'schemas', 'cbn-rules.json'), 'utf8')
    );
    allRules = [...ndpaRules, ...cbnRules];
    complianceSchema = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'schemas', 'compliance-spec.json'), 'utf8')
    );
  });

  it('Phase 0 - Parse: MdParser.parse succeeds and returns non-null ast', () => {
    const result = MdParser.parse(rawContent);
    expect(result.success).toBe(true);
    expect(result.ast).not.toBeNull();
    expect(Array.isArray(result.ast)).toBe(true);
    expect(result.ast!.length).toBeGreaterThan(0);
  });

  it('Phase 0 - Sanitize: Sanitizer.sanitize returns content without crashing', () => {
    const sanitized = Sanitizer.sanitize(rawContent);
    expect(typeof sanitized).toBe('string');
    expect(sanitized.length).toBeGreaterThan(0);
  });

  it('Phase 0 - Headers: HeaderValidator.validate returns valid: true', () => {
    const parseResult = MdParser.parse(rawContent);
    const headerResult = HeaderValidator.validate(parseResult.ast!);
    expect(headerResult.valid).toBe(true);
    expect(headerResult.missing).toEqual([]);
  });

  it('Phase 1 - Extract: MockExtractor.extract returns all required section keys', () => {
    const extracted = MockExtractor.extract(rawContent);
    expect(extracted).toHaveProperty('infrastructure');
    expect(extracted).toHaveProperty('authentication');
    expect(extracted).toHaveProperty('data_lifecycle');
    expect(extracted).toHaveProperty('audit_metadata');
  });

  it('Phase 2 - Compliance: ComplianceEngine.validate returns valid: true', () => {
    const extracted = MockExtractor.extract(rawContent);
    const complianceResult = ComplianceEngine.validate(extracted, complianceSchema);
    expect(complianceResult.valid).toBe(true);
    expect(complianceResult.errors).toEqual([]);
  });

  it('Phase 2 - Breaches: BreachDetector.detect returns exactly 3 breaches', () => {
    const extracted = MockExtractor.extract(rawContent);
    const breaches: Breach[] = BreachDetector.detect(extracted, allRules);
    expect(breaches.length).toBe(3);
  });

  it('Phase 2 - Breach IDs: Detected breaches contain BREACH-002, BREACH-004, BREACH-005', () => {
    const extracted = MockExtractor.extract(rawContent);
    const breaches: Breach[] = BreachDetector.detect(extracted, allRules);
    const breachIds = breaches.map(b => b.id);
    expect(breachIds).toContain('BREACH-002');
    expect(breachIds).toContain('BREACH-004');
    expect(breachIds).toContain('BREACH-005');
  });

  it('Phase 2 - No False Positives: BREACH-001, BREACH-003, BREACH-006 are NOT detected', () => {
    const extracted = MockExtractor.extract(rawContent);
    const breaches: Breach[] = BreachDetector.detect(extracted, allRules);
    const breachIds = breaches.map(b => b.id);
    expect(breachIds).not.toContain('BREACH-001');
    expect(breachIds).not.toContain('BREACH-003');
    expect(breachIds).not.toContain('BREACH-006');
  });
});
