import { FolderOpen } from 'lucide-react';
import type { ProjectWithMetadata } from '@/types';
import { ProjectCard } from './ProjectCard';
import './ProjectList.css';

export interface ProjectListProps {
  projects: ProjectWithMetadata[];
  loading?: boolean;
  emptyMessage?: string;
  onProjectClick?: (project: ProjectWithMetadata) => void;
}

export const ProjectList = ({
  projects,
  loading = false,
  emptyMessage = 'No projects found. Create your first project to get started.',
  onProjectClick,
}: ProjectListProps) => {
  if (loading) {
    return (
      <div className="project-list" role="status" aria-live="polite">
        <div className="project-list__loading">
          <div className="project-list__spinner" aria-hidden="true" />
          <span className="project-list__loading-text">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="project-list" role="status">
        <div className="project-list__empty">
          <FolderOpen className="project-list__empty-icon" size={48} aria-hidden="true" />
          <h3 className="project-list__empty-title">No Projects</h3>
          <p className="project-list__empty-message">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="project-list">
      <div className="project-list__grid" role="list" aria-label="Projects">
        {projects.map((project) => (
          <div key={project.id} role="listitem">
            <ProjectCard project={project} onClick={onProjectClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
