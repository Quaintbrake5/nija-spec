# NijaSpec Development Guide

This guide provides comprehensive instructions for setting up and developing the NijaSpec web dashboard.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Frontend Development](#frontend-development)
4. [Backend Development](#backend-development)
5. [Database Setup](#database-setup)
6. [API Integration](#api-integration)
7. [Testing](#testing)
8. [Code Quality](#code-quality)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js 18+** - JavaScript runtime
- **Python 3.11+** - Python runtime
- **UV** - Python package manager (replaces pip)
- **PostgreSQL** - Database (for production)
- **Git** - Version control

### Recommended Tools

- **VS Code** - Code editor
- **Docker** - Containerization (optional)
- **Postman/Insomnia** - API testing

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NaijaSpec
```

### 2. Setup Frontend

```bash
cd nija-frontend
npm install
```

### 3. Setup Backend

```bash
cd nija-backend

# Create virtual environment
uv venv

# Activate virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1

# Unix/Mac:
source .venv/bin/activate

# Install dependencies
uv sync

# Copy environment configuration
cp .env.example .env

# Edit .env with your configuration
```

### 4. Start Development Servers

**Terminal 1 - Frontend:**

```bash
cd nija-frontend
npm run dev
```

**Terminal 2 - Backend:**

```bash
cd nija-backend
uv run python main.py
```

## Frontend Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Sidebar, Topbar)
│   ├── ui/             # UI primitives (Button, Input, etc.)
│   └── [feature]/      # Feature-specific components
├── services/           # API service clients
├── stores/             # React Context providers
├── types/              # TypeScript type definitions
├── styles/             # CSS and design tokens
└── utils/              # Utility functions
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Component Development

1. **Create Component:**

   ```bash
   mkdir -p src/components/[feature]
   touch src/components/[feature]/[ComponentName].tsx
   touch src/components/[feature]/[ComponentName].css
   ```

2. **Follow Component Structure:**

   ```typescript
   import { ComponentProps } from 'react';
   import './ComponentName.css';

   interface ComponentNameProps extends ComponentProps<'div'> {
     // Custom props
   }

   export const ComponentName = ({ ...props }: ComponentNameProps) => {
     return (
       <div className="component-name" {...props}>
         {/* Component content */}
       </div>
     );
   };

   export default ComponentName;
   ```

### State Management

- **Local State:** Use `useState` and `useReducer` for component state
- **Server State:** Use TanStack Query for API data
- **Global State:** Use React Context for shared state (auth, organizations)

### Styling Guidelines

- Use CSS Variables (design tokens) from `src/styles/tokens.css`
- Follow BEM naming convention for CSS classes
- Ensure responsive design for all screen sizes
- Maintain WCAG 2.1 AA accessibility compliance

## Backend Development

### Project Structure

```
app/
├── api/v1/             # API endpoints
├── core/               # Configuration and security
├── models/             # Database models
├── schemas/            # Pydantic schemas
├── services/           # Business logic
└── utils/              # Utility functions
tests/                  # Test files
```

### Development Commands

```bash
# Start development server
uv run python main.py

# Run tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=app --cov-report=html

# Format code
uv run black .
uv run isort .

# Lint code
uv run ruff check .

# Type checking
uv run mypy .
```

### API Endpoint Development

1. **Create Endpoint:**

   ```python
   # app/api/v1/[feature].py
   from fastapi import APIRouter, Depends
   from app.core.security import get_current_user
   from app.schemas.[feature] import [Feature]Response

   router = APIRouter()

   @router.get("/[feature]", response_model=[Feature]Response)
   async def get_[feature](current_user = Depends(get_current_user)):
       # Implementation
       pass
   ```

2. **Register Router:**

   ```python
   # app/api/v1/__init__.py
   from fastapi import APIRouter
   from app.api.v1 import [feature]

   api_router = APIRouter()
   api_router.include_router([feature].router, prefix="/[feature]", tags=["[feature]"])
   ```

### Database Model Development

1. **Create Model:**

   ```python
   # app/models/[feature].py
   from sqlalchemy import Column, String, DateTime
   from sqlalchemy.dialects.postgresql import UUID
   from app.core.database import Base

   class [Feature](Base):
       __tablename__ = "[features]"
       
       id = Column(UUID(as_uuid=True), primary_key=True)
       name = Column(String, nullable=False)
       created_at = Column(DateTime, nullable=False)
   ```

2. **Create Migration:**

   ```bash
   uv run alembic revision --autogenerate -m "Add [feature] table"
   uv run alembic upgrade head
   ```

## Database Setup

### Local Development

1. **Install PostgreSQL**
2. **Create Database:**

   ```sql
   CREATE DATABASE nijaspec;
   CREATE USER nijaspec WITH PASSWORD 'password';
   GRANT ALL PRIVILEGES ON DATABASE nijaspec TO nijaspec;
   ```

3. **Update .env:**

   ```env
   DATABASE_URL="postgresql://nijaspec:password@localhost:5432/nijaspec"
   ```

4. **Run Migrations:**

   ```bash
   uv run alembic upgrade head
   ```

### Docker (Optional)

```bash
docker run -d \
  --name nijaspec-db \
  -e POSTGRES_DB=nijaspec \
  -e POSTGRES_USER=nijaspec \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

## API Integration

### Frontend API Configuration

The frontend is configured to proxy API requests to the backend:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### API Service Pattern

```typescript
// src/services/api.ts
import axios from 'axios';

const apiService = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Add auth interceptor
apiService.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiService;
```

## Testing

### Frontend Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/components/Button.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

### Backend Testing

```bash
# Run all tests
uv run pytest

# Run specific test file
uv run pytest tests/test_auth.py

# Run tests with coverage
uv run pytest --cov=app --cov-report=html

# Run tests in watch mode (requires pytest-watch)
uv run ptw
```

### Test Structure

```typescript
// Frontend Component Test
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });
});
```

```python
# Backend API Test
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
```

## Code Quality

### Frontend

- **ESLint:** Linting for TypeScript and React
- **Prettier:** Code formatting
- **TypeScript:** Strict type checking

```bash
# Run all quality checks
npm run lint && npm run format && npm run type-check
```

### Backend

- **Black:** Code formatting
- **isort:** Import sorting
- **mypy:** Type checking
- **ruff:** Linting

```bash
# Run all quality checks
uv run black . && uv run isort . && uv run ruff check . && uv run mypy .
```

## Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to static hosting (Netlify, Vercel, AWS Amplify)
# Upload the `dist` folder
```

### Backend Deployment

```bash
# Build Docker image
docker build -t nija-backend .

# Run container
docker run -d \
  --name nija-backend \
  -p 8000:8000 \
  -e DATABASE_URL="your-database-url" \
  nija-backend
```

### Environment Variables

**Frontend (.env):**

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Backend (.env):**

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
```

## Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Find process using port
   lsof -i :5173
   # Kill process
   kill -9 <PID>
   ```

2. **Database connection failed:**
   - Check PostgreSQL is running
   - Verify DATABASE_URL in .env
   - Ensure database exists

3. **Authentication errors:**
   - Verify Google OAuth credentials
   - Check CORS configuration
   - Ensure JWT secret is set

4. **Build failures:**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Clear Python cache: `find . -type d -name __pycache__ -exec rm -rf {} +`

### Getting Help

- Check the documentation in `docs/`
- Review existing issues in the repository
- Contact the development team
