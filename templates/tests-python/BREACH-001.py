import pytest


def test_enforce_data_retention_policy():
    """Verify data retention policy is configured and reasonable."""
    config = get_config()
    assert "data_lifecycle" in config
    assert "retention" in config["data_lifecycle"]
    retention_days = int(config["data_lifecycle"]["retention"])
    assert retention_days > 0
    assert retention_days <= 365
