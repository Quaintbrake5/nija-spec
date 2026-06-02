import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { RunStatusBadge } from './RunStatusBadge';
import '@testing-library/jest-dom';
import { describe, it, expect, afterEach } from 'vitest';
import type { RunStatus } from '@/types';

describe('RunStatusBadge Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders correct text for QUEUED status', () => {
    render(<RunStatusBadge status="QUEUED" />);
    expect(screen.getByText('Queued')).toBeInTheDocument();
  });

  it('renders correct text for RUNNING status', () => {
    render(<RunStatusBadge status="RUNNING" />);
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('renders correct text for SUCCEEDED status', () => {
    render(<RunStatusBadge status="SUCCEEDED" />);
    expect(screen.getByText('Succeeded')).toBeInTheDocument();
  });

  it('renders correct text for FAILED status', () => {
    render(<RunStatusBadge status="FAILED" />);
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });

  it('renders correct text for CANCELED status', () => {
    render(<RunStatusBadge status="CANCELED" />);
    expect(screen.getByText('Canceled')).toBeInTheDocument();
  });

  it('applies neutral variant for QUEUED', () => {
    render(<RunStatusBadge status="QUEUED" />);
    expect(screen.getByText('Queued').closest('.run-status-badge')).toHaveClass('run-status-badge--neutral');
  });

  it('applies info variant for RUNNING', () => {
    render(<RunStatusBadge status="RUNNING" />);
    expect(screen.getByText('Running').closest('.run-status-badge')).toHaveClass('run-status-badge--info');
  });

  it('applies success variant for SUCCEEDED', () => {
    render(<RunStatusBadge status="SUCCEEDED" />);
    expect(screen.getByText('Succeeded').closest('.run-status-badge')).toHaveClass('run-status-badge--success');
  });

  it('applies danger variant for FAILED', () => {
    render(<RunStatusBadge status="FAILED" />);
    expect(screen.getByText('Failed').closest('.run-status-badge')).toHaveClass('run-status-badge--danger');
  });

  it('applies warning variant for CANCELED', () => {
    render(<RunStatusBadge status="CANCELED" />);
    expect(screen.getByText('Canceled').closest('.run-status-badge')).toHaveClass('run-status-badge--warning');
  });

  it('shows pulse animation class for RUNNING status', () => {
    render(<RunStatusBadge status="RUNNING" />);
    expect(screen.getByText('Running').closest('.run-status-badge')).toHaveClass('run-status-badge--running');
  });

  it('does not show pulse animation class for non-RUNNING statuses', () => {
    const nonRunningStatuses: RunStatus[] = ['QUEUED', 'SUCCEEDED', 'FAILED', 'CANCELED'];
    nonRunningStatuses.forEach((status) => {
      cleanup();
      render(<RunStatusBadge status={status} />);
      expect(screen.getByRole('status')).not.toHaveClass('run-status-badge--running');
    });
  });

  it('has role="status" attribute', () => {
    render(<RunStatusBadge status="QUEUED" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    render(<RunStatusBadge status="FAILED" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Status: Failed');
  });

  it('applies correct size class', () => {
    render(<RunStatusBadge status="QUEUED" size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('run-status-badge--sm');

    cleanup();
    render(<RunStatusBadge status="QUEUED" size="md" />);
    expect(screen.getByRole('status')).toHaveClass('run-status-badge--md');
  });

  it('applies default md size', () => {
    render(<RunStatusBadge status="QUEUED" />);
    expect(screen.getByRole('status')).toHaveClass('run-status-badge--md');
  });
});
