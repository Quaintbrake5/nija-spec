import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/stores';
import { ROUTES } from './paths';
import type { ReactNode } from 'react';

// Lazy loaded pages
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const AuthCallbackPage = lazy(() => import('@/pages/AuthCallbackPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage'));
const SpecsPage = lazy(() => import('@/pages/SpecsPage'));
const SpecDetailPage = lazy(() => import('@/pages/SpecDetailPage'));
const RunsPage = lazy(() => import('@/pages/RunsPage'));
const RunDetailPage = lazy(() => import('@/pages/RunDetailPage'));
const AllRunsPage = lazy(() => import('@/pages/AllRunsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

const SuspenseFallback = () => (
  <div className="loading-screen">
    <div className="loading-spinner">Loading...</div>
  </div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />

          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.PROJECTS}
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PROJECT_DETAIL}
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.SPECS}
            element={
              <ProtectedRoute>
                <SpecsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SPEC_DETAIL}
            element={
              <ProtectedRoute>
                <SpecDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.RUNS}
            element={
              <ProtectedRoute>
                <RunsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.RUN_DETAIL}
            element={
              <ProtectedRoute>
                <RunDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ALL_RUNS}
            element={
              <ProtectedRoute>
                <AllRunsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

          <Route
            path={ROUTES.NOT_FOUND}
            element={
              <ProtectedRoute>
                <NotFoundPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
