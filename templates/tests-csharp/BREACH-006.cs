using Xunit;

namespace Compliance.Tests
{
    public class SecurityClassificationTests
    {
        [Fact]
        public void TestVerifySecurityClassification()
        {
            var config = Config.Load();
            Assert.False(string.IsNullOrEmpty(config.AuditMetadata.Classification));
        }
    }
}
