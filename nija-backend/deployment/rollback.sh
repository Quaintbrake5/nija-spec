#!/bin/bash
set -e

# Database rollback script for NijaSpec
echo "Rolling back last database migration..."

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Rollback one version
alembic downgrade -1

echo "Rollback completed successfully."
