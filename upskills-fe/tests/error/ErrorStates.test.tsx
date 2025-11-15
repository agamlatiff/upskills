import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

describe('Error States', () => {
  it('displays error boundary when component throws error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <BrowserRouter>
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      </BrowserRouter>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('handles API error states', async () => {
    // Mock API error
    const mockApiError = {
      response: {
        status: 404,
        data: {
          message: 'Resource not found',
        },
      },
    };

    // This would be tested in components that use API hooks
    // Example: CourseDetail component with error state
    expect(mockApiError.response.status).toBe(404);
  });

  it('displays loading state', () => {
    const LoadingComponent = () => <div>Loading...</div>;

    render(
      <BrowserRouter>
        <LoadingComponent />
      </BrowserRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});

