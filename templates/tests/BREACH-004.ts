test('should reject foreign data residency without safeguards', async () => {
  const config = getConfig();
  expect(['Local', 'Hybrid']).toContain(config.infrastructure.data_residency);
});
