# Web Dashboard Requirements

## User Stories

### 1. Authentication
- As a user, I want to sign in using OAuth (Google) or magic link so that I can securely access my organization's data
- As a user, I want to select or create an organization after signing in so that I can manage multiple projects
- As a user, I want to remain signed in via secure session management so that I don't need to re-authenticate frequently

### 2. Project Management
- As a user, I want to view a list of my projects so that I can quickly access my work
- As a user, I want to create a new project so that I can organize specifications for different systems
- As a user, I want to view project details including spec status and last run information so that I can track progress

### 3. Specification Viewing
- As a user, I want to view the canonical specification in Markdown format so that I can review requirements
- As a user, I want to see diff views between specification versions so that I can track changes
- As a user, I want to export evidence packages so that I can share compliance reports

### 4. Run Monitoring
- As a user, I want to view run metadata (prompt version, model, token usage, cost) so that I understand execution details
- As a user, I want to see pass/fail results by endpoint/check so that I can quickly assess compliance status
- As a user, I want to view failure details with log snippets so that I can debug issues
- As a user, I want to download generated test files and manifests so that I can access artifacts locally

### 5. Dashboard Overview
- As a user, I want to see a project dashboard with spec status summary so that I get an at-a-glance view of compliance health
- As a user, I want to see latest spec version and last run status so that I know if specs are current
- As a user, I want to see failing endpoints count so that I can prioritize remediation efforts

## Functional Requirements

### Authentication System
- Support OAuth 2.0 with Google provider
- Support passwordless magic link email authentication
- Secure session handling with short-lived access tokens and refresh token rotation
- Role-based access control (OWNER, MAINTAINER, REVIEWER, VIEWER)
- Organization creation and management

### Project Management
- CRUD operations for projects within organizations
- Project slug generation (URL-friendly unique identifiers)
- Soft delete functionality for projects
- Project metadata tracking (created by, timestamps)

### Specification Management
- View specification content in readable Markdown format
- Version history for specifications
- Diff visualization between specification versions
- Export functionality for specification evidence packages

### Run History and Monitoring
- Display run metadata including:
  - Prompt version and model identifier
  - Token usage (prompt/completion/total)
  - Estimated cost in NGN
  - CI/CD pipeline link (when applicable)
  - Start/completion timestamps
- Results visualization:
  - Pass/fail status by endpoint/check
  - Failure details with contextual log snippets
  - Severity-based filtering and sorting
- Artifact management:
  - Download generated test files
  - Download run manifests
  - View patch differences
  - Access failure logs

### Dashboard Components
- Responsive layout working on desktop and tablet devices
- Navigation sidebar for quick access to projects/specs/runs
- Topbar with user profile and organization switcher
- Breadcrumb navigation for context awareness
- Loading states and error boundaries
- Empty states with helpful guidance

### Technical Requirements
- Built with React 18+ and TypeScript
- Vite build toolchain for fast development
- CSS3 with CSS variables for theming (no Tailwind dependency)
- WCAG AA accessibility compliance
- Keyboard navigable interface
- Mobile-responsive design
- Unit test coverage for components and utilities
- Integration tests for critical user flows

## Non-Functional Requirements

### Performance
- Initial page load under 3 seconds on 3G connection
- Navigation between views under 1 second
- Spec viewing and diff rendering under 2 seconds
- API response times under 200ms for 95% of requests

### Security
- All authentication tokens stored securely (httpOnly cookies or secure storage)
- SQL injection prevention through ORM/query parameterization
- XSS prevention through proper output encoding
- CSRF protection for state-changing operations
- Rate limiting on authentication endpoints
- Input validation and sanitization on all user inputs
- Audit logging for sensitive operations (spec changes, run triggers)

### Accessibility
- WCAG 2.1 AA compliance
- Proper color contrast ratios (minimum 4.5:1 for text)
- Keyboard navigable interface with visible focus states
- ARIA labels for all interactive elements
- Screen reader friendly content structure
- Responsive text scaling support

### Reliability
- Graceful degradation when API services are unavailable
- Client-side caching for improved offline experience
- Error boundaries to prevent cascading failures
- Retry mechanisms for failed API requests
- Meaningful error messages for users
- Health check endpoints for monitoring

### Scalability
- Code splitting for efficient bundle loading
- Lazy loading of route components
- Efficient state management to minimize re-renders
- Virtualized lists for large datasets (specs, runs)
- Efficient diff algorithms for specification comparison

## Acceptance Criteria

### Authentication Flow
1. User can sign in with Google OAuth
2. User can sign in with magic link email
3. User is redirected to organization selection after auth
4. Session persists across browser refreshes
5. User can sign out securely

### Project Dashboard
1. User sees list of accessible projects upon login
2. User can create new project with name and description
3. Project cards show spec version, last run status, and failure count
4. Clicking project navigates to project detail view

### Specification Viewer
1. User can view specification content in readable format
2. User can see version history with timestamps
3. User can view diff between any two versions
4. User can export evidence package as ZIP file

### Run Reports
1. User sees run metadata prominently displayed
2. User can filter runs by status (pass/fail/running)
3. User sees clear pass/fail indicators for each check
4. Failure details include relevant log snippets
5. User can download all associated artifacts

### General Usability
1. All interactive elements are keyboard accessible
2. Color is not used as the sole means of conveying information
3. Form elements have associated labels
4. Error messages are descriptive and actionable
5. Loading states are shown during asynchronous operations