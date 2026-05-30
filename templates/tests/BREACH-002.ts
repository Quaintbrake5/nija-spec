test('should enforce TLS 1.2 or higher', async () => {
  const config = getConfig();
  expect(['1.2', '1.3']).toContain(config.authentication.tls_version);
});
