import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FolderOpen } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Breadcrumbs, Button, Input, Modal, Alert, Spinner, EmptyState } from '@/components/ui';
import { ProjectCard } from '@/components/dashboard';
import { useProjects, useCreateProject } from '@/hooks/useProjects';
import { useOrganization } from '@/stores';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { ROUTES, buildPath } from '@/routes/paths';
import type { ProjectWithMetadata } from '@/types';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const { currentOrganization } = useOrganization();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const { page, pageSize, setPage } = usePagination();
  const debouncedSearch = useDebounce(search, 300);

  const orgId = currentOrganization?.id ?? '';
  const { data, isLoading, error } = useProjects(orgId, page, pageSize);
  const createProject = useCreateProject(orgId);

  const allProjects = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const filteredProjects = debouncedSearch
    ? allProjects.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : allProjects;

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
      <div className="projects-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: ROUTES.DASHBOARD },
            { label: 'Projects' },
          ]}
        />

        <header className="projects-page__header">
          <div>
            <h1 className="projects-page__title">Projects</h1>
            <p className="projects-page__subtitle">
              Manage your specification projects
            </p>
          </div>
          <Button
            leftIcon={<Plus size={18} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Project
          </Button>
        </header>

        <div className="projects-page__toolbar">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
            fullWidth
          />
        </div>

        {error && (
          <Alert variant="danger" title="Error loading projects">
            {error.message}
          </Alert>
        )}

        {isLoading ? (
          <div className="projects-page__loading">
            <Spinner size="lg" label="Loading projects" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            title={debouncedSearch ? 'No matching projects' : 'No projects yet'}
            description={
              debouncedSearch
                ? `No projects match "${debouncedSearch}". Try a different search.`
                : 'Create your first project to get started.'
            }
            action={
              !debouncedSearch
                ? { label: 'Create Project', onClick: () => setIsCreateModalOpen(true) }
                : undefined
            }
            icon={<FolderOpen size={48} />}
          />
        ) : (
          <>
            <div className="projects-page__grid" role="list" aria-label="Projects">
              {filteredProjects.map((project) => (
                <div key={project.id} role="listitem">
                  <ProjectCard project={project} onClick={handleProjectClick} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="projects-page__pagination" aria-label="Pagination">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="projects-page__pagination-info">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </nav>
            )}
          </>
        )}

        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Project"
        >
          <form
            className="projects-page__form"
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
            <div className="projects-page__form-actions">
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

export default ProjectsPage;
