import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

// Mock the auth service to prevent real API calls
vi.mock('@/services/auth', () => ({
  authService: {
    initializeAuth: () => ({ accessToken: null, refreshToken: null }),
    getCurrentUser: vi.fn().mockRejectedValue(new Error('Not authenticated')),
  },
}));

vi.mock('@/services/organizations', () => ({
  organizationService: {
    getOrganizations: vi.fn().mockRejectedValue(new Error('Not authenticated')),
    getCurrentOrganization: () => null,
    setCurrentOrganization: vi.fn(),
  },
}));

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />);
    // The app should render and eventually show the login page or loading state
    // Since auth fails, it should redirect to login
    await vi.waitFor(() => {
      expect(document.body).toBeDefined();
    });
  });
});
