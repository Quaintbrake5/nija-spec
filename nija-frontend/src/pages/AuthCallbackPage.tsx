import { useSearchParams } from 'react-router-dom';
import { AuthCallback } from '@/components/auth';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const isMagicLink = searchParams.has('token');

  return (
    <AuthCallback type={isMagicLink ? 'magic-link' : 'google'} />
  );
};

export default AuthCallbackPage;
