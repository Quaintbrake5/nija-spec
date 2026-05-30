package compliance

import (
	"testing"
)

func TestEnforceTLSVersion(t *testing.T) {
	config := GetConfig()
	tlsVersion := config.Authentication.TLSVersion
	if tlsVersion != "1.2" && tlsVersion != "1.3" {
		t.Errorf("TLS version must be 1.2 or 1.3, got %s", tlsVersion)
	}
}