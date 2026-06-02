import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Input } from './Input';
import '@testing-library/jest-dom';
import { vi, describe, it, expect } from 'vitest';

describe('Input Component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with label', () => {
    render(<Input label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('displays error message and applies error class', () => {
    render(<Input label="Email" error="Invalid email address" />);
    const input = screen.getByLabelText('Email');
    const error = screen.getByText('Invalid email address');
    
    expect(input).toHaveClass('input-error');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(error).toBeInTheDocument();
    expect(error).toHaveAttribute('role', 'alert');
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('error'));
  });

  it('displays helper text when there is no error', () => {
    render(<Input label="Password" helperText="Must be 8 characters" />);
    const helper = screen.getByText('Must be 8 characters');
    expect(helper).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAttribute('aria-describedby', expect.stringContaining('helper'));
  });

  it('does not display helper text when there is an error', () => {
    render(<Input label="Password" helperText="Must be 8 characters" error="Too short" />);
    expect(screen.queryByText('Must be 8 characters')).not.toBeInTheDocument();
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('handles input change handler', () => {
    const handleChange = vi.fn();
    render(<Input label="Name" onChange={handleChange} />);
    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'John Doe' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state', () => {
    render(<Input label="Disabled" disabled />);
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
  });

  it('applies fullWidth class to wrapper and input', () => {
    render(<Input label="Full Width" fullWidth />);
    const input = screen.getByLabelText('Full Width');
    expect(input).toHaveClass('input-full-width');
    expect(input.closest('.input-wrapper')).toHaveClass('input-wrapper-full-width');
  });

  it('renders leftIcon and rightIcon', () => {
    render(
      <Input 
        label="Search" 
        leftIcon={<span>🔍</span>} 
        rightIcon={<span>✖️</span>} 
      />
    );
    expect(screen.getByText('🔍')).toBeInTheDocument();
    expect(screen.getByText('✖️')).toBeInTheDocument();
  });

  it('applies correct classes when icons are present', () => {
    const { rerender } = render(<Input label="Icon Test" leftIcon={<span>🔍</span>} />);
    expect(screen.getByLabelText('Icon Test')).toHaveClass('input-with-left-icon');
    
    rerender(<Input label="Icon Test" rightIcon={<span>✖️</span>} />);
    expect(screen.getByLabelText('Icon Test')).toHaveClass('input-with-right-icon');
    expect(screen.getByLabelText('Icon Test')).not.toHaveClass('input-with-left-icon');
  });
});
