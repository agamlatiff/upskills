
import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layout & shared components
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from './components/Toast';
import useToastStore from './store/toastStore';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const ConfirmPassword = lazy(() => import('./pages/ConfirmPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const SubscriptionDetails = lazy(() => import('./pages/SubscriptionDetails'));
const StartLearning = lazy(() => import('./pages/StartLearning'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Courses = lazy(() => import('./pages/Courses'));
const Features = lazy(() => import('./pages/Features'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const Profile = lazy(() => import('./pages/Profile'));
const CourseSearch = lazy(() => import('./pages/CourseSearch'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const CourseComplete = lazy(() => import('./pages/CourseComplete'));
const MentorCourses = lazy(() => import('./pages/MentorCourses'));
const MentorCourseContent = lazy(() => import('./pages/MentorCourseContent'));

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-dark">
    <div className="text-slate-300">Loading...</div>
  </div>
);

const App: React.FC = () => {
  const { checkAuth, isAuthenticated } = useAuth();
  const { toasts, removeToast } = useToastStore();

  // Check authentication status on app mount (only if not on auth pages or public routes)
  useEffect(() => {
    const currentPath = window.location.pathname;
    const authRoutes = ['/signin', '/signup', '/forgot-password', '/reset-password', '/verify-email'];
    const publicRoutes = ['/', '/features', '/pricing', '/testimonials'];
    
    // Check if current path is a public route (including dynamic routes like /courses/:slug)
    const isPublicRoute = publicRoutes.includes(currentPath) || currentPath.startsWith('/courses');
    
    // Only check auth if not on auth pages or public routes
    if (!authRoutes.includes(currentPath) && !isPublicRoute) {
      checkAuth();
    }
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-brand-dark text-slate-300 font-sans">
        <Header />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/confirm-password" element={<ConfirmPassword />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseSlug" element={<CourseDetail />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
            <Route path="/dashboard/subscription/:id" element={<ProtectedRoute><SubscriptionDetails /></ProtectedRoute>} />
            <Route path="/courses/search" element={<CourseSearch />} />
            <Route path="/courses/:courseSlug/learn/:sectionId/:contentId" element={<ProtectedRoute><StartLearning /></ProtectedRoute>} />
            <Route path="/courses/:courseSlug/completed" element={<ProtectedRoute><CourseComplete /></ProtectedRoute>} />
            <Route path="/checkout/:pricingId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/checkout/success" element={<ProtectedRoute><CheckoutSuccess /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/mentor/courses" element={<ProtectedRoute><MentorCourses /></ProtectedRoute>} />
            <Route path="/mentor/courses/:courseId/content" element={<ProtectedRoute><MentorCourseContent /></ProtectedRoute>} />
            <Route path="/roadmaps/:roadmapId" element={<Roadmap />} />
            
            {/* Home page with section anchor */}
            <Route path="/:section" element={<Home />} />
          </Routes>
        </Suspense>
        <Footer />
        <Chatbot />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ErrorBoundary>
  );
};

export default App;
