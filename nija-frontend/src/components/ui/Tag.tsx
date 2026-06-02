import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import './Tag.css';

export interface TagProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const Tag = ({
  variant = 'neutral',
  size = 'md',
  children,
  removable = false,
  onRemove,
  className = '',
}: TagProps) => {
  const classes = [
    'tag',
    `tag-${variant}`,
    `tag-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      <span className="tag-content">{children}</span>
      {removable && (
        <button
          type="button"
          className="tag-remove"
          onClick={onRemove}
          aria-label={`Remove ${children}`}
        >
          <X size={size === 'sm' ? 12 : 14} />
        </button>
      )}
    </span>
  );
};

export default Tag;
