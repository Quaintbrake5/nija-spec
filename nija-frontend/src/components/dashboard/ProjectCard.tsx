import { AlertTriangle, FileText } from 'lucide-react';
import { Tag } from '@/components/ui';
import type { ProjectWithMetadata, RunStatus } from '@/types';
import './ProjectCard.css';

const STATUS_VARIANT_MAP: Record<RunStatus, 'success' | 'danger' | 'warning' | 'info' | 'neutral'> = {
  QUEUED: 'neutral',
  RUNNING: 'info',
  SUCCEEDED: 'success',
  FAILED: 'danger',
  CANCELED: 'warning',
};

const STATUS_LABEL_MAP: Record<RunStatus, string> = {
  QUEUED: 'Queued',
  RUNNING: 'Running',
  SUCCEEDED: 'Passed',
  FAILED: 'Failed',
  CANCELED: 'Canceled',
};

export interface ProjectCardProps {
  project: ProjectWithMetadata;
  onClick?: (project: ProjectWithMetadata) => void;
}

export const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(project);
    }
  };

  return (
    <article
      className="project-card"
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(project)}
      onKeyDown={handleKeyDown}
      aria-label={`Project: ${project.name}`}
    >
      <div className="project-card__header">
        <h3 className="project-card__name">{project.name}</h3>
        {project.latestSpecVersion != null && (
          <span className="project-card__version" aria-label={`Spec version ${project.latestSpecVersion}`}>
            <FileText size={12} aria-hidden="true" /> v{project.latestSpecVersion}
          </span>
        )}
      </div>

      <div className="project-card__meta">
        {project.lastRunStatus && (
          <span className="project-card__status">
            <Tag variant={STATUS_VARIANT_MAP[project.lastRunStatus]} size="sm">
              {STATUS_LABEL_MAP[project.lastRunStatus]}
            </Tag>
          </span>
        )}

        <span
          className={`project-card__failures ${project.failingEndpointsCount > 0 ? 'project-card__failures--has-failures' : ''}`}
          aria-label={`${project.failingEndpointsCount} failing endpoints`}
        >
          {project.failingEndpointsCount > 0 && (
            <AlertTriangle size={14} aria-hidden="true" />
          )}
          {project.failingEndpointsCount} failing endpoint{project.failingEndpointsCount !== 1 ? 's' : ''}
        </span>
      </div>
    </article>
  );
};

export default ProjectCard;
