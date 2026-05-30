test('should enforce data retention policy', async () => {
  const config = getConfig();
  expect(config.data_lifecycle.retention).toBeDefined();
  const retentionDays = parseInt(config.data_lifecycle.retention, 10);
  expect(retentionDays).toBeGreaterThan(0);
  expect(retentionDays).toBeLessThanOrEqual(365);
});
