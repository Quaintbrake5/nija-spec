import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Button } from './Button';
import '@testing-library/jest-dom';
import { vi, describe, it, expect } from 'vitest';

describe('Button Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary', 'btn-md');
  });

  it('renders children text', () => {
    render(<Button>Submit Form</Button>);
    expect(screen.getByText('Submit Form')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
    variants.forEach(variant => {
      cleanup();
      render(<Button variant={variant}>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass(`btn-${variant}`);
    });
  });

  it('applies size classes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      cleanup();
      render(<Button size={size}>Button</Button>);
      expect(screen.getByRole('button')).toHaveClass(`btn-${size}`);
    });
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows spinner in loading state and disables button', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn-loading');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('⟳')).toBeInTheDocument();
  });

  it('applies fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-full-width');
  });

  it('fires click handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders leftIcon and rightIcon', () => {
    render(
      <Button leftIcon={<span>⬅️</span>} rightIcon={<span>➡️</span>}>
        Icons
      </Button>
    );
    expect(screen.getByText('⬅️')).toBeInTheDocument();
    expect(screen.getByText('➡️')).toBeInTheDocument();
    expect(screen.getByText('Icons')).toBeInTheDocument();
  });

  it('hides icons when loading', () => {
    render(
      <Button isLoading leftIcon={<span>⬅️</span>} rightIcon={<span>➡️</span>}>
        Loading
      </Button>
    );
    expect(screen.queryByText('⬅️')).not.toBeInTheDocument();
    expect(screen.queryByText('➡️')).not.toBeInTheDocument();
  });
});
