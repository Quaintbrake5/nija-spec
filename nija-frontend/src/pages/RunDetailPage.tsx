import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, XCircle, Clock, Cpu, Coins, Calendar } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Breadcrumbs, Spinner, Alert, Button, Card } from '@/components/ui';
import { RunStatusBadge, RunResultsTable, ArtifactList } from '@/components/runs';
import { useRun, useRunResults, useRunArtifacts, useRunTimeline, useTriggerRun, useCancelRun, useDownloadArtifact } from '@/hooks/useRuns';
import { useProject } from '@/hooks/useProjects';
import { ROUTES, buildPath } from '@/routes/paths';
import './RunDetailPage.css';

const RunDetailPage = () => {
  const { projectId, runId } = useParams<{ projectId: string; runId: string }>();
  const navigate = useNavigate();

  const { data: project } = useProject(projectId!);
  const { data: run, isLoading, error } = useRun(runId!);
  const { data: results, isLoading: resultsLoading } = useRunResults(runId!);
  const { data: artifacts } = useRunArtifacts(runId!);
  const { data: timeline, isLoading: timelineLoading } = useRunTimeline(runId!);

  const triggerRun = useTriggerRun(projectId!);
  const cancelRun = useCancelRun();
  const downloadArtifact = useDownloadArtifact();

  const handleTriggerRun = async () => {
    if (!run) return;
    try {
      await triggerRun.mutateAsync({ specId: run.specId });
      navigate(buildPath.runs(projectId!));
    } catch {
      // Error handled by mutation
    }
  };

  const handleCancelRun = async () => {
    if (!runId) return;
    try {
      await cancelRun.mutateAsync(runId);
    } catch {
      // Error handled by mutation
    }
  };

  const handleDownloadArtifact = async (artifactId: string) => {
    try {
      const blob = await downloadArtifact.mutateAsync(artifactId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = artifactId;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="run-detail-page__loading">
          <Spinner size="lg" label="Loading run details" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="run-detail-page">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: ROUTES.DASHBOARD },
              { label: 'Projects', href: ROUTES.PROJECTS },
              { label: project?.name ?? 'Project', href: buildPath.projectDetail(projectId!) },
              { label: 'Runs', href: buildPath.runs(projectId!) },
              { label: 'Error' },
            ]}
          />
          <Alert variant="danger" title="Error loading run">
            {error.message}
          </Alert>
        </div>
      </MainLayout>
    );
  }

  if (!run) {
    return (
      <MainLayout>
        <div className="run-detail-page">
          <Alert variant="warning">Run not found.</Alert>
        </div>
      </MainLayout>
    );
  }

  const canCancel = run.status === 'QUEUED' || run.status === 'RUNNING';
  const isTerminal = run.status === 'SUCCEEDED' || run.status === 'FAILED' || run.status === 'CANCELED';

  return (
    <MainLayout>
      <div className="run-detail-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: ROUTES.DASHBOARD },
            { label: 'Projects', href: ROUTES.PROJECTS },
            { label: project?.name ?? 'Project', href: buildPath.projectDetail(projectId!) },
            { label: 'Runs', href: buildPath.runs(projectId!) },
            { label: `Run ${runId!.substring(0, 8)}...` },
          ]}
        />

        <header className="run-detail-page__header">
          <div className="run-detail-page__header-top">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate(buildPath.runs(projectId!))}
            >
              Back to Runs
            </Button>
          </div>
          <div className="run-detail-page__header-info">
            <div className="run-detail-page__title-row">
              <h1 className="run-detail-page__title">Run Details</h1>
              <RunStatusBadge status={run.status} />
            </div>
            <p className="run-detail-page__subtitle">
              {run.providerId}/{run.modelIdentifier}
            </p>
          </div>
          <div className="run-detail-page__header-actions">
            {canCancel && (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<XCircle size={16} />}
                onClick={handleCancelRun}
                isLoading={cancelRun.isPending}
              >
                Cancel Run
              </Button>
            )}
            {isTerminal && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Play size={16} />}
                onClick={handleTriggerRun}
                isLoading={triggerRun.isPending}
              >
                Re-run
              </Button>
            )}
          </div>
        </header>

        <section className="run-detail-page__metadata" aria-label="Run metadata">
          <Card>
            <div className="run-detail-page__metadata-grid">
              <div className="run-detail-page__meta-item">
                <span className="run-detail-page__meta-icon" aria-hidden="true">
                  <Cpu size={16} />
                </span>
                <div>
                  <span className="run-detail-page__meta-label">Tokens</span>
                  <span className="run-detail-page__meta-value">
                    {run.tokenTotal.toLocaleString()} total
                  </span>
                </div>
              </div>
              <div className="run-detail-page__meta-item">
                <span className="run-detail-page__meta-icon" aria-hidden="true">
                  <Coins size={16} />
                </span>
                <div>
                  <span className="run-detail-page__meta-label">Cost</span>
                  <span className="run-detail-page__meta-value">
                    ₦{run.estimatedCostNaira.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="run-detail-page__meta-item">
                <span className="run-detail-page__meta-icon" aria-hidden="true">
                  <Calendar size={16} />
                </span>
                <div>
                  <span className="run-detail-page__meta-label">Created</span>
                  <span className="run-detail-page__meta-value">
                    {new Date(run.createdAt).toLocaleString('en-NG')}
                  </span>
                </div>
              </div>
              {run.completedAt && (
                <div className="run-detail-page__meta-item">
                  <span className="run-detail-page__meta-icon" aria-hidden="true">
                    <Clock size={16} />
                  </span>
                  <div>
                    <span className="run-detail-page__meta-label">Completed</span>
                    <span className="run-detail-page__meta-value">
                      {new Date(run.completedAt).toLocaleString('en-NG')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>

        <section className="run-detail-page__results" aria-label="Check results">
          <h2 className="run-detail-page__section-title">Check Results</h2>
          <RunResultsTable results={results ?? null} loading={resultsLoading} />
        </section>

        <section className="run-detail-page__artifacts" aria-label="Artifacts">
          <ArtifactList
            artifacts={artifacts ?? []}
            onDownload={handleDownloadArtifact}
          />
        </section>

        <section className="run-detail-page__timeline" aria-label="Run timeline">
          <h2 className="run-detail-page__section-title">Timeline</h2>
          {timelineLoading ? (
            <Spinner size="sm" label="Loading timeline" />
          ) : timeline && timeline.length > 0 ? (
            <div className="run-detail-page__timeline-list">
              {timeline.map((entry, index) => (
                <div key={index} className="run-detail-page__timeline-item">
                  <div className="run-detail-page__timeline-dot" />
                  <div className="run-detail-page__timeline-content">
                    <span className="run-detail-page__timeline-status">{entry.status}</span>
                    <span className="run-detail-page__timeline-time">
                      {new Date(entry.timestamp).toLocaleString('en-NG')}
                    </span>
                    {entry.message && (
                      <p className="run-detail-page__timeline-message">{entry.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="run-detail-page__timeline-empty">No timeline data available.</p>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

export default RunDetailPage;
