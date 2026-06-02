import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, PlayCircle, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Breadcrumbs, Spinner, EmptyState, Input, Tag, Button } from '@/components/ui';
import { RunCard } from '@/components/runs';
import { useOrganization } from '@/stores';
import { useProjects } from '@/hooks/useProjects';
import { useRuns } from '@/hooks/useRuns';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { ROUTES, buildPath } from '@/routes/paths';
import type { ProjectWithMetadata, RunWithMetadata, RunStatus } from '@/types';
import './AllRunsPage.css';

const STATUS_FILTERS: Array<{ value: RunStatus | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'SUCCEEDED', label: 'Passed' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'RUNNING', label: 'Running' },
  { value: 'QUEUED', label: 'Queued' },
  { value: 'CANCELED', label: 'Canceled' },
];

const STATUS_VARIANT: Record<RunStatus | '', 'success' | 'danger' | 'info' | 'neutral' | 'warning'> = {
  '': 'neutral',
  SUCCEEDED: 'success',
  FAILED: 'danger',
  RUNNING: 'info',
  QUEUED: 'neutral',
  CANCELED: 'warning',
};

const AllRunsPage = () => {
  const { currentOrganization } = useOrganization();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<RunStatus | ''>('');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const { page, setPage } = usePagination();

  const orgId = currentOrganization?.id ?? '';
  const { data: projectsData } = useProjects(orgId, 1, 100);

  const projects = projectsData?.data ?? [];
  const filteredProjects = debouncedSearch
    ? projects.filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : projects;

  const handleRunClick = (run: RunWithMetadata) => {
    navigate(buildPath.runDetail(run.projectId, run.id));
  };

  return (
    <MainLayout>
      <div className="all-runs-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: ROUTES.DASHBOARD },
            { label: 'All Runs' },
          ]}
        />

        <header className="all-runs-page__header">
          <div>
            <h1 className="all-runs-page__title">All Runs</h1>
            <p className="all-runs-page__subtitle">
              Compliance check runs across all projects
            </p>
          </div>
        </header>

        <div className="all-runs-page__toolbar">
          <Input
            placeholder="Search by project name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={18} />}
            fullWidth
          />
        </div>

        <div className="all-runs-page__filters" role="toolbar" aria-label="Filter runs by status">
          <Filter size={16} aria-hidden="true" className="all-runs-page__filter-icon" />
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`all-runs-page__filter-btn ${
                statusFilter === filter.value ? 'all-runs-page__filter-btn--active' : ''
              }`}
              onClick={() => {
                setStatusFilter(filter.value);
                setPage(1);
              }}
              aria-pressed={statusFilter === filter.value}
            >
              <Tag variant={STATUS_VARIANT[filter.value]} size="sm">
                {filter.label}
              </Tag>
            </button>
          ))}
        </div>

        {filteredProjects.length === 0 ? (
          <EmptyState
            title={debouncedSearch ? 'No matching projects' : 'No projects found'}
            description={
              debouncedSearch
                ? `No projects match "${debouncedSearch}".`
                : 'Create a project to see runs.'
            }
            icon={<PlayCircle size={48} />}
          />
        ) : (
          <div className="all-runs-page__projects">
            {filteredProjects.map((project) => (
              <ProjectRunsSection
                key={project.id}
                project={project}
                statusFilter={statusFilter}
                onRunClick={handleRunClick}
                onProjectClick={() => navigate(buildPath.projectDetail(project.id))}
              />
            ))}
          </div>
        )}

        <nav className="all-runs-page__pagination" aria-label="Pagination">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="all-runs-page__pagination-info">
            Page {page}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </nav>
      </div>
    </MainLayout>
  );
};

function ProjectRunsSection({
  project,
  statusFilter,
  onRunClick,
  onProjectClick,
}: {
  project: ProjectWithMetadata;
  statusFilter: RunStatus | '';
  onRunClick: (run: RunWithMetadata) => void;
  onProjectClick: () => void;
}) {
  const { data, isLoading } = useRuns(project.id, { status: statusFilter || undefined });

  const runs = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="all-runs-page__project-section">
        <div className="all-runs-page__project-header">
          <h3 className="all-runs-page__project-name">{project.name}</h3>
        </div>
        <Spinner size="sm" label="Loading runs" />
      </div>
    );
  }

  if (runs.length === 0) {
    return null;
  }

  return (
    <div className="all-runs-page__project-section">
      <div className="all-runs-page__project-header">
        <h3
          className="all-runs-page__project-name all-runs-page__project-name--clickable"
          onClick={onProjectClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onProjectClick();
            }
          }}
        >
          {project.name}
        </h3>
      </div>
      <div className="all-runs-page__runs-grid" role="list" aria-label={`Runs for ${project.name}`}>
        {runs.map((run) => (
          <div key={run.id} role="listitem">
            <RunCard run={run} onClick={onRunClick} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRunsPage;
