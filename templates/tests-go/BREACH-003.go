package compliance

import (
	"testing"
)

func TestVerifyPIICategoriesDocumented(t *testing.T) {
	config := GetConfig()
	if len(config.DataLifecycle.PIICategories) == 0 {
		t.Error("PII categories must be documented")
	}
}