import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const fullWidthClasses = fullWidth ? 'btn-full-width' : '';
  const loadingClasses = isLoading ? 'btn-loading' : '';

  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    fullWidthClasses,
    loadingClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const isDisabled = disabled || isLoading;


  return (
    <button
      className={classes}
      disabled={isDisabled}
      aria-disabled={isDisabled ? 'true' : 'false'}
      aria-busy={isLoading ? 'true' : 'false'}
      {...props}
    >
      {isLoading && (
        <span className="btn-spinner" aria-hidden="true">
          ⟳
        </span>
      )}
      {leftIcon && !isLoading && <span className="btn-icon-left">{leftIcon}</span>}
      <span className="btn-content">{children}</span>
      {rightIcon && !isLoading && <span className="btn-icon-right">{rightIcon}</span>}
    </button>
  );
};

export default Button;
