package compliance;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DataResidencyTest {
    @Test
    void testRejectForeignDataResidency() {
        Config config = Config.load();
        String residency = config.getInfrastructure().getDataResidency();
        assertTrue(residency.equals("Local") || residency.equals("Hybrid"),
            "Data residency must be Local or Hybrid, got " + residency);
    }
}
