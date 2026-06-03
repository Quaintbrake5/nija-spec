#!/bin/bash
set -e

# Database backup script for NijaSpec
echo "Starting database backup..."

# Navigate to backend directory
cd "$(dirname "$0")/.."

# Load environment variables if .env exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [[ $DATABASE_URL == sqlite* ]]; then
    echo "SQLite detected. Copying database file..."
    # Extract db path from DATABASE_URL (e.g., sqlite+aiosqlite:///./nijaspec.db)
    DB_FILE=$(echo $DATABASE_URL | sed 's/.*\/\/\/\s*//')
    # Handle relative paths
    if [[ $DB_FILE == ./* ]]; then
        cp "$DB_FILE" "$BACKUP_DIR/nijaspec.db.bak"
    else
        cp "$DB_FILE" "$BACKUP_DIR/nijaspec.db.bak"
    fi
elif [[ $DATABASE_URL == postgres* ]]; then
    echo "PostgreSQL detected. Using pg_dump..."
    # Extract connection string for pg_dump (remove postgresql+asyncpg:// if present)
    PG_URL=$(echo $DATABASE_URL | sed 's/postgresql\+asyncpg\:\/\/ /postgresql\:\/\//')
    pg_dump "$PG_URL" > "$BACKUP_DIR/backup.sql"
else
    echo "Unsupported database type in DATABASE_URL: $DATABASE_URL"
    exit 1
fi

echo "Backup saved to $BACKUP_DIR"
echo "Backup completed successfully."
