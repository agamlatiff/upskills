import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import InputError from '../../components/ui/InputError';

describe('InputError', () => {
  it('renders error message when provided', () => {
    render(<InputError messages="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders multiple error messages', () => {
    render(<InputError messages={['Error 1', 'Error 2']} />);
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Error 2')).toBeInTheDocument();
  });

  it('does not render when messages is not provided', () => {
    const { container } = render(<InputError />);
    expect(container.firstChild).toBeNull();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <InputError messages="Error" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

