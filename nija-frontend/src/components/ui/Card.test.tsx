import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Card } from './Card';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, afterEach } from 'vitest';

describe('Card Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders as div when no onClick is provided', () => {
    const { container } = render(<Card>Static card</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.tagName).toBe('DIV');
  });

  it('renders as button when onClick is provided', () => {
    render(<Card onClick={vi.fn()}>Clickable card</Card>);
    const card = screen.getByRole('button', { name: /clickable card/i });
    expect(card.tagName).toBe('BUTTON');
    expect(card).toHaveAttribute('type', 'button');
  });

  it('applies padding class based on size prop', () => {
    const { container: smContainer } = render(<Card padding="sm">Small padding</Card>);
    expect(smContainer.firstChild).toHaveClass('card-sm');

    cleanup();
    const { container: mdContainer } = render(<Card padding="md">Medium padding</Card>);
    expect(mdContainer.firstChild).toHaveClass('card-md');

    cleanup();
    const { container: lgContainer } = render(<Card padding="lg">Large padding</Card>);
    expect(lgContainer.firstChild).toHaveClass('card-lg');
  });

  it('applies default md padding', () => {
    const { container } = render(<Card>Default padding</Card>);
    expect(container.firstChild).toHaveClass('card-md');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Card onClick={handleClick}>Click me</Card>);
    fireEvent.click(screen.getByRole('button', { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies card-clickable class when onClick is provided', () => {
    render(<Card onClick={vi.fn()}>Clickable</Card>);
    expect(screen.getByRole('button')).toHaveClass('card-clickable');
  });

  it('does not apply card-clickable class when no onClick', () => {
    const { container } = render(<Card>Not clickable</Card>);
    expect(container.firstChild).not.toHaveClass('card-clickable');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Styled</Card>);
    expect(container.firstChild).toHaveClass('custom-card');
  });
});
