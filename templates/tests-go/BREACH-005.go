package compliance

import (
	"testing"
)

func TestVerifyMFAEnabled(t *testing.T) {
	config := GetConfig()
	if config.Authentication.MFA != "Enabled" {
		t.Errorf("MFA must be enabled, got %s", config.Authentication.MFA)
	}
}