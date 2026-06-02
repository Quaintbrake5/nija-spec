import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { Spinner } from './Spinner';
import '@testing-library/jest-dom';
import { describe, it, expect, afterEach } from 'vitest';

describe('Spinner Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with role="status" attribute', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default accessible label "Loading"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('applies custom label as accessible name', () => {
    render(<Spinner label="Saving changes" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving changes');
  });

  it('shows sr-only label text when label is provided', () => {
    render(<Spinner label="Fetching data" />);
    expect(screen.getByText('Fetching data')).toBeInTheDocument();
    expect(screen.getByText('Fetching data').className).toContain('spinner-sr-only');
  });

  it('does not render sr-only text when no label', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.spinner-sr-only')).not.toBeInTheDocument();
  });

  it('applies correct size class', () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-sm');

    cleanup();
    render(<Spinner size="md" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-md');

    cleanup();
    render(<Spinner size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-lg');
  });

  it('applies default md size', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveClass('spinner-md');
  });

  it('applies custom className', () => {
    render(<Spinner className="custom-spinner" />);
    expect(screen.getByRole('status')).toHaveClass('custom-spinner');
  });

  it('renders SVG element', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('has aria-hidden on SVG', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
