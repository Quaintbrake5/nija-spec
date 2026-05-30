package compliance;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MFATest {
    @Test
    void testVerifyMFAEnabled() {
        Config config = Config.load();
        assertEquals("Enabled", config.getAuthentication().getMfa(),
            "MFA must be enabled");
    }
}
