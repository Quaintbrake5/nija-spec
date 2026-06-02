# NijaSpec Frontend

React-based web dashboard for NijaSpec compliance auditing engine.

## Features

- **Authentication**: Google OAuth and Magic Link authentication
- **Organization Management**: Multi-organization support with role-based access
- **Project Dashboard**: Project overview with spec status and run history
- **Specification Viewer**: View, compare, and manage specifications
- **Run History**: Detailed run reports with artifact downloads
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: WCAG 2.1 AA compliance

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Styling**: CSS Variables (Design Tokens)
- **Testing**: Vitest + React Testing Library

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

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

## Project Structure

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

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8001/api

# Google OAuth (if using)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Vite Configuration

The Vite configuration includes:

- Path aliases (`@/` for `src/`)
- API proxy to backend (`/api` to `http://localhost:8001`)
- Code splitting for vendor libraries

## Development

### Running Locally

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

### API Integration

The frontend proxies API requests to the backend at `http://localhost:8001`. Ensure the backend is running for full functionality.

### Code Quality

- **ESLint**: Linting for TypeScript and React
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Vitest**: Unit and component testing

## Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

## Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Accessibility

This application follows WCAG 2.1 AA guidelines:

- Semantic HTML elements
- Proper heading hierarchy
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## Contributing

1. Follow the coding standards (ESLint, Prettier)
2. Write tests for new features
3. Update documentation as needed
4. Ensure accessibility compliance
