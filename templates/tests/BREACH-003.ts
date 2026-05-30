interface ComplianceConfig {
  infrastructure: { hosting: string; data_residency: 'Local' | 'Foreign' | 'Hybrid' };
  authentication: { mfa: 'Enabled' | 'Disabled'; tls_version: '1.1' | '1.2' | '1.3' };
  data_lifecycle: { pii_categories: string; retention: string };
  audit_metadata: { author: string; version: string; classification: string };
}
declare function getConfig(): ComplianceConfig;

test('should verify PII categories are documented', async () => {
  const config = getConfig();
  expect(config.data_lifecycle.pii_categories).toBeDefined();
  expect(config.data_lifecycle.pii_categories.length).toBeGreaterThan(0);
});
