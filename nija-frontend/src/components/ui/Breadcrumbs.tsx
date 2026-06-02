import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import './Breadcrumbs.css';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="breadcrumbs-item">
              {index > 0 && (
                <span className="breadcrumbs-separator" aria-hidden="true">
                  <ChevronRight size={14} />
                </span>
              )}
              {isLast ? (
                <span className="breadcrumbs-current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="breadcrumbs-link"
                  onClick={item.onClick}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  type="button"
                  className="breadcrumbs-link breadcrumbs-button"
                  onClick={item.onClick}
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
