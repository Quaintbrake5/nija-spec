import type { ReactNode, HTMLAttributes } from 'react';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = ({
  children,
  className = '',
  onClick,
  padding = 'md',
  ...props
}: CardProps) => {
  const classes = [
    'card',
    `card-${padding}`,
    onClick ? 'card-clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        onClick={onClick}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
