import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, OrganizationProvider } from '@/stores';
import { AppRouter } from '@/routes';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <OrganizationProvider>
            <AppRouter />
          </OrganizationProvider>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
