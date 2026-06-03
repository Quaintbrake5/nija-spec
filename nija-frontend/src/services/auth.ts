import apiService from './api';
import type { User } from '@/types';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

interface MagicLinkResponse {
  message: string;
  email: string;
}

export const authService = {
  async loginWithGoogle(): Promise<void> {
    // First check if Google OAuth is configured by making a request to the endpoint
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/google/login`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      // If the response indicates Google OAuth is not configured, use mock authentication
      if (data.mock) {
        console.warn('Google OAuth is not configured:', data.message);
        // For development, simulate a successful OAuth callback with mock data
        console.log('Using mock Google authentication for development...');
        await this.handleGoogleCallback('mock-auth-code-12345');
        return;
      }

      // If we get here, redirect to the Google OAuth URL
      globalThis.location.href = `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/google/login`;
    } catch (error) {
      console.error('Error checking Google OAuth configuration:', error);
      // Fallback to direct redirect
      globalThis.location.href = `${import.meta.env.VITE_API_BASE_URL || '/api'}/auth/google/login`;
    }
  },

  async handleGoogleCallback(code: string): Promise<AuthTokens> {
    const response = await apiService.post<AuthTokens>('/auth/google/callback', { code });
    const { accessToken, refreshToken, user } = response.data;

    // Store tokens
    apiService.setAccessToken(accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { accessToken, refreshToken, user };
  },

  async sendMagicLink(email: string): Promise<MagicLinkResponse> {
    const response = await apiService.post<MagicLinkResponse>('/auth/magic-link/send', { email });
    return response.data;
  },

  async verifyMagicLink(token: string): Promise<AuthTokens> {
    const response = await apiService.post<AuthTokens>('/auth/magic-link/verify', { token });
    const { accessToken, refreshToken, user } = response.data;

    // Store tokens
    apiService.setAccessToken(accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return { accessToken, refreshToken, user };
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      apiService.clearAccessToken();
      localStorage.removeItem('refreshToken');
    }
  },

  async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiService.post<AuthTokens>('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken, user } = response.data;

    apiService.setAccessToken(accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken, user };
  },

  // Initialize from stored tokens
  initializeAuth(): { accessToken: string | null; refreshToken: string | null } {
    const refreshToken = localStorage.getItem('refreshToken');
    // Note: accessToken is typically stored in memory, not localStorage
    return { accessToken: null, refreshToken };
  },
};