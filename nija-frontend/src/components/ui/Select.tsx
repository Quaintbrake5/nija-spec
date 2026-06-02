import { useState, useRef, useEffect, useCallback, useId } from 'react';
import type { KeyboardEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  id?: string;
}

export const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  fullWidth = false,
  id,
}: SelectProps) => {
  const selectId = id || useId();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = !error && helperText ? `${selectId}-helper` : undefined;
  const describedBy = errorId ?? helperId;

  const selectedOption = options.find((opt) => opt.value === value);

  const focusableOptions = options.filter((opt) => !opt.disabled);

  const close = useCallback(() => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const item = listboxRef.current.children[highlightedIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, highlightedIndex]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          const idx = focusableOptions.findIndex((opt) => opt.value === value);
          setHighlightedIndex(idx >= 0 ? idx : 0);
        } else if (highlightedIndex >= 0) {
          const selected = focusableOptions[highlightedIndex];
          if (selected) {
            onChange?.(selected.value);
          }
          close();
        }
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(0);
        } else {
          setHighlightedIndex((prev) =>
            prev < focusableOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      }
      case 'Escape': {
        e.preventDefault();
        close();
        break;
      }
      case 'Home': {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;
      }
      case 'End': {
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(focusableOptions.length - 1);
        }
        break;
      }
      default:
        break;
    }
  };

  const handleOptionClick = (option: SelectOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    close();
  };

  const containerClasses = [
    'select',
    error ? 'select-error' : '',
    fullWidth ? 'select-full-width' : '',
    disabled ? 'select-disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`select-wrapper ${fullWidth ? 'select-wrapper-full-width' : ''}`}>
      {label && (
        <label id={`${selectId}-label`} className="select-label">
          {label}
        </label>
      )}
      <div ref={containerRef} className={containerClasses}>
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${selectId}-label` : undefined}
          aria-describedby={describedBy}
          aria-invalid={error ? 'true' : 'false'}
          className="select-trigger"
          onClick={() => {
            if (!disabled) {
              setIsOpen((prev) => !prev);
              if (!isOpen) {
                const idx = focusableOptions.findIndex((opt) => opt.value === value);
                setHighlightedIndex(idx >= 0 ? idx : 0);
              }
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        >
          <span className="select-value">
            {selectedOption ? selectedOption.label : (
              <span className="select-placeholder">{placeholder}</span>
            )}
          </span>
          <span className="select-chevron" aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </button>
        {isOpen && (
          <div
            ref={listboxRef}
            role="listbox"
            aria-labelledby={label ? `${selectId}-label` : undefined}
            className="select-dropdown"
          >
            {options.map((option) => {
              const optionIndex = focusableOptions.indexOf(option);
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  className={`select-option${option.value === value ? ' select-option--selected' : ''}${optionIndex === highlightedIndex ? ' select-option--highlighted' : ''}${option.disabled ? ' select-option--disabled' : ''}`}
                  onClick={() => handleOptionClick(option)}
                  onMouseEnter={() => !option.disabled && setHighlightedIndex(optionIndex)}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {error && (
        <span id={`${selectId}-error`} className="select-error-text" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && (
        <span id={`${selectId}-helper`} className="select-helper-text">
          {helperText}
        </span>
      )}
    </div>
  );
};

export default Select;
