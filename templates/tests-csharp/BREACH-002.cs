using Xunit;

namespace Compliance.Tests
{
    public class TLSVersionTests
    {
        [Fact]
        public void TestEnforceTLSVersion()
        {
            var config = Config.Load();
            Assert.Contains(config.Authentication.TlsVersion, new[] { "1.2", "1.3" });
        }
    }
}
