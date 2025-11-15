import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import useToastStore from "../store/toastStore";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // For token-based auth
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const toast = useToastStore.getState();
    const currentPath = window.location.pathname;

    // List of auth-related routes where we shouldn't show session expired messages
    const authRoutes = [
      "/signin",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ];
    const isAuthRoute = authRoutes.includes(currentPath);

    // Check if this is a login/register request - don't handle 401 for these
    const isAuthRequest =
      originalRequest.url?.includes("/login") ||
      originalRequest.url?.includes("/register") ||
      originalRequest.url?.includes("/forgot-password") ||
      originalRequest.url?.includes("/reset-password");

    // Handle 401 Unauthorized - Clear token and redirect to login
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      // List of public routes where we should NOT redirect on 401
      const publicRoutes = [
        "/",
        "/signin",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/features",
        "/pricing",
        "/testimonials",
        "/courses",
      ];
      
      // Check if current path is a public route (including dynamic routes like /courses/:slug)
      const isPublicRoute = publicRoutes.some(route => {
        if (route === "/") {
          return currentPath === "/";
        }
        return currentPath.startsWith(route);
      });

      // Clear auth data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      // Only show toast and redirect if not on a public route or auth page
      if (!isAuthRoute && !isPublicRoute) {
        toast.error("Your session has expired. Please log in again.");
        // Use React Router navigation instead of window.location for better UX
        if (currentPath !== "/signin") {
          window.location.href = "/signin";
        }
      }
    }

    // Handle 422 Validation errors - Don't show toast, let forms handle it
    if (error.response?.status === 422) {
      return Promise.reject(error);
    }

    // Handle 500 Server errors
    if (error.response?.status === 500) {
      // Log technical error to console for debugging
      console.error("Server error:", error.response.data);
      toast.error("Something went wrong on our end. Please try again in a moment.");
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      toast.error("The page or resource you're looking for doesn't exist.");
    }

    // Handle network errors
    if (!error.response) {
      toast.error("Unable to connect. Please check your internet connection.");
    }

    // Handle database/SQL errors - show user-friendly message
    const errorData = error.response?.data as any;
    const errorMessage = errorData?.message || "";
    
    // Check for SQL/database errors and replace with friendly message
    if (
      errorMessage.includes("SQLSTATE") ||
      errorMessage.includes("Base table or view not found") ||
      errorMessage.includes("doesn't exist") ||
      errorMessage.includes("SQL:")
    ) {
      console.error("Database error:", errorMessage);
      toast.error("We're experiencing some technical difficulties. Please try again later.");
      return Promise.reject(error);
    }

    // Handle other errors with user-friendly messages
    if (
      error.response?.status &&
      error.response.status >= 400 &&
      error.response.status !== 401 &&
      error.response.status !== 422 &&
      error.response.status !== 404 &&
      error.response.status !== 500
    ) {
      // Extract user-friendly message or provide default
      let friendlyMessage = "An unexpected error occurred. Please try again.";
      
      if (errorMessage && !errorMessage.includes("SQLSTATE") && !errorMessage.includes("SQL:")) {
        // Use the message if it's not a technical SQL error
        friendlyMessage = errorMessage;
      }
      
      toast.error(friendlyMessage);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
