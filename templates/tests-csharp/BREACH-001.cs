using Xunit;

namespace Compliance.Tests
{
    public class DataRetentionTests
    {
        [Fact]
        public void TestEnforceDataRetentionPolicy()
        {
            var config = Config.Load();
            Assert.True(config.DataLifecycle.Retention > 0);
            Assert.True(config.DataLifecycle.Retention <= 365);
        }
    }
}
