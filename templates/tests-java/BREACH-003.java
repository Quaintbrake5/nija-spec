package compliance;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PIICategoriesTest {
    @Test
    void testVerifyPIICategoriesDocumented() {
        Config config = Config.load();
        assertFalse(config.getDataLifecycle().getPiiCategories().isEmpty(),
            "PII categories must be documented");
    }
}
