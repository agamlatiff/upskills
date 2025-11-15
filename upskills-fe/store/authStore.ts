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
  checkAuth: () => Promise<void>;
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
          const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Login failed';
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
          console.error('Logout error:', error);
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

      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        // Don't check auth if we're on auth pages
        const currentPath = window.location.pathname;
        const authRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
        if (authRoutes.includes(currentPath)) {
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await apiClient.get<User>('/user');
          set({
            user: response.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          // Token is invalid or expired, clear auth state silently
          // Don't show error if we're on auth pages
          const isAuthRoute = authRoutes.includes(window.location.pathname);
          if (error.response?.status === 401 && !isAuthRoute) {
            // Only clear silently, interceptor will handle the redirect
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

