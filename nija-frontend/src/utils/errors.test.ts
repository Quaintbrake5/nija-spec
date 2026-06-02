import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('returns message from Error instance', () => {
    const error = new Error('Something went wrong');
    expect(getErrorMessage(error)).toBe('Something went wrong');
  });

  it('returns the string if error is a string', () => {
    expect(getErrorMessage('Custom error message')).toBe('Custom error message');
  });

  it('returns message property from unknown object', () => {
    expect(getErrorMessage({ message: 'Object error' })).toBe('Object error');
  });

  it('returns default message for null', () => {
    expect(getErrorMessage(null)).toBe('An unexpected error occurred');
  });

  it('returns default message for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred');
  });

  it('returns default message for object without message property', () => {
    expect(getErrorMessage({ foo: 'bar' })).toBe('An unexpected error occurred');
  });

  it('returns default message for numbers', () => {
    expect(getErrorMessage(123)).toBe('An unexpected error occurred');
  });
});
