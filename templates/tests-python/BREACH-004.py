import pytest


def test_reject_foreign_data_residency():
    """Verify data residency is Local or Hybrid."""
    config = get_config()
    assert "infrastructure" in config
    assert config["infrastructure"]["data_residency"] in ["Local", "Hybrid"]
