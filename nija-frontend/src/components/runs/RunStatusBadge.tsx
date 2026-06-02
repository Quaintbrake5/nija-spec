import { Clock, Loader2, CheckCircle, XCircle, Ban } from 'lucide-react';
import type { RunStatus } from '@/types';
import './RunStatusBadge.css';

const STATUS_CONFIG: Record<
  RunStatus,
  { variant: string; icon: React.ReactNode; label: string }
> = {
  QUEUED: {
    variant: 'neutral',
    icon: <Clock size={12} />,
    label: 'Queued',
  },
  RUNNING: {
    variant: 'info',
    icon: <Loader2 size={12} />,
    label: 'Running',
  },
  SUCCEEDED: {
    variant: 'success',
    icon: <CheckCircle size={12} />,
    label: 'Succeeded',
  },
  FAILED: {
    variant: 'danger',
    icon: <XCircle size={12} />,
    label: 'Failed',
  },
  CANCELED: {
    variant: 'warning',
    icon: <Ban size={12} />,
    label: 'Canceled',
  },
};

export interface RunStatusBadgeProps {
  status: RunStatus;
  size?: 'sm' | 'md';
}

export const RunStatusBadge = ({ status, size = 'md' }: RunStatusBadgeProps) => {
  const config = STATUS_CONFIG[status];

  const classes = [
    'run-status-badge',
    `run-status-badge--${config.variant}`,
    `run-status-badge--${size}`,
    status === 'RUNNING' ? 'run-status-badge--running' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      <span className="run-status-badge__icon" aria-hidden="true">
        {config.icon}
      </span>
      {config.label}
    </span>
  );
};

export default RunStatusBadge;
