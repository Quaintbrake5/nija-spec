import { Cpu, Coins, Calendar } from 'lucide-react';
import type { RunWithMetadata } from '@/types';
import { RunStatusBadge } from './RunStatusBadge';
import './RunCard.css';

export interface RunCardProps {
  run: RunWithMetadata;
  onClick?: (run: RunWithMetadata) => void;
}

export const RunCard = ({ run, onClick }: RunCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(run);
    }
  };

  return (
    <article
      className="run-card"
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(run)}
      onKeyDown={handleKeyDown}
      aria-label={`Run: ${run.modelIdentifier}, status ${run.status}`}
    >
      <div className="run-card__header">
        <RunStatusBadge status={run.status} size="sm" />
        <span className="run-card__date">
          {new Date(run.createdAt).toLocaleDateString('en-NG', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <span className="run-card__provider">
        {run.providerId}/{run.modelIdentifier}
      </span>

      <div className="run-card__details">
        <span className="run-card__detail" aria-label={`${run.tokenTotal} tokens used`}>
          <span className="run-card__detail-icon" aria-hidden="true">
            <Cpu size={14} />
          </span>
          {run.tokenTotal.toLocaleString()} tokens
        </span>
        <span className="run-card__detail" aria-label={`Estimated cost ${run.estimatedCostNaira} Naira`}>
          <span className="run-card__detail-icon" aria-hidden="true">
            <Coins size={14} />
          </span>
          ₦{run.estimatedCostNaira.toFixed(2)}
        </span>
      </div>

      <div className="run-card__footer">
        <span className="run-card__detail">
          <span className="run-card__detail-icon" aria-hidden="true">
            <Calendar size={14} />
          </span>
          Spec v{run.specVersion}
        </span>
        <span className="run-card__detail" aria-label={`${run.passedChecks} passed, ${run.failedChecks} failed`}>
          {run.passedChecks} / {run.totalChecks} passed
        </span>
      </div>
    </article>
  );
};

export default RunCard;
