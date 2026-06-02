import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';

describe('Breadcrumbs Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders all breadcrumb items', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Projects', href: '/projects' },
          { label: 'My Project' },
        ]}
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('My Project')).toBeInTheDocument();
  });

  it('has aria-label="Breadcrumb" on nav element', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Current' },
        ]}
      />
    );

    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });

  it('renders first item as a link when href is provided', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Current' },
        ]}
      />
    );

    const link = screen.getByRole('link', { name: /home/i });
    expect(link).toHaveAttribute('href', '/');
    expect(link.tagName).toBe('A');
  });

  it('renders last item as a span (not a link)', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Current Page' },
        ]}
      />
    );

    const current = screen.getByText('Current Page');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current.tagName).toBe('SPAN');
  });

  it('renders non-last item without href as a button', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'Dropdown', onClick: vi.fn() },
          { label: 'Current' },
        ]}
      />
    );

    const button = screen.getByRole('button', { name: /dropdown/i });
    expect(button.tagName).toBe('BUTTON');
  });

  it('calls onClick for breadcrumb button items', () => {
    const handleClick = vi.fn();
    render(
      <Breadcrumbs
        items={[
          { label: 'Menu', onClick: handleClick },
          { label: 'Current' },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders separators between items', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'A', href: '/a' },
          { label: 'B', href: '/b' },
          { label: 'C' },
        ]}
      />
    );

    const separators = container.querySelectorAll('.breadcrumbs-separator');
    expect(separators.length).toBe(2);
  });

  it('does not render separator before first item', () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: 'First', href: '/' },
          { label: 'Second' },
        ]}
      />
    );

    const firstItem = container.querySelector('.breadcrumbs-item');
    expect(firstItem?.querySelector('.breadcrumbs-separator')).not.toBeInTheDocument();
  });
});
