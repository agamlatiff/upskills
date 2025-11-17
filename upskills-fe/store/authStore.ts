import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthResponse } from '../types/api';
import apiClient from '../utils/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
  checkAuth: (force?: boolean) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  occupation: string;
  photo: File;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<AuthResponse>('/login', {
            email,
            password,
          });

          const { user, token } = response.data;
          
          // Store token in localStorage (also handled by persist middleware)
          localStorage.setItem('auth_token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const status = error.response?.status;
          const errorData = error.response?.data || {};
          
          // Handle validation errors (422) - usually wrong credentials or missing fields
          if (status === 422) {
            const validationErrors = errorData.errors || {};
            let errorMessage = 'Invalid email or password. Please check your credentials.';
            
            // Extract specific error messages
            if (validationErrors.email) {
              const emailError = Array.isArray(validationErrors.email) 
                ? validationErrors.email[0] 
                : validationErrors.email;
              // Check if it's an authentication failure message
              if (emailError.includes('credentials') || emailError.includes('failed')) {
                errorMessage = 'Invalid email or password. Please try again.';
              } else {
                errorMessage = emailError;
              }
            } else if (validationErrors.password) {
              errorMessage = Array.isArray(validationErrors.password) 
                ? validationErrors.password[0] 
                : validationErrors.password;
            } else if (errorData.message && !errorData.message.includes('given data was invalid')) {
              errorMessage = errorData.message;
            }
            
            // Create a formatted error object with validation errors
            const formattedError: any = new Error(errorMessage);
            formattedError.errors = validationErrors;
            formattedError.status = 422;
            
            set({
              error: null, // Don't set global error, let component handle it
              isLoading: false,
              isAuthenticated: false,
            });
            throw formattedError;
          }
          
          // Handle authentication failures (401)
          if (status === 401) {
            const errorMessage = errorData.message || 'Invalid email or password. Please try again.';
            set({
              error: errorMessage,
              isLoading: false,
              isAuthenticated: false,
            });
            
            const formattedError: any = new Error(errorMessage);
            formattedError.status = 401;
            throw formattedError;
          }
          
          // Handle other errors
          const errorMessage = errorData.message || 
                              errorData.error || 
                              'Login failed. Please try again.';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const formData = new FormData();
          formData.append('name', data.name);
          formData.append('email', data.email);
          formData.append('password', data.password);
          formData.append('password_confirmation', data.password_confirmation);
          formData.append('occupation', data.occupation);
          formData.append('photo', data.photo);

          const response = await apiClient.post<AuthResponse>('/register', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const { user, token } = response.data;
          
          localStorage.setItem('auth_token', token);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          // Call logout endpoint if token exists
          const token = get().token;
          if (token) {
            await apiClient.post('/logout');
          }
        } catch (error) {
          // Even if logout fails on server, clear local state
          if (process.env.NODE_ENV === "development") {
            console.error('Logout error:', error);
          }
        } finally {
          // Clear local state
          localStorage.removeItem('auth_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token: string | null) => {
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
        set({ token, isAuthenticated: !!token });
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async (force = false) => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        // If force is true, always check auth (used after checkout, etc.)
        // But don't set isLoading to true when force=true to avoid blocking UI
        if (!force) {
          // Don't check auth if we're on auth pages or public routes
          const currentPath = window.location.pathname;
          const authRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
          const publicRoutes = ['/', '/features', '/pricing', '/testimonials'];
          
          // Check if current path is a public route (including dynamic routes like /courses/:slug)
          const isPublicRoute = publicRoutes.includes(currentPath) || currentPath.startsWith('/courses');
          
          if (authRoutes.includes(currentPath) || isPublicRoute) {
            set({ isLoading: false });
            return;
          }
          
          // Only set loading state for initial auth check, not for forced refresh
          set({ isLoading: true });
        }

        try {
          const response = await apiClient.get<User>('/user');
          // Handle both wrapped and unwrapped responses
          const userData = (response.data as any)?.data || response.data;
          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          // Token is invalid or expired, clear auth state silently
          // Don't show error if we're on auth pages or public routes
          const currentPath = window.location.pathname;
          const authRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
          const publicRoutes = ['/', '/features', '/pricing', '/testimonials'];
          const isAuthRoute = authRoutes.includes(currentPath);
          const isPublic = publicRoutes.includes(currentPath) || currentPath.startsWith('/courses');
          
          if (error.response?.status === 401 && !isAuthRoute && !isPublic) {
            // Only clear silently, interceptor will handle the redirect for protected routes
            localStorage.removeItem('auth_token');
          }
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

