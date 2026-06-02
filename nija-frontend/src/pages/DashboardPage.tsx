import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Button, Modal, Input, Spinner, Alert, EmptyState } from '@/components/ui';
import { StatsOverview, ProjectList } from '@/components/dashboard';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useOrganization } from '@/stores';
import { buildPath } from '@/routes/paths';
import type { ProjectWithMetadata } from '@/types';
import './DashboardPage.css';

const DashboardPage = () => {
  const { currentOrganization } = useOrganization();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const orgId = currentOrganization?.id ?? '';
  const { data, isLoading, error } = useProjects(orgId);
  const createProject = useCreateProject(orgId);

  const projects = data?.data ?? [];

  const stats = {
    totalProjects: data?.total ?? 0,
    totalSpecs: projects.reduce((sum, p) => sum + (p.latestSpecVersion ?? 0), 0),
    totalRuns: projects.reduce((sum, p) => sum + (p.failingEndpointsCount ?? 0), 0),
    passingRate: projects.length > 0
      ? (projects.filter((p) => p.lastRunStatus === 'SUCCEEDED').length / projects.length) * 100
      : 0,
    totalCostNaira: 0,
  };

  const handleProjectClick = (project: ProjectWithMetadata) => {
    navigate(buildPath.projectDetail(project.id));
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;
    try {
      await createProject.mutateAsync({
        name: projectName.trim(),
        description: projectDescription.trim() || undefined,
      });
      setIsCreateModalOpen(false);
      setProjectName('');
      setProjectDescription('');
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-page">
        <header className="dashboard-page__header">
          <div>
            <h1 className="dashboard-page__title">Dashboard</h1>
            <p className="dashboard-page__subtitle">
              {currentOrganization?.name ?? 'Organization'} overview
            </p>
          </div>
          <Button
            leftIcon={<Plus size={18} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Project
          </Button>
        </header>

        {error && (
          <Alert variant="danger" title="Error loading dashboard">
            {error.message}
          </Alert>
        )}

        {isLoading ? (
          <div className="dashboard-page__loading">
            <Spinner size="lg" label="Loading dashboard" />
          </div>
        ) : (
          <>
            <section className="dashboard-page__stats" aria-label="Statistics">
              <StatsOverview stats={stats} />
            </section>

            <section className="dashboard-page__projects" aria-label="Recent projects">
              <div className="dashboard-page__section-header">
                <h2 className="dashboard-page__section-title">Recent Projects</h2>
              </div>
              {projects.length === 0 ? (
                <EmptyState
                  title="No projects yet"
                  description="Create your first project to get started with NijaSpec."
                  action={{
                    label: 'Create Project',
                    onClick: () => setIsCreateModalOpen(true),
                  }}
                  icon={<FolderOpen size={48} />}
                />
              ) : (
                <ProjectList
                  projects={projects.slice(0, 6)}
                  onProjectClick={handleProjectClick}
                />
              )}
            </section>
          </>
        )}

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Project"
        >
          <form
            className="dashboard-page__form"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateProject();
            }}
          >
            <Input
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Project"
              fullWidth
              required
            />
            <Input
              label="Description (optional)"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="A brief description of your project"
              fullWidth
            />
            {createProject.isError && (
              <Alert variant="danger">{createProject.error.message}</Alert>
            )}
            <div className="dashboard-page__form-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={createProject.isPending}
                disabled={!projectName.trim()}
              >
                Create Project
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
