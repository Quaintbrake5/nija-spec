using Xunit;

namespace Compliance.Tests
{
    public class DataResidencyTests
    {
        [Fact]
        public void TestRejectForeignDataResidency()
        {
            var config = Config.Load();
            Assert.Contains(config.Infrastructure.DataResidency, new[] { "Local", "Hybrid" });
        }
    }
}
