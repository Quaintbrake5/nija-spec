import { BreachDetector } from './breachDetector';

describe('BreachDetector', () => {
  const rules = [
    {
      id: 'BREACH-001',
      severity: 'CRITICAL' as const,
      framework: 'NDPA',
      path: 'data_lifecycle.retention',
      type: 'required',
      finding: 'Data Retention Policy Absent',
      risk: 'Regulatory fine',
      article: 'NDPA 2.6.3'
    },
    {
      id: 'BREACH-002',
      severity: 'HIGH' as const,
      framework: 'CBN',
      path: 'authentication.tls_version',
      type: 'enum',
      values: ['1.2', '1.3'],
      finding: 'TLS Version Unspecified',
      risk: 'Automatic non-compliance flag',
      article: 'CBN 4.2'
    }
  ];

  it('should detect missing required field', () => {
    const data = { authentication: { tls_version: '1.2' } };
    const breaches = BreachDetector.detect(data, rules);
    expect(breaches).toHaveLength(1);
    expect(breaches[0].id).toBe('BREACH-001');
  });

  it('should detect invalid enum value', () => {
    const data = {
      data_lifecycle: { retention: '90 days' },
      authentication: { tls_version: '1.1' }
    };
    const breaches = BreachDetector.detect(data, rules);
    expect(breaches).toHaveLength(1);
    expect(breaches[0].id).toBe('BREACH-002');
  });

  it('should pass when data is compliant', () => {
    const data = {
      data_lifecycle: { retention: '90 days' },
      authentication: { tls_version: '1.2' }
    };
    const breaches = BreachDetector.detect(data, rules);
    expect(breaches).toHaveLength(0);
  });

  it('should detect multiple breaches', () => {
    const data = {};
    const breaches = BreachDetector.detect(data, rules);
    expect(breaches).toHaveLength(2);
  });

  it('should return correct breach structure', () => {
    const data = {};
    const breaches = BreachDetector.detect(data, rules);
    expect(breaches[0]).toHaveProperty('id');
    expect(breaches[0]).toHaveProperty('severity');
    expect(breaches[0]).toHaveProperty('framework');
    expect(breaches[0]).toHaveProperty('finding');
    expect(breaches[0]).toHaveProperty('risk');
    expect(breaches[0]).toHaveProperty('article');
  });
});
