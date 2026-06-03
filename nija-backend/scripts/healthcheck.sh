#!/bin/bash

# Health check script for nija-backend
# Usage: ./scripts/healthcheck.sh

set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Use API_URL if provided, else default to localhost
API_URL=${API_URL:-"http://localhost:8000"}
HEALTH_ENDPOINT="$API_URL/health" # Assuming a /health endpoint exists

echo "🔍 Checking health of $HEALTH_ENDPOINT..."

# Use curl to check the health endpoint
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_ENDPOINT")

if [ "$RESPONSE" == "200" ]; then
    echo "✅ Health check passed: API is responsive (HTTP 200)."
    exit 0
else
    echo "❌ Health check failed: API returned HTTP $RESPONSE."
    exit 1
fi
