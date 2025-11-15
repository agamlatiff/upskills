import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import * as useAuthHook from '../../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth');

describe('ProtectedRoute', () => {
  const mockUseAuth = useAuthHook.useAuth as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    // Should redirect to login
    expect(window.location.pathname).toBe('/signin');
  });

  it('shows loading state when checking authentication', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    render(
      <BrowserRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('checks role when requireRole prop is provided', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 1, name: 'Test User', email: 'test@example.com', roles: ['student'] },
    });

    render(
      <BrowserRouter>
        <ProtectedRoute requireRole="student">
          <div>Student Content</div>
        </ProtectedRoute>
      </BrowserRouter>
    );

    expect(screen.getByText('Student Content')).toBeInTheDocument();
  });
});

