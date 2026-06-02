import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Alert } from './Alert';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';

describe('Alert Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with title and children', () => {
    render(<Alert title="Warning">Something happened</Alert>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('renders children without title', () => {
    render(<Alert>Info message</Alert>);
    expect(screen.getByText('Info message')).toBeInTheDocument();
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('applies correct variant class', () => {
    const variants = ['success', 'warning', 'danger', 'info'] as const;
    variants.forEach((variant) => {
      cleanup();
      render(<Alert variant={variant}>Message</Alert>);
      expect(screen.getByRole('alert')).toHaveClass(`alert-${variant}`);
    });
  });

  it('applies default info variant', () => {
    render(<Alert>Default</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('alert-info');
  });

  it('has role="alert" attribute', () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows close button when closable={true}', () => {
    render(<Alert closable>Closable alert</Alert>);
    expect(screen.getByRole('button', { name: /dismiss alert/i })).toBeInTheDocument();
  });

  it('does not show close button when closable={false}', () => {
    render(<Alert closable={false}>Not closable</Alert>);
    expect(screen.queryByRole('button', { name: /dismiss alert/i })).not.toBeInTheDocument();
  });

  it('does not show close button by default', () => {
    render(<Alert>Default</Alert>);
    expect(screen.queryByRole('button', { name: /dismiss alert/i })).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(<Alert closable onClose={handleClose}>Closable</Alert>);
    fireEvent.click(screen.getByRole('button', { name: /dismiss alert/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Alert className="custom-alert">Alert</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('custom-alert');
  });
});
