package compliance

import (
	"testing"
)

func TestRejectForeignDataResidency(t *testing.T) {
	config := GetConfig()
	residency := config.Infrastructure.DataResidency
	if residency != "Local" && residency != "Hybrid" {
		t.Errorf("Data residency must be Local or Hybrid, got %s", residency)
	}
}