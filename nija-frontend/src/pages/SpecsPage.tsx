import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, FileText, Clock, Hash } from 'lucide-react';
import { MainLayout } from '@/components/layout';
import { Breadcrumbs, Button, Spinner, Alert, EmptyState, Modal, Card, Tag } from '@/components/ui';
import { SpecUploadForm } from '@/components/specs';
import { useSpecVersions, useUploadSpecification } from '@/hooks/useSpecifications';
import { useProject } from '@/hooks/useProjects';
import { ROUTES, buildPath } from '@/routes/paths';
import type { SpecVersion } from '@/types';
import './SpecsPage.css';

const SpecsPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const { data: project } = useProject(projectId!);
  const { data: versions, isLoading, error } = useSpecVersions(projectId!);
  const uploadSpec = useUploadSpecification(projectId!);

  const handleUpload = async (content: string) => {
    await uploadSpec.mutateAsync(content);
    setIsUploadModalOpen(false);
  };

  const specList = versions ?? [];

  return (
    <MainLayout>
      <div className="specs-page">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: ROUTES.DASHBOARD },
            { label: 'Projects', href: ROUTES.PROJECTS },
            { label: project?.name ?? 'Project', href: buildPath.projectDetail(projectId!) },
            { label: 'Specifications' },
          ]}
        />

        <header className="specs-page__header">
          <div>
            <h1 className="specs-page__title">Specifications</h1>
            <p className="specs-page__subtitle">
              Version history for {project?.name ?? 'this project'}
            </p>
          </div>
          <Button
            leftIcon={<Upload size={18} />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Spec
          </Button>
        </header>

        {error && (
          <Alert variant="danger" title="Error loading specifications">
            {error.message}
          </Alert>
        )}

        {isLoading ? (
          <div className="specs-page__loading">
            <Spinner size="lg" label="Loading specifications" />
          </div>
        ) : specList.length === 0 ? (
          <EmptyState
            title="No specifications yet"
            description="Upload your first specification to start tracking compliance."
            action={{
              label: 'Upload Specification',
              onClick: () => setIsUploadModalOpen(true),
            }}
            icon={<FileText size={48} />}
          />
        ) : (
          <div className="specs-page__list" role="list" aria-label="Specification versions">
            {specList.map((version) => (
              <SpecVersionCard key={version.id} version={version} projectId={projectId!} />
            ))}
          </div>
        )}

        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload Specification"
          size="lg"
        >
          <SpecUploadForm
            onSubmit={handleUpload}
            isLoading={uploadSpec.isPending}
            projectId={projectId!}
          />
          {uploadSpec.isError && (
            <Alert variant="danger" className="specs-page__upload-error">
              {uploadSpec.error.message}
            </Alert>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

function SpecVersionCard({ version }: { version: SpecVersion; projectId: string }) {
  return (
    <Card className="specs-page__version-card">
      <div className="specs-page__version-header">
        <div className="specs-page__version-info">
          <Tag variant="info" size="sm">v{version.version}</Tag>
          <span className="specs-page__version-date">
            <Clock size={14} aria-hidden="true" />
            {new Date(version.createdAt).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <span className="specs-page__version-hash">
          <Hash size={14} aria-hidden="true" />
          {version.specHash.substring(0, 12)}...
        </span>
      </div>
    </Card>
  );
}

export default SpecsPage;
