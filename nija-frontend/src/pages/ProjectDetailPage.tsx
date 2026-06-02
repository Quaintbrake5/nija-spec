import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FileText, PlayCircle, BarChart3, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Breadcrumbs, Spinner, Alert, Button, Card } from '@/components/ui';
import { useProject } from '@/hooks/useProjects';
import { ROUTES, buildPath } from '@/routes/paths';
import './ProjectDetailPage.css';

type TabId = 'overview' | 'specs' | 'runs';

const TABS: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
  { id: 'specs', label: 'Specifications', icon: <FileText size={16} /> },
  { id: 'runs', label: 'Runs', icon: <PlayCircle size={16} /> },
];

const ProjectDetailPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    if (location.pathname.includes('/specs')) return 'specs';
    if (location.pathname.includes('/runs')) return 'runs';
    return 'overview';
  });

  const { data: project, isLoading, error } = useProject(projectId!);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    if (tabId === 'specs') {
      navigate(buildPath.specs(projectId!));
    } else if (tabId === 'runs') {
      navigate(buildPath.runs(projectId!));
    } else {
      navigate(buildPath.projectDetail(projectId!));
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="project-detail-page__loading">
          <Spinner size="lg" label="Loading project" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="project-detail-page">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: ROUTES.DASHBOARD },
              { label: 'Projects', href: ROUTES.PROJECTS },
              { label: 'Error' },
            ]}
          />
          <Alert variant="danger" title="Error loading project">
            {error.message}
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="project-detail-page">
          <Alert variant="warning">Project not found.</Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="project-detail-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: ROUTES.DASHBOARD },
            { label: 'Projects', href: ROUTES.PROJECTS },
            { label: project.name },
          ]}
        />

        <header className="project-detail-page__header">
          <div className="project-detail-page__header-top">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(ROUTES.PROJECTS)}
            >
              Back
            </Button>
          </div>
          <div className="project-detail-page__header-info">
            <h1 className="project-detail-page__title">{project.name}</h1>
            {project.description && (
              <p className="project-detail-page__description">{project.description}</p>
            )}
            <div className="project-detail-page__meta">
              <span className="project-detail-page__meta-item">
                Created {new Date(project.createdAt).toLocaleDateString('en-NG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="project-detail-page__meta-item">
                Slug: {project.slug}
              </span>
            </div>
          </div>
        </header>

        <nav className="project-detail-page__tabs" aria-label="Project tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`project-detail-page__tab ${
                activeTab === tab.id ? 'project-detail-page__tab--active' : ''
              }`}
              onClick={() => handleTabChange(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="project-detail-page__content" role="tabpanel">
          {activeTab === 'overview' && (
            <div className="project-detail-page__overview">
              <Card>
                <div className="project-detail-page__overview-grid">
                  <div className="project-detail-page__overview-item">
                    <span className="project-detail-page__overview-label">Project ID</span>
                    <span className="project-detail-page__overview-value project-detail-page__overview-value--mono">
                      {project.id}
                    </span>
                  </div>
                  <div className="project-detail-page__overview-item">
                    <span className="project-detail-page__overview-label">Organization</span>
                    <span className="project-detail-page__overview-value">
                      {project.organizationId}
                    </span>
                  </div>
                  <div className="project-detail-page__overview-item">
                    <span className="project-detail-page__overview-label">Created</span>
                    <span className="project-detail-page__overview-value">
                      {new Date(project.createdAt).toLocaleString('en-NG')}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="project-detail-page__specs">
              <Alert variant="info">
                Specifications view is available in the dedicated Specifications tab.
              </Alert>
            </div>
          )}

          {activeTab === 'runs' && (
            <div className="project-detail-page__runs">
              <Alert variant="info">
                Runs view is available in the dedicated Runs tab.
              </Alert>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetailPage;
