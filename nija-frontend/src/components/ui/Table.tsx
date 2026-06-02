import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { Spinner } from './Spinner';
import './Table.css';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T, index: number) => ReactNode;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | undefined;
  onSort?: () => void;
}

export interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  const handleKeyDown = (e: React.KeyboardEvent, onSort?: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSort?.();
    }
  };

  return (
    <div className="table-wrapper">
      <table className="table" aria-busy={loading ? 'true' : 'false'}>
        <thead className="table-head">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`table-header${col.sortable ? ' table-header--sortable' : ''}`}
                scope="col"
                aria-sort={
                  col.sortable
                    ? col.sortDirection === 'asc'
                      ? 'ascending'
                      : col.sortDirection === 'desc'
                        ? 'descending'
                        : 'none'
                    : undefined
                }
                onClick={col.sortable ? col.onSort : undefined}
                onKeyDown={col.sortable ? (e) => handleKeyDown(e, col.onSort) : undefined}
                tabIndex={col.sortable ? 0 : undefined}
              >
                <span className="table-header-content">
                  {col.label}
                  {col.sortable && (
                    <span className="table-sort-indicator" aria-hidden="true">
                      {col.sortDirection === 'asc' && ' ↑'}
                      {col.sortDirection === 'desc' && ' ↓'}
                      {!col.sortDirection && ' ↕'}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-body">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="table-loading">
                <Spinner size="md" label="Loading data" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">
                <Inbox size={32} aria-hidden="true" />
                <span>{emptyMessage}</span>
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                {columns.map((col) => (
                  <td key={col.key} className="table-cell">
                    {col.render
                      ? col.render(row, rowIndex)
                      : (row[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
