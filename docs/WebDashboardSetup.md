# NijaSpec Web Dashboard Setup

This document provides quick setup instructions for the NijaSpec web dashboard implementation.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- UV package manager

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd NaijaSpec
```

### 2. Frontend Setup

```bash
cd nija-frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5173

### 3. Backend Setup

```bash
cd nija-backend

# Create virtual environment
uv venv

# Activate virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1

# Install dependencies
uv sync

# Start development server
uv run python main.py
```

Backend will be available at: http://localhost:8000
API documentation at: http://localhost:8000/docs

## Development Commands

### Frontend (nija-frontend/)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests
npm run test:coverage # Run tests with coverage
npm run lint         # Lint code
npm run format       # Format code
npm run type-check   # Type check
```

### Backend (nija-backend/)
```bash
uv run python main.py        # Start development server
uv run pytest               # Run tests
uv run pytest --cov=app     # Run tests with coverage
uv run black .              # Format code
uv run isort .              # Sort imports
uv run ruff check .         # Lint code
uv run mypy .               # Type check
```

## Project Structure

```
NaijaSpec/
├── nija-frontend/           # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── services/        # API services
│   │   ├── stores/          # State management
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # CSS and design tokens
│   └── package.json
├── nija-backend/            # Python + FastAPI + UV
│   ├── app/                 # Application code
│   │   ├── api/             # API endpoints
│   │   ├── core/            # Configuration
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic
│   ├── tests/               # Test files
│   └── pyproject.toml       # Python configuration
└── docs/                    # Documentation
```

## Key Features

### Frontend
- React 19 with TypeScript
- Vite for fast development
- TanStack Query for server state
- React Router for navigation
- React Hook Form + Zod for forms
- CSS Variables for theming
- WCAG 2.1 AA accessibility

### Backend
- FastAPI with Python 3.11+
- UV package manager
- SQLAlchemy ORM
- Pydantic v2 validation
- JWT authentication
- OpenAPI documentation

## API Integration

The frontend proxies API requests to the backend:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Proxy: `/api` → `http://localhost:8000/api`

## Environment Configuration

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Backend (.env)
```env
# Copy from .env.example
cp .env.example .env

# Edit with your configuration
DATABASE_URL=postgresql://user:password@localhost:5432/nijaspec
SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
```

## Testing

### Frontend Tests
```bash
cd nija-frontend
npm test                    # Run all tests
npm test -- --watch        # Run in watch mode
npm run test:coverage      # With coverage
```

### Backend Tests
```bash
cd nija-backend
uv run pytest              # Run all tests
uv run pytest -v           # Verbose output
uv run pytest --cov=app    # With coverage
```

## Code Quality

### Frontend
- ESLint for linting
- Prettier for formatting
- TypeScript for type safety

### Backend
- Black for formatting
- isort for import sorting
- mypy for type checking
- ruff for linting

## Deployment

### Frontend
```bash
cd nija-frontend
npm run build
# Deploy dist/ folder to static hosting
```

### Backend
```bash
cd nija-backend
docker build -t nija-backend .
docker run -p 8000:8000 nija-backend
```

## Documentation

- [Web Dashboard Implementation Guide](WebDashboardImplementation.md)
- [Development Guide](DevelopmentGuide.md)
- [API Specification](API-Spec.md)
- [Data Model](DataModel.md)
- [UI/UX Specification](UI-UX.md)

## Next Steps

1. Complete authentication system
2. Build organization management
3. Implement project dashboard
4. Create specification viewer
5. Add run history and reporting
6. Conduct comprehensive testing
7. Prepare for deployment