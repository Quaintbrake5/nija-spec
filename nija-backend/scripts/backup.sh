#!/bin/bash

# Backup script for nija-backend
# Usage: ./scripts/backup.sh

set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Ensure BACKUP_DIR is set
BACKUP_DIR=${BACKUP_DIR:-"/var/backups/nija-backend"}
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

echo "💾 Starting backup..."

# 1. Database Backup (PostgreSQL)
echo "🗄️ Dumping database to $BACKUP_FILE..."
# PGPASSWORD is expected to be in .env or handled by ~/.pgpass
pg_dump -U "$POSTGRES_USER" -h "$POSTGRES_HOST" "$POSTGRES_DB" > "$BACKUP_FILE"

# 2. Compress backup
echo "📦 Compressing backup..."
gzip "$BACKUP_FILE"

# 3. Cleanup old backups (keep last 30 days)
echo "🧹 Cleaning up backups older than 30 days..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "✅ Backup completed: ${BACKUP_FILE}.gz"
