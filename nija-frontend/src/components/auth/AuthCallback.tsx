import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { authService } from '@/services';
import './AuthCallback.css';

export type AuthCallbackType = 'google' | 'magic-link';

export interface AuthCallbackProps {
  type?: AuthCallbackType;
}

export const AuthCallback = ({ type = 'google' }: AuthCallbackProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (type === 'google') {
          const code = searchParams.get('code');
          const errorParam = searchParams.get('error');

          if (errorParam) {
            setError(searchParams.get('error_description') || 'Authentication was denied.');
            return;
          }

          if (!code) {
            setError('No authorization code received from Google.');
            return;
          }

          await authService.handleGoogleCallback(code);
        } else if (type === 'magic-link') {
          const token = searchParams.get('token');
          const errorParam = searchParams.get('error');

          if (errorParam) {
            setError(searchParams.get('error_description') || 'Magic link verification failed.');
            return;
          }

          if (!token) {
            setError('No verification token found in the link.');
            return;
          }

          await authService.verifyMagicLink(token);
        }

        navigate('/dashboard', { replace: true });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'An unexpected error occurred during authentication.';
        setError(message);
      }
    };

    handleCallback();
  }, [type, searchParams, navigate]);

  if (error) {
    return (
      <div className="auth-callback auth-callback--error" role="alert" aria-live="assertive">
        <AlertCircle className="auth-callback__error-icon" size={48} aria-hidden="true" />
        <h1 className="auth-callback__error-title">Authentication Failed</h1>
        <p className="auth-callback__error-message">{error}</p>
        <button
          className="auth-callback__retry"
          onClick={() => navigate('/login', { replace: true })}
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="auth-callback" role="status" aria-live="polite">
      <div className="auth-callback__spinner" aria-hidden="true" />
      <h1 className="auth-callback__title">
        {type === 'google' ? 'Signing in with Google...' : 'Verifying your magic link...'}
      </h1>
      <p className="auth-callback__message">
        Please wait while we complete your authentication.
      </p>
    </div>
  );
};

export default AuthCallback;
