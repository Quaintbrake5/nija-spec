package compliance;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DataRetentionTest {
    @Test
    void testEnforceDataRetentionPolicy() {
        Config config = Config.load();
        int retention = config.getDataLifecycle().getRetention();
        assertTrue(retention > 0, "Retention must be positive");
        assertTrue(retention <= 365, "Retention must not exceed 365 days");
    }
}
