# NijaSpec Backend

FastAPI-based backend API for NijaSpec compliance auditing engine.

## Features

- **Authentication**: Google OAuth and Magic Link authentication
- **Organization Management**: Multi-organization support with RBAC
- **Project Management**: Project CRUD with specification versioning
- **Specification Management**: Upload, version, and compare specifications
- **Run Management**: Trigger and monitor compliance runs
- **Artifact Management**: Store and retrieve run artifacts
- **API Documentation**: Automatic OpenAPI/Swagger documentation

## Tech Stack

- **Framework**: FastAPI (Python 3.11+)
- **Package Manager**: UV
- **Database**: PostgreSQL (via SQLAlchemy)
- **ORM**: SQLAlchemy with Alembic migrations
- **Authentication**: JWT with refresh tokens
- **Validation**: Pydantic v2
- **Testing**: Pytest with async support
- **Code Quality**: Black, isort, mypy, ruff

## Prerequisites

- Python 3.11+
- UV package manager
- PostgreSQL (for production)

## Installation

```bash
# Install UV (if not installed)
pip install uv

# Create virtual environment
uv venv

# Activate virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Unix/Mac:
source .venv/bin/activate

# Install dependencies
uv sync

# Install development dependencies
uv sync --group dev

# Copy environment configuration
cp .env.example .env

# Edit .env with your configuration
```

## Development

### Running the Server

```bash
# Development server with auto-reload
uv run python main.py

# Or using uvicorn directly
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

### Code Quality

```bash
# Format code
uv run black .
uv run isort .

# Lint code
uv run ruff check .

# Type checking
uv run mypy .

# Run all quality checks
uv run black . && uv run isort . && uv run ruff check . && uv run mypy .
```

### Testing

```bash
# Run all tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=app --cov-report=html

# Run specific test file
uv run pytest tests/test_auth.py

# Run tests in watch mode (requires pytest-watch)
uv run ptw
```

## Project Structure

```
nija-backend/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py          # Authentication endpoints
│   │       ├── projects.py      # Project management endpoints
│   │       ├── specs.py         # Specification endpoints
│   │       ├── runs.py          # Run management endpoints
│   │       └── organizations.py # Organization endpoints
│   ├── core/
│   │   ├── config.py           # Configuration settings
│   │   ├── security.py         # JWT and authentication utilities
│   │   └── database.py         # Database connection and session
│   ├── models/
│   │   ├── user.py             # User database models
│   │   ├── organization.py     # Organization models
│   │   ├── project.py          # Project models
│   │   ├── specification.py    # Specification models
│   │   └── run.py              # Run and artifact models
│   ├── schemas/
│   │   ├── auth.py             # Authentication schemas
│   │   ├── user.py             # User schemas
│   │   ├── organization.py     # Organization schemas
│   │   ├── project.py          # Project schemas
│   │   ├── specification.py    # Specification schemas
│   │   └── run.py              # Run schemas
│   ├── services/
│   │   ├── auth_service.py     # Authentication business logic
│   │   ├── user_service.py     # User management
│   │   ├── organization_service.py # Organization management
│   │   ├── project_service.py  # Project management
│   │   ├── spec_service.py     # Specification management
│   │   └── run_service.py      # Run management
│   └── utils/
│       ├── dependencies.py     # FastAPI dependencies
│       └── helpers.py          # Utility functions
├── tests/
│   ├── __init__.py
│   ├── conftest.py             # Test fixtures
│   ├── test_auth.py            # Authentication tests
│   ├── test_projects.py        # Project tests
│   └── test_specs.py           # Specification tests
├── alembic/                    # Database migrations
├── alembic.ini                 # Alembic configuration
├── main.py                     # Application entry point
├── pyproject.toml              # Project configuration and dependencies
└── .env.example                # Environment variables template
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/google/login` - Initiate Google OAuth
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `POST /api/v1/auth/magic-link/send` - Send magic link
- `POST /api/v1/auth/magic-link/verify` - Verify magic link
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### Organizations
- `GET /api/v1/orgs` - List user's organizations
- `POST /api/v1/orgs` - Create organization
- `GET /api/v1/orgs/:orgId` - Get organization details
- `PUT /api/v1/orgs/:orgId` - Update organization
- `DELETE /api/v1/orgs/:orgId` - Delete organization

### Projects
- `GET /api/v1/orgs/:orgId/projects` - List organization projects
- `POST /api/v1/orgs/:orgId/projects` - Create project
- `GET /api/v1/projects/:projectId` - Get project details
- `PUT /api/v1/projects/:projectId` - Update project
- `DELETE /api/v1/projects/:projectId` - Delete project

### Specifications
- `GET /api/v1/projects/:projectId/specs` - List project specs
- `GET /api/v1/specs/:specId` - Get specification
- `POST /api/v1/specs` - Upload specification
- `PUT /api/v1/specs/:specId` - Update specification
- `GET /api/v1/specs/diff` - Get specification diff

### Runs
- `GET /api/v1/projects/:projectId/runs` - List project runs
- `GET /api/v1/runs/:runId` - Get run details
- `POST /api/v1/runs` - Trigger new run
- `POST /api/v1/runs/:runId/cancel` - Cancel run
- `GET /api/v1/runs/:runId/results` - Get run results
- `GET /api/v1/runs/:runId/artifacts` - List run artifacts

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Application
APP_NAME="NijaSpec API"
APP_ENV="development"
DEBUG=true

# Server
HOST="0.0.0.0"
PORT=8000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nijaspec"

# JWT
SECRET_KEY="your-secret-key"
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# CORS
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

## Database

### Setup

```bash
# Run migrations
uv run alembic upgrade head

# Create new migration
uv run alembic revision --autogenerate -m "description"

# Rollback migration
uv run alembic downgrade -1
```

### Models

The database includes the following tables:
- `users` - User accounts
- `organizations` - Multi-tenant organizations
- `org_memberships` - User-organization relationships with roles
- `projects` - Project containers
- `specs` - Specification versions
- `runs` - Compliance run history
- `run_events` - Run status changes
- `artifacts` - Generated files and logs

## Security

- JWT-based authentication with short-lived access tokens
- Refresh token rotation for extended sessions
- Role-based access control (OWNER, MAINTAINER, REVIEWER, VIEWER)
- CORS configuration for frontend integration
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy
- Rate limiting (to be implemented)

## Contributing

1. Follow the coding standards (Black, isort, mypy)
2. Write tests for new features
3. Update API documentation
4. Ensure security best practices