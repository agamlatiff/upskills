import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';
import * as useAuthHook from '../../hooks/useAuth';

// Mock the useAuth hook
vi.mock('../../hooks/useAuth');

describe('Authentication Integration', () => {
  const mockUseAuth = useAuthHook.useAuth as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('redirects to login when not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      checkAuth: vi.fn(),
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Should show login page or redirect
    await waitFor(() => {
      expect(window.location.pathname).toBe('/signin');
    });
  });

  it('shows dashboard when authenticated', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 1, name: 'Test User', email: 'test@example.com', roles: ['student'] },
      checkAuth: vi.fn(),
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Should redirect to dashboard or show authenticated content
    await waitFor(() => {
      expect(window.location.pathname).not.toBe('/signin');
    });
  });
});

