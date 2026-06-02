import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Modal } from './Modal';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';

describe('Modal Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('does not render when isOpen={false}', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with title and children when isOpen={true}', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        <p>Modal body</p>
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal body')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
  });

  it('renders without title', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>No title modal</p>
      </Modal>
    );
    expect(screen.getByText('No title modal')).toBeInTheDocument();
    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Backdrop Close">
        <p>Content</p>
      </Modal>
    );

    const overlay = document.querySelector('.modal-overlay');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Content Click">
        <p>Click here</p>
      </Modal>
    );

    fireEvent.click(screen.getByText('Click here'));
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Escape Close">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for non-escape keys', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Key Test">
        <p>Content</p>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Enter' });
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders in a portal (document.body)', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Portal Test">
        <p>Portal content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog.parentElement?.parentElement).toBe(document.body);
  });

  it('has correct aria attributes', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Accessible Modal">
        <p>Content</p>
      </Modal>
    );

    const dialog = screen.getByRole('dialog', { hidden: true });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('has close button in header', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="With Close">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole('button', { name: /close dialog/i, hidden: true })).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Close Button">
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByRole('button', { name: /close dialog/i, hidden: true }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('sets body overflow to hidden when open', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <p>Content</p>
      </Modal>
    );
    expect(document.body.style.overflow).toBe('hidden');
  });
});
