#!/bin/bash

# Restore script for nija-backend
# Usage: ./scripts/restore.sh <backup_file.sql.gz>

set -e

if [ -z "$1" ]; then
    echo "❌ Error: No backup file specified."
    echo "Usage: ./scripts/restore.sh <backup_file.sql.gz>"
    exit 1
fi

BACKUP_FILE=$1

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

echo "♻️ Starting restore from $BACKUP_FILE..."

# 1. Decompress backup
echo "📦 Decompressing backup..."
gunzip -c "$BACKUP_FILE" > temp_restore.sql

# 2. Restore database
echo "🗄️ Restoring database..."
# Drop and recreate DB to ensure a clean slate (USE WITH CAUTION)
psql -U "$POSTGRES_USER" -h "$POSTGRES_HOST" -d postgres -c "DROP DATABASE IF EXISTS $POSTGRES_DB;"
psql -U "$POSTGRES_USER" -h "$POSTGRES_HOST" -d postgres -c "CREATE DATABASE $POSTGRES_DB;"

psql -U "$POSTGRES_USER" -h "$POSTGRES_HOST" -d "$POSTGRES_DB" < temp_restore.sql

# 3. Cleanup
rm temp_restore.sql

echo "✅ Database restore completed successfully!"
