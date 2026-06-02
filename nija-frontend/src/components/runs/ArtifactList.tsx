import { Download } from 'lucide-react';
import { Tag } from '@/components/ui';
import type { Artifact, ArtifactKind } from '@/types';
import './ArtifactList.css';

const KIND_VARIANT_MAP: Record<ArtifactKind, 'info' | 'success' | 'danger' | 'warning' | 'neutral'> = {
  RUN_MANIFEST: 'neutral',
  GENERATED_TESTS: 'success',
  FAILURE_LOG: 'danger',
  PATCH_DIFF: 'warning',
  COMPLIANCE_REPORT: 'info',
};

const KIND_LABEL_MAP: Record<ArtifactKind, string> = {
  RUN_MANIFEST: 'Manifest',
  GENERATED_TESTS: 'Tests',
  FAILURE_LOG: 'Failure Log',
  PATCH_DIFF: 'Patch Diff',
  COMPLIANCE_REPORT: 'Report',
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = parseFloat((bytes / Math.pow(1024, i)).toFixed(1));
  return `${size} ${units[i]}`;
}

export interface ArtifactListProps {
  artifacts: Artifact[];
  onDownload?: (artifactId: string) => void;
}

export const ArtifactList = ({ artifacts, onDownload }: ArtifactListProps) => {
  if (artifacts.length === 0) {
    return (
      <div className="artifact-list">
        <h4 className="artifact-list__title">Artifacts</h4>
        <div className="artifact-list__empty" role="status">
          No artifacts available for this run.
        </div>
      </div>
    );
  }

  return (
    <div className="artifact-list" role="region" aria-label="Run artifacts">
      <h4 className="artifact-list__title">Artifacts ({artifacts.length})</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        {artifacts.map((artifact) => (
          <li key={artifact.id} className="artifact-list__item">
            <div className="artifact-list__item-info">
              <div className="artifact-list__item-header">
                <Tag variant={KIND_VARIANT_MAP[artifact.kind]} size="sm">
                  {KIND_LABEL_MAP[artifact.kind]}
                </Tag>
                <span className="artifact-list__item-size">
                  {formatBytes(artifact.byteSize)}
                </span>
              </div>
              <span className="artifact-list__item-hash" title={artifact.sha256}>
                SHA256: {artifact.sha256.substring(0, 16)}...
              </span>
            </div>
            {onDownload && (
              <button
                className="artifact-list__item-download"
                onClick={() => onDownload(artifact.id)}
                aria-label={`Download ${KIND_LABEL_MAP[artifact.kind]} artifact`}
                type="button"
              >
                <Download size={14} aria-hidden="true" />
                Download
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArtifactList;
