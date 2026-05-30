test('should verify security classification is assigned', async () => {
  const config = getConfig();
  expect(config.audit_metadata.classification).toBeDefined();
  expect(config.audit_metadata.classification.length).toBeGreaterThan(0);
});
