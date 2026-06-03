# NijaSpec Backend Deployment Guide

This document provides comprehensive instructions for deploying the NijaSpec Backend API to various environments.

## 1. Prerequisites

Before deploying, ensure the target environment meets the following requirements:

- **Python**: version 3.11 or higher
- **Package Manager**: [uv](https://github.com/astral-sh/uv) (recommended for fast, deterministic installs)
- **Database**: SQLite (default) or any SQLAlchemy-compatible database (e.g., PostgreSQL)
- **Operating System**: Linux (Ubuntu 22.04+ recommended), macOS, or Windows

## 2. Environment Configuration

The application uses a `.env` file or system environment variables for configuration. Create a `.env` file in the `nija-backend` root directory:

```env
# Application Settings
APP_NAME="NijaSpec API"
APP_VERSION="1.0.0"
APP_ENV="production" # development, staging, production
DEBUG=False

# Server Settings
HOST="0.0.0.0"
PORT=8000

# Security
# Generate a strong random key for production: `openssl rand -hex 32`
SECRET_KEY="your-very-secure-random-secret-key"
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
# Default is SQLite: sqlite+aiosqlite:///./nijaspec.db
DATABASE_URL="sqlite+aiosqlite:///./nijaspec.db"

# CORS Settings
# Comma-separated list of allowed origins
ALLOWED_ORIGINS="https://app.nijaspec.com,https://api.nijaspec.com"

# OAuth2 / Google Authentication (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Settings (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

## 3. Installation & Setup

### Using `uv` (Recommended)

```bash
# Navigate to the backend directory
cd nija-backend

# Install dependencies
uv sync
```

### Using `pip`

```bash
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt # If requirements.txt is available, otherwise use pyproject.toml
# Or install from pyproject.toml
pip install .
```

## 4. Database Migrations

NijaSpec uses Alembic for database schema management.

### Initial Setup
Run the initial migrations to create the database schema:
```bash
uv run alembic upgrade head
```

### Applying New Migrations
Whenever the application is updated, apply pending migrations:
```bash
uv run alembic upgrade head
```

### Rolling Back
To roll back to a previous version (replace `revision` with the target hash):
```bash
uv run alembic downgrade <revision>
```

## 5. Running the Application

### Development Mode
For local development with hot-reloading:
```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
For production, use a production-grade ASGI server. While `uvicorn` is used here, consider using `gunicorn` with `uvicorn` workers for better process management.

```bash
# Simple production run
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## 6. Deployment Options

### Option A: Virtual Machine (Systemd)
Create a systemd service file at `/etc/systemd/system/nijaspec.service`:

```ini
[Unit]
Description=NijaSpec Backend API
After=network.target

[Service]
User=nijaspec
Group=nijaspec
WorkingDirectory=/home/nijaspec/nija-backend
EnvironmentFile=/home/nijaspec/nija-backend/.env
ExecStart=/home/nijaspec/.local/bin/uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

Then enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable nijaspec
sudo systemctl start nijaspec
```

### Option B: Docker (Conceptual)
If using Docker, create a `Dockerfile` in the root:

```dockerfile
FROM python:3.11-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app
COPY . .

# Sync dependencies
RUN uv sync --frozen

# Expose port
EXPOSE 8000

# Run application
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 7. Maintenance & Monitoring

### Logs
Check application logs for errors:
- **Systemd**: `journalctl -u nijaspec.service -f`
- **Docker**: `docker logs -f nijaspec-backend`

### Health Checks
The API provides a health check endpoint:
`GET /api/v1/health`

### Database Backups
For SQLite, simply back up the `nijaspec.db` file. For other databases, use standard dump tools (e.g., `pg_dump`).

## 8. Troubleshooting Guide

| Issue | Potential Cause | Resolution |
|-------|-----------------|------------|
| `401 Unauthorized` | Invalid or expired JWT token | Check `SECRET_KEY` consistency and token expiration settings. |
| `403 Forbidden` | CORS origin mismatch | Ensure the frontend URL is listed in `ALLOWED_ORIGINS`. |
| `Database Connection Error` | Incorrect `DATABASE_URL` | Verify the database connection string and permissions. |
| `ModuleNotFoundError` | Missing dependencies | Run `uv sync` or `pip install -r requirements.txt`. |
| `Alembic Migration Error` | Schema mismatch | Ensure migrations are applied in order. Try `alembic upgrade head`. |
| `Internal Server Error (500)`| Unhandled exception | Check server logs for traceback. Ensure all `.env` variables are set. |
