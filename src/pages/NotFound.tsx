
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-studio-600 mb-4">404</h1>
        <p className="text-2xl font-medium mb-6">Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/')}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
