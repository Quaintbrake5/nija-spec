import { getErrorMessage } from "@/utils/errors";
import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '@/types';
import { authService } from '@/services';

// Auth actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_FAILURE':
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

// Context
interface AuthContextType extends AuthState {
  loginWithGoogle: () => void;
  sendMagicLink: (email: string) => Promise<void>;
  verifyMagicLink: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { refreshToken } = authService.initializeAuth();
        if (refreshToken) {
          // Try to refresh token to validate session
          await authService.refreshAccessToken(refreshToken);
          const user = await authService.getCurrentUser();
          dispatch({ type: 'AUTH_SUCCESS', payload: user });
        } else {
          dispatch({ type: 'AUTH_FAILURE', payload: 'No refresh token' });
        }
      } catch {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Failed to initialize auth' });
      }
    };

    initializeAuth();
  }, []);

  const loginWithGoogle = useCallback(() => {
    dispatch({ type: 'AUTH_START' });
    authService.loginWithGoogle();
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await authService.sendMagicLink(email);
      // Don't set authenticated yet - wait for verification
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: getErrorMessage(error) });
      throw error;
    }
  }, []);

  const verifyMagicLink = useCallback(async (token: string) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { user } = await authService.verifyMagicLink(token);
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: getErrorMessage(error) });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = await authService.getCurrentUser();
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: getErrorMessage(error) });
    }
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      ...state,
      loginWithGoogle,
      sendMagicLink,
      verifyMagicLink,
      logout,
      getCurrentUser,
    }),
    [state, loginWithGoogle, sendMagicLink, verifyMagicLink, logout, getCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
