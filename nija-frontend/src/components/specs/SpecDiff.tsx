import { Plus, Minus } from 'lucide-react';
import './SpecDiff.css';

interface DiffChange {
  type: 'add' | 'delete' | 'unchanged';
  content: string;
  lineNumber: number;
}

export interface SpecDiffProps {
  additions: number;
  deletions: number;
  changes: DiffChange[];
}

const LINE_INDICATOR: Record<DiffChange['type'], string> = {
  add: '+',
  delete: '−',
  unchanged: ' ',
};

export const SpecDiff = ({ additions, deletions, changes }: SpecDiffProps) => {
  return (
    <div className="spec-diff" role="region" aria-label="Specification diff">
      <div className="spec-diff__header">
        <span className="spec-diff__stat spec-diff__stat--additions" aria-label={`${additions} additions`}>
          <span className="spec-diff__stat-icon" aria-hidden="true">
            <Plus size={14} />
          </span>
          {additions} added
        </span>
        <span className="spec-diff__stat spec-diff__stat--deletions" aria-label={`${deletions} deletions`}>
          <span className="spec-diff__stat-icon" aria-hidden="true">
            <Minus size={14} />
          </span>
          {deletions} deleted
        </span>
      </div>

      {changes.length === 0 ? (
        <div className="spec-diff__empty" role="status">
          No differences to display.
        </div>
      ) : (
        <div className="spec-diff__container" role="table" aria-label="Diff lines">
          {changes.map((change, index) => (
            <div
              key={`${change.lineNumber}-${index}`}
              className={`spec-diff__line spec-diff__line--${change.type}`}
              role="row"
            >
              <span className="spec-diff__line-number" role="cell" aria-label={`Line ${change.lineNumber}`}>
                {change.lineNumber}
              </span>
              <span className="spec-diff__line-indicator" role="cell" aria-hidden="true">
                {LINE_INDICATOR[change.type]}
              </span>
              <span className="spec-diff__line-content" role="cell">
                {change.content}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecDiff;
