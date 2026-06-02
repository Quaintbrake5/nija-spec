import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { ROUTES } from '@/routes/paths';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-page__container">
        <div className="not-found-page__code" aria-hidden="true">404</div>
        <h1 className="not-found-page__title">Page Not Found</h1>
        <p className="not-found-page__description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="not-found-page__actions">
          <Button
            variant="primary"
            leftIcon={<Home size={18} />}
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
