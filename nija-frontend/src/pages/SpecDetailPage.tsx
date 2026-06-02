import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, ArrowLeftRight } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Breadcrumbs, Spinner, Alert, Button, Card } from '@/components/ui';
import { SpecViewer, SpecDiff } from '@/components/specs';
import { useSpecification, useSpecVersions, useSpecDiff, useExportEvidencePackage } from '@/hooks/useSpecifications';
import { useProject } from '@/hooks/useProjects';
import { ROUTES, buildPath } from '@/routes/paths';
import type { SpecVersion } from '@/types';
import './SpecDetailPage.css';

const SpecDetailPage = () => {
  const { projectId, specId } = useParams<{ projectId: string; specId: string }>();
  const [compareVersionId, setCompareVersionId] = useState<string>('');
  const [showDiff, setShowDiff] = useState(false);

  const { data: project } = useProject(projectId!);
  const { data: spec, isLoading, error } = useSpecification(specId!);
  const { data: versions } = useSpecVersions(projectId!);
  const { data: diffData, isLoading: diffLoading } = useSpecDiff(
    specId!,
    compareVersionId
  );
  const exportEvidence = useExportEvidencePackage();

  const specList = versions ?? [];

  const handleExport = async () => {
    if (!specId) return;
    try {
      const blob = await exportEvidence.mutateAsync(specId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidence-${specId}.zip`;
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
        <div className="spec-detail-page__loading">
          <Spinner size="lg" label="Loading specification" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="spec-detail-page">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: ROUTES.DASHBOARD },
              { label: 'Projects', href: ROUTES.PROJECTS },
              { label: project?.name ?? 'Project', href: buildPath.projectDetail(projectId!) },
              { label: 'Specifications', href: buildPath.specs(projectId!) },
              { label: 'Error' },
            ]}
          />
          <Alert variant="danger" title="Error loading specification">
            {error.message}
          </Alert>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="spec-detail-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: ROUTES.DASHBOARD },
            { label: 'Projects', href: ROUTES.PROJECTS },
            { label: project?.name ?? 'Project', href: buildPath.projectDetail(projectId!) },
            { label: 'Specifications', href: buildPath.specs(projectId!) },
            { label: spec ? `v${spec.version}` : 'Detail' },
          ]}
        />

        <header className="spec-detail-page__header">
          <div className="spec-detail-page__header-info">
            <h1 className="spec-detail-page__title">Specification Detail</h1>
            {spec && (
              <p className="spec-detail-page__subtitle">
                Version {spec.version} &middot; {spec.source.toUpperCase()} source
              </p>
            )}
          </div>
          <div className="spec-detail-page__header-actions">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeftRight size={16} />}
              onClick={() => setShowDiff(!showDiff)}
              disabled={specList.length < 2}
            >
              {showDiff ? 'Hide Diff' : 'Compare Versions'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={handleExport}
              isLoading={exportEvidence.isPending}
            >
              Export Evidence
            </Button>
          </div>
        </header>

        {showDiff && (
          <Card className="spec-detail-page__diff-section">
            <h3 className="spec-detail-page__diff-title">Compare with version</h3>
            <div className="spec-detail-page__diff-controls">
              <select
                className="spec-detail-page__diff-select"
                value={compareVersionId}
                onChange={(e) => setCompareVersionId(e.target.value)}
                aria-label="Select version to compare"
              >
                <option value="">Select a version...</option>
                {specList
                  .filter((v) => v.id !== specId)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      Version {v.version}
                    </option>
                  ))}
              </select>
            </div>
            {diffLoading && <Spinner size="sm" label="Loading diff" />}
            {!diffLoading && diffData && (
              <SpecDiff
                additions={diffData.additions}
                deletions={diffData.deletions}
                changes={diffData.changes}
              />
            )}
          </Card>
        )}

        <section className="spec-detail-page__content" aria-label="Specification content">
          <SpecViewer spec={spec ?? null} />
        </section>

        {specList.length > 0 && (
          <section className="spec-detail-page__versions" aria-label="Version history">
            <h2 className="spec-detail-page__section-title">Version History</h2>
            <div className="spec-detail-page__versions-list">
              {specList.map((version) => (
                <VersionHistoryItem
                  key={version.id}
                  version={version}
                  isCurrent={version.id === specId}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

function VersionHistoryItem({ version, isCurrent }: { version: SpecVersion; isCurrent: boolean }) {
  return (
    <div
      className={`spec-detail-page__version-item ${
        isCurrent ? 'spec-detail-page__version-item--current' : ''
      }`}
    >
      <span className="spec-detail-page__version-badge">v{version.version}</span>
      <span className="spec-detail-page__version-hash">{version.specHash.substring(0, 12)}...</span>
      <span className="spec-detail-page__version-date">
        {new Date(version.createdAt).toLocaleDateString('en-NG', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
      {isCurrent && <span className="spec-detail-page__version-current">Current</span>}
    </div>
  );
}

export default SpecDetailPage;
