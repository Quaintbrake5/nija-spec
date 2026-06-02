import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Tag } from '@/components/ui';
import type { RunResults, CheckResult } from '@/types';
import './RunResultsTable.css';

const SEVERITY_VARIANT: Record<CheckResult['severity'], 'danger' | 'warning' | 'info' | 'neutral'> = {
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'info',
  INFO: 'neutral',
};

const STATUS_VARIANT: Record<CheckResult['status'], 'success' | 'danger' | 'warning'> = {
  PASS: 'success',
  FAIL: 'danger',
  WARNING: 'warning',
};

const STATUS_ICON: Record<CheckResult['status'], React.ReactNode> = {
  PASS: <CheckCircle size={14} />,
  FAIL: <XCircle size={14} />,
  WARNING: <AlertTriangle size={14} />,
};

export interface RunResultsTableProps {
  results: RunResults | null;
  loading?: boolean;
}

export const RunResultsTable = ({ results, loading = false }: RunResultsTableProps) => {
  if (loading) {
    return (
      <div className="run-results-table" role="status" aria-live="polite">
        <div className="run-results-table__loading">
          <div className="run-results-table__spinner" aria-hidden="true" />
          <span className="run-results-table__loading-text">Loading results...</span>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="run-results-table">
        <div className="run-results-table__empty" role="status">
          No results available.
        </div>
      </div>
    );
  }

  return (
    <div className="run-results-table" role="region" aria-label="Run check results">
      <div className="run-results-table__summary">
        <span className="run-results-table__summary-stat run-results-table__summary-stat--passed" aria-label={`${results.summary.passed} passed`}>
          <span className="run-results-table__summary-icon" aria-hidden="true">
            <CheckCircle size={14} />
          </span>
          {results.summary.passed} passed
        </span>
        <span className="run-results-table__summary-stat run-results-table__summary-stat--failed" aria-label={`${results.summary.failed} failed`}>
          <span className="run-results-table__summary-icon" aria-hidden="true">
            <XCircle size={14} />
          </span>
          {results.summary.failed} failed
        </span>
        <span className="run-results-table__summary-stat run-results-table__summary-stat--warnings" aria-label={`${results.summary.warnings} warnings`}>
          <span className="run-results-table__summary-icon" aria-hidden="true">
            <AlertTriangle size={14} />
          </span>
          {results.summary.warnings} warnings
        </span>
      </div>

      {results.checks.length === 0 ? (
        <div className="run-results-table__empty" role="status">
          No check results to display.
        </div>
      ) : (
        <div className="run-results-table__table-wrapper">
          <table className="run-results-table__table">
            <thead className="run-results-table__thead">
              <tr>
                <th className="run-results-table__th" scope="col">Rule ID</th>
                <th className="run-results-table__th" scope="col">Framework</th>
                <th className="run-results-table__th" scope="col">Severity</th>
                <th className="run-results-table__th" scope="col">Status</th>
                <th className="run-results-table__th" scope="col">Message</th>
              </tr>
            </thead>
            <tbody>
              {results.checks.map((check) => (
                <tr key={check.id} className="run-results-table__tr">
                  <td className="run-results-table__td">
                    <span className="run-results-table__rule-id">{check.ruleId}</span>
                  </td>
                  <td className="run-results-table__td">
                    <span className="run-results-table__framework">{check.framework}</span>
                  </td>
                  <td className="run-results-table__td">
                    <Tag variant={SEVERITY_VARIANT[check.severity]} size="sm">
                      {check.severity}
                    </Tag>
                  </td>
                  <td className="run-results-table__td">
                    <Tag variant={STATUS_VARIANT[check.status]} size="sm">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {STATUS_ICON[check.status]}
                        {check.status}
                      </span>
                    </Tag>
                  </td>
                  <td className="run-results-table__td">
                    <span className="run-results-table__message">{check.message}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RunResultsTable;
