# Web Dashboard Design

## System Architecture

### Frontend Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: CSS3 with CSS variables (design tokens approach)
- **State Management**: React Context API and useReducer for global state
- **Routing**: React Router v6 for client-side routing
- **HTTP Client**: Axios or fetch API with interceptors
- **Testing**: Vitest for unit testing, React Testing Library for component tests
- **Linting**: ESLint with Prettier formatting
- **Type Checking**: TypeScript strict mode

### Component Architecture

```
src/
├── components/
│   ├── layout/           # Layout components (Sidebar, Topbar, Breadcrumbs)
│   ├── ui/               # Reusable UI primitives (Button, Input, Select, etc.)
│   ├── dashboard/        # Dashboard-specific components
│   ├── specs/            # Specification viewing components
│   ├── runs/             # Run history and reporting components
│   ├── auth/             # Authentication components
│   └── layout/           # Page layouts and containers
├── hooks/                # Custom React hooks
├── utils/                # Utility functions and helpers
├── services/             # API service clients
├── stores/               # State management (Context providers)
├── types/                # TypeScript type definitions
├── styles/               # CSS files and design tokens
├── routes/               # Route definitions and lazy loading
└── assets/               # Static assets (icons, images, etc.)
```

### Design System

#### Tokens (CSS Variables)

```css
:root {
  /* Colors */
  --color-bg: #ffffff;
  --color-surface: #f8f9fa;
  --color-border: #dee2e6;
  --color-text-primary: #212529;
  --color-text-secondary: #6c757d;
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-danger: #dc3545;
  --color-info: #17a2b8;
  --color-primary: #0d6efd;
  
  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  
  /* Spacing */
  --spacing-0: 0rem;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  
  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

#### UI Components

- **Button**: Primary, secondary, outline variants with loading states
- **Input**: Text, email, password inputs with validation states
- **Select**: Dropdown select with search capability
- **Tag**: Label component for status indicators
- **Alert**: Success, warning, error, info variants
- **Sidebar**: Collapsible navigation sidebar
- **Topbar**: Header with user profile and actions
- **Breadcrumbs**: Navigation path indicator
- **Table**: Sortable, paginated table component
- **DiffViewer**: Side-by-side or inline diff visualization
- **CodeBlock**: Syntax-highlighted code display
- **Avatar**: User avatar with fallback to initials
- **Badge**: Status badge component

### API Integration

#### Endpoint Structure

```
GET    /api/v1/auth/google/login         # Initiate Google OAuth
GET    /api/v1/auth/google/callback      # OAuth callback handler
POST   /api/v1/auth/magic-link/send      # Send magic link
POST   /api/v1/auth/magic-link/verify    # Verify magic link token
POST   /api/v1/auth/logout               # End session

GET    /api/v1/orgs                      # List user's organizations
POST   /api/v1/orgs                      # Create new organization
GET    /api/v1/orgs/:orgId               # Get organization details
PUT    /api/v1/orgs/:orgId               # Update organization
DELETE /api/v1/orgs/:orgId               # Delete organization (soft)

GET    /api/v1/projects                  # List projects (with org filtering)
POST   /api/v1/projects                  # Create new project
GET    /api/v1/projects/:projectId       # Get project details
PUT    /api/v1/projects/:projectId       # Update project
DELETE /api/v1/projects/:projectId       # Delete project (soft)

GET    /api/v1/projects/:projectId/specs # List project specifications
GET    /api/v1/specs/:specId             # Get specification content
GET    /api/v1/specs/:specId/diff        # Get diff between versions
POST   /api/v1/specs                     # Upload new specification
PUT    /api/v1/specs/:specId             # Update specification

GET    /api/v1/projects/:projectId/runs  # List project runs
GET    /api/v1/runs/:runId               # Get run details
GET    /api/v1/runs/:runId/artifacts     # List run artifacts
GET    /api/v1/artifacts/:artifactId/download # Download artifact
```

#### Authentication Flow

1. User initiates Google OAuth flow via "/auth/google/login"
2. Google redirects back to "/auth/google/callback" with authorization code
3. Backend exchanges code for tokens and creates session
4. Frontend receives session token and stores it securely
5. Subsequent API requests include auth token in Authorization header
6. Session validation middleware protects routes
7. Refresh token rotation for extended sessions

#### Data Fetching Strategy

- **React Query/TanStack Query** for server state management
- Automatic caching and background updates
- Request deduplication
- Pagination and infinite query support
- Mutation utilities for create/update/delete operations
- Optimistic updates where appropriate
- Error boundaries and retry mechanisms

### State Management

#### Global Stores

1. **AuthStore**: User session, permissions, organization context
2. **ProjectStore**: Current project data, project lists
3. **SpecStore**: Specification content, version history, diff data
4. **RunStore**: Run history, current run data, filtering state
5. **UIStateStore**: Loading states, modal visibility, sidebar state

#### Local State

- Form state managed with React Hook Form or useState
- UI toggles (menus, dropdowns) managed locally
- Temporary view states (sorting, filtering) managed in component

### Routing Structure

```
/                           # Landing page (redirects to dashboard if authenticated)
/login                      # Authentication page
/orgs                       # Organization selection/switcher
/dashboard                  # Main dashboard (organization context)
/dashboard/:orgId/projects  # Project list for organization
/dashboard/:orgId/projects/new    # Create new project
/dashboard/:orgId/projects/:projectId   # Project detail view
/dashboard/:orgId/projects/:projectId/specs   # Specification list
/dashboard/:orgId/specs/:specId         # Specification viewer
/dashboard/:orgId/specs/:specId/diff    # Specification diff viewer
/dashboard/:orgId/runs          # Run history list
/dashboard/:orgId/runs/:runId   # Run detail view
/profile                      # User profile settings
/settings                     # Organization/settings management
```

### Error Handling

#### Frontend Error Boundaries

- Global error boundary for unexpected errors
- Route-level error boundaries for page-specific errors
- Component-level error boundaries for isolated failures
- Fallback UI with retry options and error details

#### API Error Handling

- Consistent error response format: { error: { message, code, details } }
- Automatic logout on 401 (unauthorized) responses
- Retry logic for transient failures (5xx, network errors)
- User-friendly error messages mapped from technical errors
- Error reporting to monitoring service (optional)

### Performance Optimizations

#### Code Splitting

- Route-based code splitting with React.lazy and Suspense
- Vite's built-in code splitting for vendor libraries
- Dynamic imports for non-critical components
- Prefetching of likely next routes

#### Asset Optimization

- Image optimization and compression
- SVG sprites for icons
- Font subsetting and preloading
- CSS minification and purging
- Brotli/Gzip compression for assets

#### Caching Strategy

- HTTP caching headers for static assets
- Service worker for offline capabilities (future)
- React Query caching with stale-while-revalidate
- LocalStorage caching for user preferences
- IndexedDB for larger client-side data (future)

### Accessibility Implementation

#### WCAG 2.1 Compliance

- Semantic HTML elements (header, nav, main, section, etc.)
- Proper heading hierarchy (h1-h6)
- ARIA labels and roles for interactive components
- Keyboard navigation support (tab order, escape to close)
- Focus management for modals and dropdowns
- Skip navigation links
- Landmark regions for screen readers
- Color contrast compliance (minimum 4.5:1)
- Resizable text support (up to 200% without loss of content)
- Alternative text for meaningful images
- Accessible names for all interactive elements

#### Testing Accessibility

- jest-axe for automated accessibility testing
- Manual testing with screen readers (NVDA, VoiceOver)
- Keyboard-only navigation testing
- Color contrast verification tools
- User testing with diverse abilities

### Security Implementation

#### Authentication Security

- HTTPS-only in production
- Secure cookies with HttpOnly and SameSite attributes
- CSRF tokens for state-changing operations
- Rate limiting on authentication endpoints
- Input validation and sanitization
- JWT token expiration and rotation
- Session invalidation on password change

#### Data Protection

- Parameterized queries to prevent SQL injection
- Output encoding to prevent XSS
- Content Security Policy (CSP) headers
- Input validation on all user-provided data
- File upload validation (type, size, content)
- Secure handling of authentication tokens

#### Dependency Security

- Regular dependency updates
- npm audit for vulnerability scanning
- Lockfile maintenance
- Security scanning in CI pipeline

### Development Workflow

#### Environment Setup

- Node.js 18+ required
- Yarn or npm package manager
- Vite development server with hot module replacement
- Environment variable configuration (.env files)
- Proxy configuration for API development

#### Testing Strategy

- Unit tests for utilities and hooks (Vitest)
- Component tests with React Testing Library
- Integration tests for critical user flows
- End-to-end tests with Cypress or Playwright (future)
- Visual regression testing (future)
- Accessibility testing with jest-axe

#### Code Quality

- ESLint with Airbnb-based configuration
- Prettier for code formatting
- TypeScript strict mode enabled
- Pre-commit hooks with lint-staged
- Code review requirements
- Documentation standards

### Deployment

#### Build Process

- Vite production build with optimization
- Asset fingerprinting for cache busting
- Code splitting and lazy loading preservation
- Minification and terser compression
- Brotli/Gzip compression support

#### Deployment Targets

- Static hosting (Netlify, Vercel, AWS Amplify)
- Containerized deployment (Docker, Kubernetes)
- Traditional web servers (NGINX, Apache)
- CDN integration for global distribution

#### Configuration

- Environment-specific configuration files
- API endpoint configuration
- Feature flags for gradual rollouts
- Monitoring and analytics integration
- Error reporting setup
