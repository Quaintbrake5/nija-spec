import React from 'react';
import { render, screen, act, fireEvent, cleanup } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import { authService } from '@/services';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the auth service
vi.mock('@/services', () => ({
  authService: {
    initializeAuth: vi.fn(),
    refreshAccessToken: vi.fn(),
    getCurrentUser: vi.fn(),
    loginWithGoogle: vi.fn(),
    sendMagicLink: vi.fn(),
    verifyMagicLink: vi.fn(),
    logout: vi.fn(),
  },
}));

const TestComponent = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user?.email || 'No User'}</div>
      <div data-testid="auth">{isAuthenticated.toString()}</div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders children when wrapped in AuthProvider', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user')).toBeInTheDocument();
  });

  it('throws error when useAuth is used without AuthProvider', () => {
    // Suppress console.error for this test as it's expected to throw
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  it('initializes auth and sets user if refresh token exists', async () => {
    const mockUser = { email: 'test@example.com', id: '123' };
    vi.mocked(authService.initializeAuth).mockReturnValue({ refreshToken: 'fake-token', accessToken: null });
    vi.mocked(authService.refreshAccessToken).mockResolvedValue({} as never);
    vi.mocked(authService.getCurrentUser).mockResolvedValue(mockUser);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('auth')).toHaveTextContent('true');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('sets auth failure if no refresh token exists', async () => {
    vi.mocked(authService.initializeAuth).mockReturnValue({ refreshToken: null, accessToken: null });

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('auth')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('handles logout', async () => {
    vi.mocked(authService.initializeAuth).mockReturnValue({ refreshToken: null, accessToken: null });
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByTestId('logout-btn'));
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(screen.getByTestId('auth')).toHaveTextContent('false');
  });
});
