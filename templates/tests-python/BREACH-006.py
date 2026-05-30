import pytest


def test_verify_security_classification():
    """Verify security classification is assigned."""
    config = get_config()
    assert "audit_metadata" in config
    assert "classification" in config["audit_metadata"]
    assert len(config["audit_metadata"]["classification"]) > 0
