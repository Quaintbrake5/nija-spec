#!/bin/bash

# Deployment script for nija-backend
# Usage: ./scripts/deploy.sh

set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "🚀 Starting deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest code from git..."
git pull origin master

# 2. Install dependencies
echo "📦 Installing dependencies with uv..."
uv sync --frozen

# 3. Run database migrations
echo "🗄️ Running database migrations..."
uv run alembic upgrade head

# 4. Restart application service
# Assuming the app is managed by systemd
echo "🔄 Restarting application service..."
sudo systemctl restart nija-backend

# 5. Run health check
echo "🔍 Running health check..."
./scripts/healthcheck.sh

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed health check. Consider rolling back."
    exit 1
fi
