# NijaSpec Web Dashboard Implementation Guide

**Status:** In Progress  
**Last updated:** 2026-06-01  
**Version:** 0.1.0

---

## Overview

This document provides implementation guidance for the NijaSpec web dashboard, which extends the CLI-only tool to a full-stack application with React frontend and FastAPI backend.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript + Vite)                        │
│  - Authentication (Google OAuth, Magic Link)                │
│  - Dashboard UI                                            │
│  - Specification Viewer                                    │
│  - Run History and Reporting                               │
├─────────────────────────────────────────────────────────────┤
│  API Layer (FastAPI + Python)                               │
│  - REST API Endpoints                                      │
│  - Authentication Middleware                                │
│  - Business Logic Services                                  │
│  - Database ORM (SQLAlchemy)                                │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  - PostgreSQL Database                                     │
│  - Object Storage (S3/R2/MinIO)                            │
│  - Redis Cache (optional)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- TanStack Query for server state management
- React Router v6 for routing
- React Hook Form + Zod for form validation
- Axios for HTTP requests
- CSS Variables for theming (no Tailwind)

**Backend:**
- Python 3.11+ with FastAPI
- UV package manager (replaces pip)
- SQLAlchemy ORM with PostgreSQL
- Pydantic v2 for data validation
- JWT authentication with refresh tokens
- Alembic for database migrations

## Implementation Status

### Phase 0: Project Setup ✅
- [x] Initialize monorepo structure
- [x] Setup React + Vite + TypeScript frontend
- [x] Setup Python + FastAPI + UV backend
- [x] Configure development environments
- [x] Setup code quality tools

### Phase 1: Authentication System 🔄
- [ ] Authentication service implementation
- [ ] Login page with Google OAuth and Magic Link
- [ ] Auth callback handler
- [ ] Auth context and hooks
- [ ] Protected route component

### Phase 2: Organization and Project Management ⏳
- [ ] Organization service
- [ ] Organization selection interface
- [ ] Project service
- [ ] Project dashboard view
- [ ] Project detail view

### Phase 3: Specification Management ⏳
- [ ] Specification service
- [ ] Specification viewer
- [ ] Specification diff viewer
- [ ] Specification upload interface

### Phase 4: Run History and Reporting ⏳
- [ ] Run service
- [ ] Run history view
- [ ] Run detail view
- [ ] Artifact management

### Phase 5: Dashboard and Navigation ⏳
- [ ] Layout components (Sidebar, Topbar)
- [ ] UI component library
- [ ] Routing and navigation
- [ ] Dashboard home page

### Phase 6: Testing and Quality Assurance ⏳
- [ ] Unit tests
- [ ] Component tests
- [ ] Integration tests
- [ ] Performance optimization
- [ ] Accessibility audit

### Phase 7: Deployment and Release ⏳
- [ ] Build and deployment scripts
- [ ] Error reporting and monitoring
- [ ] Final quality assurance

## Directory Structure

### Frontend (`nija-frontend/`)
```
src/
├── components/
│   ├── layout/           # Layout components (Sidebar, Topbar, MainLayout)
│   ├── ui/               # Reusable UI primitives (Button, Input, etc.)
│   ├── dashboard/        # Dashboard-specific components
│   ├── specs/            # Specification viewing components
│   ├── runs/             # Run history components
│   └── auth/             # Authentication components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── services/             # API service clients
├── stores/               # Context providers
├── types/                # TypeScript type definitions
├── styles/               # CSS files and design tokens
├── routes/               # Route definitions
└── assets/               # Static assets
```

### Backend (`nija-backend/`)
```
app/
├── api/v1/               # API endpoints
├── core/                 # Configuration and security
├── models/               # Database models
├── schemas/              # Pydantic schemas
├── services/             # Business logic
└── utils/                # Utility functions
tests/                    # Test files
alembic/                  # Database migrations
```

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- UV package manager
- PostgreSQL (for production)

### Frontend Setup
```bash
cd nija-frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd nija-backend
uv venv
.venv\Scripts\Activate.ps1  # Windows PowerShell
uv sync
cp .env.example .env
uv run python main.py
```

## API Integration

The frontend proxies API requests to the backend:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Proxy: `/api` → `http://localhost:8000/api`

## Key Features

### Authentication
- Google OAuth integration
- Passwordless Magic Link authentication
- JWT tokens with refresh rotation
- Secure session management

### Dashboard
- Organization switching
- Project overview with metrics
- Specification status tracking
- Run history and reporting

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## Testing Strategy

### Frontend Testing
- Unit tests with Vitest
- Component tests with React Testing Library
- Integration tests for critical flows
- Accessibility testing with jest-axe

### Backend Testing
- Unit tests with Pytest
- API endpoint testing
- Database integration tests
- Security testing

## Deployment

### Development
```bash
# Frontend
cd nija-frontend && npm run dev

# Backend
cd nija-backend && uv run python main.py
```

### Production
- Frontend: Build and deploy to static hosting
- Backend: Containerize with Docker and deploy to cloud
- Database: Managed PostgreSQL service
- Object Storage: S3/R2 for artifacts

## Contributing

1. Follow the coding standards (ESLint/Prettier for frontend, Black/isort for backend)
2. Write tests for new features
3. Update documentation as needed
4. Ensure accessibility compliance
5. Follow security best practices

## Next Steps

1. Complete authentication system implementation
2. Build organization and project management features
3. Implement specification viewing and comparison
4. Create run history and reporting interface
5. Add comprehensive testing
6. Prepare for deployment