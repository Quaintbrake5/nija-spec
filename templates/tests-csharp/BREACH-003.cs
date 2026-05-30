using Xunit;

namespace Compliance.Tests
{
    public class PIICategoriesTests
    {
        [Fact]
        public void TestVerifyPIICategoriesDocumented()
        {
            var config = Config.Load();
            Assert.NotEmpty(config.DataLifecycle.PiiCategories);
        }
    }
}
