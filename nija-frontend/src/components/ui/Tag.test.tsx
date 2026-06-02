import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Tag } from './Tag';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';

describe('Tag Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with correct text', () => {
    render(<Tag>Active</Tag>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    const variants = ['success', 'warning', 'danger', 'info', 'neutral'] as const;
    variants.forEach((variant) => {
      cleanup();
      render(<Tag variant={variant}>Tag</Tag>);
      expect(screen.getByText('Tag').closest('.tag')).toHaveClass(`tag-${variant}`);
    });
  });

  it('applies correct size class', () => {
    render(<Tag size="sm">Small</Tag>);
    expect(screen.getByText('Small').closest('.tag')).toHaveClass('tag-sm');

    cleanup();
    render(<Tag size="md">Medium</Tag>);
    expect(screen.getByText('Medium').closest('.tag')).toHaveClass('tag-md');
  });

  it('applies default neutral variant and md size', () => {
    render(<Tag>Default</Tag>);
    const tag = screen.getByText('Default').closest('.tag');
    expect(tag).toHaveClass('tag-neutral', 'tag-md');
  });

  it('shows remove button when removable={true}', () => {
    render(<Tag removable>Removable</Tag>);
    expect(screen.getByRole('button', { name: /remove removable/i })).toBeInTheDocument();
  });

  it('does not show remove button when removable={false}', () => {
    render(<Tag removable={false}>Not Removable</Tag>);
    expect(screen.queryByRole('button', { name: /remove not removable/i })).not.toBeInTheDocument();
  });

  it('does not show remove button by default', () => {
    render(<Tag>Default</Tag>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', () => {
    const handleRemove = vi.fn();
    render(<Tag removable onRemove={handleRemove}>Closable</Tag>);
    fireEvent.click(screen.getByRole('button', { name: /remove closable/i }));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Tag className="custom-class">Tag</Tag>);
    expect(screen.getByText('Tag').closest('.tag')).toHaveClass('custom-class');
  });
});
