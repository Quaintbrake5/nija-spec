import { useState } from 'react';
import { FileText, Hash, Clock, Globe, Code } from 'lucide-react';
import { CodeBlock } from '@/components/ui';
import type { Specification } from '@/types';
import './SpecViewer.css';

export interface SpecViewerProps {
  spec: Specification | null;
  loading?: boolean;
}

const SOURCE_LABELS: Record<Specification['source'], string> = {
  cli: 'CLI',
  web: 'Web',
  api: 'API',
};

export const SpecViewer = ({ spec, loading = false }: SpecViewerProps) => {
  const [showRaw, setShowRaw] = useState(false);

  if (loading) {
    return (
      <div className="spec-viewer" role="status" aria-live="polite">
        <div className="spec-viewer__loading">
          <div className="spec-viewer__spinner" aria-hidden="true" />
          <span className="spec-viewer__loading-text">Loading specification...</span>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="spec-viewer" role="status">
        <div className="spec-viewer__empty">
          <FileText className="spec-viewer__empty-icon" size={48} aria-hidden="true" />
          <h3 className="spec-viewer__empty-title">No Specification</h3>
          <p className="spec-viewer__empty-message">
            Upload a specification to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="spec-viewer">
      <div className="spec-viewer__metadata" aria-label="Specification metadata">
        <span className="spec-viewer__meta-item">
          <FileText size={14} aria-hidden="true" />
          <span className="spec-viewer__meta-label">Version</span>
          <span className="spec-viewer__meta-value">v{spec.version}</span>
        </span>
        <span className="spec-viewer__meta-divider" aria-hidden="true" />
        <span className="spec-viewer__meta-item">
          <Hash size={14} aria-hidden="true" />
          <span className="spec-viewer__meta-label">Hash</span>
          <span className="spec-viewer__meta-value" title={spec.specHash}>
            {spec.specHash.substring(0, 12)}...
          </span>
        </span>
        <span className="spec-viewer__meta-divider" aria-hidden="true" />
        <span className="spec-viewer__meta-item">
          <Globe size={14} aria-hidden="true" />
          <span className="spec-viewer__meta-label">Source</span>
          <span className="spec-viewer__meta-value">{SOURCE_LABELS[spec.source]}</span>
        </span>
        <span className="spec-viewer__meta-divider" aria-hidden="true" />
        <span className="spec-viewer__meta-item">
          <Clock size={14} aria-hidden="true" />
          <span className="spec-viewer__meta-label">Created</span>
          <span className="spec-viewer__meta-value">
            {new Date(spec.createdAt).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </span>
      </div>

      <div className="spec-viewer__raw-toggle">
        <button
          onClick={() => setShowRaw(!showRaw)}
          aria-pressed={showRaw}
          type="button"
        >
          <Code size={14} aria-hidden="true" style={{ marginRight: '4px', verticalAlign: 'middle' }} />
          {showRaw ? 'Rendered' : 'Raw'}
        </button>
      </div>

      <div className="spec-viewer__content" role="document" aria-label={`Specification v${spec.version}`}>
        {showRaw ? (
          <CodeBlock code={spec.contentMarkdown} language="markdown" />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(spec.contentMarkdown) }} />
        )}
      </div>
    </div>
  );
};

function renderMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br />');
}

export default SpecViewer;
