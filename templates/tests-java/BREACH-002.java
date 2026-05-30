package compliance;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TLSVersionTest {
    @Test
    void testEnforceTLSVersion() {
        Config config = Config.load();
        String tls = config.getAuthentication().getTlsVersion();
        assertTrue(tls.equals("1.2") || tls.equals("1.3"),
            "TLS version must be 1.2 or 1.3, got " + tls);
    }
}
