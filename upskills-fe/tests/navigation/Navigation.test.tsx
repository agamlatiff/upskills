import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import App from '../../App';

vi.mock('../../hooks/useAuth');

describe('Navigation', () => {
  it('navigates to signin when accessing protected route unauthenticated', () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      checkAuth: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    // Should redirect to signin
    expect(window.location.pathname).toBe('/signin');
  });

  it('allows navigation to public routes without authentication', async () => {
    (useAuth as any).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      checkAuth: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/pricing']}>
        <App />
      </MemoryRouter>
    );

    // Should show pricing page (may need to wait for lazy load)
    await waitFor(() => {
      expect(window.location.pathname).toBe('/pricing');
    });
  });
});

