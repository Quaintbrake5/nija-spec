package compliance;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class SecurityClassificationTest {
    @Test
    void testVerifySecurityClassification() {
        Config config = Config.load();
        assertFalse(config.getAuditMetadata().getClassification().isEmpty(),
            "Security classification must be assigned");
    }
}
