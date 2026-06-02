import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';

describe('CodeBlock Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders code content', () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('renders code in a pre element', () => {
    const { container } = render(<CodeBlock code="hello" />);
    expect(container.querySelector('pre')).toBeInTheDocument();
    expect(container.querySelector('code')).toBeInTheDocument();
  });

  it('shows title when provided', () => {
    render(<CodeBlock code="test" title="example.ts" />);
    expect(screen.getByText('example.ts')).toBeInTheDocument();
  });

  it('does not show title when not provided', () => {
    render(<CodeBlock code="test" />);
    expect(screen.queryByText(/example/)).not.toBeInTheDocument();
  });

  it('shows language badge when title and language are provided', () => {
    render(<CodeBlock code="test" title="File" language="typescript" />);
    expect(screen.getByText('typescript')).toBeInTheDocument();
  });

  it('has copy button when copyable={true}', () => {
    render(<CodeBlock code="test" copyable />);
    expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument();
  });

  it('does not have copy button when copyable={false}', () => {
    render(<CodeBlock code="test" copyable={false} />);
    expect(screen.queryByRole('button', { name: /copy code/i })).not.toBeInTheDocument();
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    render(<CodeBlock code="console.log('hi')" copyable />);
    const copyButton = screen.getByRole('button', { name: /copy code/i });
    fireEvent.click(copyButton);
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("console.log('hi')");
    });
  });

  it('shows "Copied" text after copy button is clicked', async () => {
    render(<CodeBlock code="copied content" copyable />);
    const copyButton = screen.getByRole('button', { name: /copy code/i });
    fireEvent.click(copyButton);
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
    expect(copyButton).toHaveAttribute('aria-label', 'Copied to clipboard');
  });

  it('applies monospace font family via code-block-code class', () => {
    const { container } = render(<CodeBlock code="mono" />);
    const codeElement = container.querySelector('.code-block-code');
    expect(codeElement).toBeInTheDocument();
  });

  it('shows copy button without title when copyable', () => {
    render(<CodeBlock code="test" copyable />);
    expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument();
  });
});
