package compliance

import (
	"testing"
)

func TestEnforceDataRetentionPolicy(t *testing.T) {
	config := GetConfig()
	retention := config.DataLifecycle.Retention
	if retention <= 0 || retention > 365 {
		t.Errorf("Data retention policy must be between 1 and 365 days, got %d", retention)
	}
}