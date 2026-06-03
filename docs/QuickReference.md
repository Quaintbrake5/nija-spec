# NijaSpec Web Dashboard - Quick Reference

## 🚀 Quick Start Commands

### Frontend

```bash
cd nija-frontend
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm test             # Run tests
npm run build        # Build for production
```

### Backend

```bash
cd nija-backend
uv venv              # Create virtual environment
.venv\Scripts\Activate.ps1  # Activate (Windows PowerShell)
uv sync              # Install dependencies
uv run python main.py       # Start dev server (http://localhost:8000)
uv run pytest        # Run tests
```

## 📁 Project Structure

```
nija-frontend/
├── src/
│   ├── components/    # UI components
│   │   ├── layout/    # Sidebar, Topbar, MainLayout
│   │   ├── ui/        # Button, Input, etc.
│   │   └── [feature]/ # Feature-specific components
│   ├── services/      # API service clients
│   ├── stores/        # React Context providers
│   ├── types/         # TypeScript type definitions
│   └── styles/        # CSS and design tokens

nija-backend/
├── app/
│   ├── api/v1/        # API endpoints
│   ├── core/          # Configuration & security
│   ├── models/        # Database models
│   ├── schemas/       # Pydantic schemas
│   └── services/      # Business logic
├── tests/             # Test files
└── pyproject.toml     # Python configuration
```

## 🔧 Development Workflow

### 1. Start Development

```bash
# Terminal 1: Frontend
cd nija-frontend && npm run dev

# Terminal 2: Backend
cd nija-backend && uv run python main.py
```

### 2. Make Changes

- Edit files in `nija-frontend/src/` or `nija-backend/app/`
- Frontend: Hot reload enabled
- Backend: Auto-reload enabled

### 3. Test Changes

```bash
# Frontend tests
cd nija-frontend && npm test

# Backend tests
cd nija-backend && uv run pytest
```

### 4. Code Quality

```bash
# Frontend
cd nija-frontend && npm run lint && npm run format

# Backend
cd nija-backend && uv run black . && uv run isort . && uv run ruff check .
```

## 🌐 API Endpoints

### Authentication

- `POST /api/v1/auth/google/login` - Google OAuth
- `POST /api/v1/auth/magic-link/send` - Send magic link
- `POST /api/v1/auth/magic-link/verify` - Verify magic link

### Projects

- `GET /api/v1/orgs/:orgId/projects` - List projects
- `POST /api/v1/orgs/:orgId/projects` - Create project
- `GET /api/v1/projects/:projectId` - Get project

### Specifications

- `GET /api/v1/specs/:specId` - Get specification
- `POST /api/v1/specs` - Upload specification
- `GET /api/v1/specs/diff` - Get specification diff

### Runs

- `GET /api/v1/projects/:projectId/runs` - List runs
- `POST /api/v1/runs` - Trigger new run
- `GET /api/v1/runs/:runId` - Get run details

## 🎨 Design System

### CSS Variables (Design Tokens)

```css
/* Colors */
--color-primary: #0d6efd;
--color-success: #28a745;
--color-warning: #ffc107;
--color-danger: #dc3545;

/* Typography */
--font-size-base: 1rem;
--font-weight-medium: 500;

/* Spacing */
--spacing-1: 0.25rem;
--spacing-4: 1rem;

/* Shadows */
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
```

### Component Usage

```tsx
import { Button, Input } from '@/components/ui';

<Button variant="primary" size="md">
  Click me
</Button>

<Input
  label="Email"
  placeholder="Enter your email"
  error="Invalid email"
/>
```

## 🧪 Testing

### Frontend Testing

```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm run test:coverage      # With coverage
npm test -- src/components/Button.test.tsx  # Specific file
```

### Backend Testing

```bash
uv run pytest              # Run all tests
uv run pytest -v           # Verbose output
uv run pytest --cov=app    # With coverage
uv run pytest tests/test_auth.py  # Specific file
```

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :5173
# Kill process
kill -9 <PID>
```

### Database Connection Issues

- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Ensure database exists

### Build Failures

```bash
# Clear node_modules
rm -rf node_modules && npm install

# Clear Python cache
find . -type d -name __pycache__ -exec rm -rf {} +
```

## 📚 Documentation

- [Web Dashboard Implementation Guide](WebDashboardImplementation.md)
- [Development Guide](DevelopmentGuide.md)
- [API Specification](API-Spec.md)
- [Data Model](DataModel.md)
- [UI/UX Specification](UI-UX.md)

## 🎯 Next Steps

1. ✅ Project setup complete
2. 🔄 Authentication system (in progress)
3. ⏳ Organization management
4. ⏳ Project dashboard
5. ⏳ Specification viewer
6. ⏳ Run history and reporting
7. ⏳ Testing and quality assurance
8. ⏳ Deployment preparation
