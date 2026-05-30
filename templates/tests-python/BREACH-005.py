import pytest


def test_verify_mfa_enabled():
    """Verify MFA is enabled."""
    config = get_config()
    assert "authentication" in config
    assert config["authentication"]["mfa"] == "Enabled"
