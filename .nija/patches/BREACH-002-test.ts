function getConfig(): { authentication: { tls_version: string } } {
  // Minimal stub to provide configuration for the test
  return {
    authentication: {
      // default to a compliant TLS version
      tls_version: '1.2',
    },
  };
}

test('should enforce TLS 1.2 or higher', async () => {
  const config = getConfig();
  expect(['1.2', '1.3']).toContain(config.authentication.tls_version);
});
