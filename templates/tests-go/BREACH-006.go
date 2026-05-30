package compliance

import (
	"testing"
)

func TestVerifySecurityClassification(t *testing.T) {
	config := GetConfig()
	if config.AuditMetadata.Classification == "" {
		t.Error("Security classification must be assigned")
	}
}