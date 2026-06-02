import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';
import type { ProjectWithMetadata } from '@/types';

vi.mock('@/components/ui', () => ({
  Tag: ({ children, variant, size }: { children: React.ReactNode; variant?: string; size?: string }) => (
    <span className={`tag tag-${variant} tag-${size}`}>{children}</span>
  ),
}));

const mockProject: ProjectWithMetadata = {
  id: 'proj-1',
  organizationId: 'org-1',
  name: 'NaijaSpec API',
  slug: 'naijaspec-api',
  description: 'API specification project',
  createdAt: '2024-01-01T00:00:00Z',
  isDeleted: false,
  latestSpecVersion: 3,
  lastRunStatus: 'SUCCEEDED',
  failingEndpointsCount: 2,
};

describe('ProjectCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders project name', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('NaijaSpec API')).toBeInTheDocument();
  });

  it('shows latest spec version', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('v3')).toBeInTheDocument();
    expect(screen.getByLabelText('Spec version 3')).toBeInTheDocument();
  });

  it('does not show version when latestSpecVersion is null', () => {
    const project = { ...mockProject, latestSpecVersion: undefined };
    render(<ProjectCard project={project} />);
    expect(screen.queryByText(/v\d+/)).not.toBeInTheDocument();
  });

  it('shows run status badge', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Passed')).toBeInTheDocument();
  });

  it('does not show status badge when lastRunStatus is undefined', () => {
    const project = { ...mockProject, lastRunStatus: undefined };
    render(<ProjectCard project={project} />);
    expect(screen.queryByText('Passed')).not.toBeInTheDocument();
  });

  it('shows failing endpoints count', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('2 failing endpoints')).toBeInTheDocument();
    expect(screen.getByLabelText('2 failing endpoints')).toBeInTheDocument();
  });

  it('uses singular "endpoint" when count is 1', () => {
    const project = { ...mockProject, failingEndpointsCount: 1 };
    render(<ProjectCard project={project} />);
    expect(screen.getByText('1 failing endpoint')).toBeInTheDocument();
  });

  it('shows zero failing endpoints', () => {
    const project = { ...mockProject, failingEndpointsCount: 0 };
    render(<ProjectCard project={project} />);
    expect(screen.getByText('0 failing endpoints')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button', { name: /project: naijaspec api/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockProject);
  });

  it('does not throw when onClick is not provided', () => {
    render(<ProjectCard project={mockProject} />);
    const card = screen.getByRole('button', { name: /project: naijaspec api/i });
    expect(() => fireEvent.click(card)).not.toThrow();
  });

  it('has accessible aria-label', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByLabelText('Project: NaijaSpec API')).toBeInTheDocument();
  });

  it('has role="button" and tabIndex={0}', () => {
    render(<ProjectCard project={mockProject} />);
    const card = screen.getByRole('button', { name: /project: naijaspec api/i });
    expect(card).toHaveAttribute('tabindex', '0');
  });
});
