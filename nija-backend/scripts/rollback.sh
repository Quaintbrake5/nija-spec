#!/bin/bash

# Rollback script for nija-backend
# Usage: ./scripts/rollback.sh

set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "⏪ Starting rollback..."

# 1. Revert to previous commit
echo "⏪ Reverting to previous git commit..."
git reset --hard HEAD@{1}

# 2. Install dependencies (ensure they match the reverted commit)
echo "📦 Syncing dependencies..."
uv sync --frozen

# 3. Database Rollback (OPTIONAL/CAUTIOUS)
# Warning: Automatic DB rollback can lead to data loss if migrations deleted columns.
# We'll ask for confirmation or provide a way to do it.
read -p "Do you want to rollback database migrations to the previous version? (y/N): " confirm_db
if [[ "$confirm_db" == "y" || "$confirm_db" == "Y" ]]; then
    echo "🗄️ Rolling back database migrations..."
    uv run alembic downgrade -1
fi

# 4. Restart application service
echo "🔄 Restarting application service..."
sudo systemctl restart nija-backend

# 5. Run health check
echo "🔍 Running health check..."
./scripts/healthcheck.sh

if [ $? -eq 0 ]; then
    echo "✅ Rollback successful!"
else
    echo "❌ Rollback failed health check."
    exit 1
fi
