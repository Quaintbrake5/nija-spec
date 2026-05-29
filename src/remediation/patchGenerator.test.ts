import { PatchGenerator } from './patchGenerator';

describe('PatchGenerator', () => {
  it('should generate patch for BREACH-001', () => {
    const data = { retentionDays: 365 };
    const patch = PatchGenerator.generatePatch('BREACH-001', data);
    expect(patch).toContain('Data Retention Policy');
    expect(patch).toContain('NDPA Article 2.6.3');
  });

  it('should generate patch for BREACH-002', () => {
    const patch = PatchGenerator.generatePatch('BREACH-002', {});
    expect(patch).toContain('Transit Encryption');
    expect(patch).toContain('CBN Cybersecurity Framework');
  });

  it('should generate generic patch for unknown breach ID', () => {
    const patch = PatchGenerator.generatePatch('BREACH-999', {});
    expect(patch).toContain('BREACH-999');
    expect(patch).toContain('Remediation');
  });

  it('should use custom retention days', () => {
    const data = { retentionDays: 90 };
    const patch = PatchGenerator.generatePatch('BREACH-001', data);
    expect(patch).toContain('90');
  });
});
