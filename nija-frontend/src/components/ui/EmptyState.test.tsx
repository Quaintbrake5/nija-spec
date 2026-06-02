import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { EmptyState } from './EmptyState';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';

describe('EmptyState Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders title', () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <EmptyState title="No projects" description="Create your first project to get started." />
    );
    expect(screen.getByText('No projects')).toBeInTheDocument();
    expect(screen.getByText('Create your first project to get started.')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });

  it('shows action button when action is provided', () => {
    render(
      <EmptyState
        title="No specs"
        action={{ label: 'Upload Spec', onClick: vi.fn() }}
      />
    );
    expect(screen.getByRole('button', { name: /upload spec/i })).toBeInTheDocument();
  });

  it('does not show action button when action is not provided', () => {
    render(<EmptyState title="Nothing here" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls action.onClick when button is clicked', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="Empty"
        action={{ label: 'Get Started', onClick: handleAction }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /get started/i }));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders custom icon when provided', () => {
    render(
      <EmptyState
        title="Custom icon"
        icon={<span data-testid="custom-icon">Star</span>}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders default icon when no icon is provided', () => {
    const { container } = render(<EmptyState title="Default icon" />);
    expect(container.querySelector('.empty-state-icon')).toBeInTheDocument();
  });
});
