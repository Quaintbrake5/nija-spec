
test('should verify MFA is enabled', async () => {
  const config = getConfig();
  expect(config.authentication.mfa).toBe('Enabled');
});