import type { ReactNode } from 'react';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import './Alert.css';

export interface AlertProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  children: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

const VARIANT_ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: AlertCircle,
  info: Info,
};

export const Alert = ({
  variant = 'info',
  title,
  children,
  closable = false,
  onClose,
  className = '',
}: AlertProps) => {
  const Icon = VARIANT_ICONS[variant];

  const classes = [
    'alert',
    `alert-${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="alert">
      <span className="alert-icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <div className="alert-body">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-content">{children}</div>
      </div>
      {closable && (
        <button
          type="button"
          className="alert-close"
          onClick={onClose}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
