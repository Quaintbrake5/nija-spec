import './Spinner.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const Spinner = ({
  size = 'md',
  label,
  className = '',
}: SpinnerProps) => {
  const classes = [
    'spinner',
    `spinner-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      role="status"
      aria-label={label || 'Loading'}
    >
      <svg
        className="spinner-svg"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className="spinner-track"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="3"
        />
        <circle
          className="spinner-indicator"
          cx="12"
          cy="12"
          r="10"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="9.425"
        />
      </svg>
      {label && <span className="spinner-sr-only">{label}</span>}
    </div>
  );
};

export default Spinner;
