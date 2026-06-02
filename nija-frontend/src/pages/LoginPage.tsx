import React from 'react';
import { useAuth } from '@/stores';
import { Button } from '@/components/ui';

const LoginPage = () => {
  const { loginWithGoogle, sendMagicLink, isLoading } = useAuth();

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  const handleMagicLink = async () => {
    const email = prompt('Enter your email address:');
    if (email) {
      try {
        await sendMagicLink(email);
        alert('Magic link sent! Check your email.');
      } catch {
        alert('Failed to send magic link. Please try again.');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>NijaSpec</h1>
          <p>Sign in to your account</p>
        </div>

        <div className="login-methods">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            fullWidth
            variant="outline"
            leftIcon={<span>G</span>}
          >
            Continue with Google
          </Button>

          <div className="login-divider">
            <span>or</span>
          </div>

          <Button
            onClick={handleMagicLink}
            disabled={isLoading}
            fullWidth
            variant="secondary"
          >
            Sign in with Magic Link
          </Button>
        </div>

        <div className="login-footer">
          <p>
            By signing in, you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
