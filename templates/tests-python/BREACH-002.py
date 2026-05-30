import pytest


def test_enforce_tls_1_2_or_higher():
    """Verify TLS version is 1.2 or higher."""
    config = get_config()
    assert "authentication" in config
    assert config["authentication"]["tls_version"] in ["1.2", "1.3"]
