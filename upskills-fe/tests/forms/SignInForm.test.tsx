import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../../pages/SignIn';
import * as useAuthHook from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth');
vi.mock('../../utils/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('SignIn Form', () => {
  const mockLogin = vi.fn();
  const mockUseAuth = useAuthHook.useAuth as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: mockLogin,
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email|password/i)).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByRole('textbox', { name: /email/i });
    if (emailInput) {
      await user.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/valid email|invalid/i)).toBeInTheDocument();
      });
    }
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({});

    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByPlaceholderText(/password/i) || screen.getByLabelText(/password/i);

    if (emailInput && passwordInput) {
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    }
  });
});

