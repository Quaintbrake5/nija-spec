#!/bin/bash
set -e

# Deployment migration script for NijaSpec
echo "Running database migrations..."

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Run alembic upgrade
alembic upgrade head

echo "Migrations completed successfully."
