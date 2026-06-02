import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PlayCircle, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Breadcrumbs, Spinner, Alert, EmptyState, Tag, Button } from '@/components/ui';
import { RunCard } from '@/components/runs';
import { useRuns } from '@/hooks/useRuns';
import { useProject } from '@/hooks/useProjects';
import { usePagination } from '@/hooks/usePagination';
import { ROUTES, buildPath } from '@/routes/paths';
import type { RunWithMetadata, RunStatus } from '@/types';
import './RunsPage.css';

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

const RunsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<RunStatus | ''>('');
  const { page, pageSize, setPage } = usePagination();

  const { data: project } = useProject(projectId!);
  const { data, isLoading, error } = useRuns(projectId!, {
    status: statusFilter || undefined,
    page,
    pageSize,
  });

  const runs = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleRunClick = (run: RunWithMetadata) => {
    navigate(buildPath.runDetail(projectId!, run.id));
  };

  return (
    <MainLayout>
      <div className="runs-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: ROUTES.DASHBOARD },
            { label: 'Projects', href: ROUTES.PROJECTS },
            { label: project?.name ?? 'Project', href: buildPath.projectDetail(projectId!) },
            { label: 'Runs' },
          ]}
        />

        <header className="runs-page__header">
          <div>
            <h1 className="runs-page__title">Runs</h1>
            <p className="runs-page__subtitle">
              Compliance check runs for {project?.name ?? 'this project'}
            </p>
          </div>
        </header>

        <div className="runs-page__filters" role="toolbar" aria-label="Filter runs by status">
          <Filter size={16} aria-hidden="true" className="runs-page__filter-icon" />
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              className={`runs-page__filter-btn ${
                statusFilter === filter.value ? 'runs-page__filter-btn--active' : ''
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

        {error && (
          <Alert variant="danger" title="Error loading runs">
            {error.message}
          </Alert>
        )}

        {isLoading ? (
          <div className="runs-page__loading">
            <Spinner size="lg" label="Loading runs" />
          </div>
        ) : runs.length === 0 ? (
          <EmptyState
            title="No runs found"
            description={
              statusFilter
                ? `No runs with status "${statusFilter}". Try a different filter.`
                : 'No runs have been triggered for this project yet.'
            }
            icon={<PlayCircle size={48} />}
          />
        ) : (
          <>
            <div className="runs-page__grid" role="list" aria-label="Runs">
              {runs.map((run) => (
                <div key={run.id} role="listitem">
                  <RunCard run={run} onClick={handleRunClick} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="runs-page__pagination" aria-label="Pagination">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="runs-page__pagination-info">
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
      </div>
    </MainLayout>
  );
};

export default RunsPage;
