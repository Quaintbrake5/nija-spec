using Xunit;

namespace Compliance.Tests
{
    public class MFATests
    {
        [Fact]
        public void TestVerifyMFAEnabled()
        {
            var config = Config.Load();
            Assert.Equal("Enabled", config.Authentication.Mfa);
        }
    }
}
