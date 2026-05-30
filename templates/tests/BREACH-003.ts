test('should verify PII categories are documented', async () => {
  const config = getConfig();
  expect(config.data_lifecycle.pii_categories).toBeDefined();
  expect(config.data_lifecycle.pii_categories.length).toBeGreaterThan(0);
});
