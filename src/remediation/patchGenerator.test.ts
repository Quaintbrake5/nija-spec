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

  it('should generate patch for BREACH-003', () => {
    const patch = PatchGenerator.generatePatch('BREACH-003', {});
    expect(patch).toContain('PII');
    expect(patch).toContain('NDPA Article 2.3');
  });

  it('should generate patch for BREACH-004 with Foreign residency', () => {
    const data = { infrastructure: { data_residency: 'Foreign' } };
    const patch = PatchGenerator.generatePatch('BREACH-004', data);
    expect(patch).toContain('Nigerian datacenter');
    expect(patch).toContain('SCC');
    expect(patch).toContain('NDPA Article 2.10');
  });

  it('should generate patch for BREACH-004 with Hybrid residency', () => {
    const data = { infrastructure: { data_residency: 'Hybrid' } };
    const patch = PatchGenerator.generatePatch('BREACH-004', data);
    expect(patch).toContain('Partial compliance');
    expect(patch).toContain('NDPA Article 2.10');
  });

  it('should generate patch for BREACH-005', () => {
    const patch = PatchGenerator.generatePatch('BREACH-005', {});
    expect(patch).toContain('MFA');
    expect(patch).toContain('CBN');
    expect(patch).toContain('4.1');
  });

  it('should generate patch for BREACH-006', () => {
    const patch = PatchGenerator.generatePatch('BREACH-006', {});
    expect(patch).toContain('classification');
    expect(patch).toContain('CBN');
    expect(patch).toContain('3.5');
  });
});
