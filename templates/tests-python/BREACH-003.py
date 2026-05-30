import pytest


def test_verify_pii_categories_documented():
    """Verify PII categories are documented."""
    config = get_config()
    assert "data_lifecycle" in config
    assert "pii_categories" in config["data_lifecycle"]
    assert len(config["data_lifecycle"]["pii_categories"]) > 0
