import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import './EmptyState.css';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        {icon || <Inbox size={48} />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && (
        <p className="empty-state-description">{description}</p>
      )}
      {action && (
        <button
          type="button"
          className="empty-state-action"
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
