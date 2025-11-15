# UpSkills Frontend Documentation

## Overview

The UpSkills frontend is built with React 19, TypeScript, Vite, and React Router. It communicates with a Laravel backend API using Axios.

## Project Structure

```
upskills-fe/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   └── ...             # Feature-specific components
├── pages/              # Page components (routes)
├── hooks/              # Custom React hooks
├── store/              # Zustand state management stores
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── tests/              # Test files
└── App.tsx            # Main application component
```

## Technology Stack

- **React 19**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router 6**: Client-side routing
- **Zustand**: State management
- **Axios**: HTTP client
- **Zod**: Schema validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd upskills-fe
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:8000/api
VITE_MIDTRANS_CLIENT_KEY=your-midtrans-client-key
GEMINI_API_KEY=your-gemini-api-key
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Testing

```bash
npm test              # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## Routing Structure

### Public Routes

- `/` - Homepage
- `/signin` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form
- `/pricing` - Pricing page
- `/courses` - Course listing
- `/courses/:courseSlug` - Course details

### Protected Routes (Requires Authentication)

- `/dashboard` - User dashboard
- `/dashboard/subscriptions` - User subscriptions
- `/dashboard/subscription/:id` - Subscription details
- `/dashboard/search/courses` - Course search
- `/courses/:courseSlug/learn/:sectionId/:contentId` - Course learning
- `/courses/:courseSlug/completed` - Course completion
- `/checkout/:pricingId` - Checkout page
- `/checkout/success` - Checkout success
- `/profile` - User profile
- `/verify-email` - Email verification
- `/confirm-password` - Password confirmation

## State Management

### Auth Store (`store/authStore.ts`)

Manages user authentication state:

```typescript
const {
  user,           // Current user object
  token,          // Auth token
  isAuthenticated, // Auth status
  isLoading,      // Loading state
  login,          // Login function
  logout,         // Logout function
  register,       // Registration function
  checkAuth,      // Check auth status
} = useAuthStore();
```

### Toast Store (`store/toastStore.ts`)

Manages toast notifications:

```typescript
const { toasts, addToast, removeToast } = useToastStore();

// Add a toast
addToast({ message: 'Success!', type: 'success' });
```

## Custom Hooks

### `useAuth()`

Authentication hook:

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### `useApi()`

API request hook:

```typescript
const { execute, data, loading, error } = useApi();

// Make a request
await execute('get', '/dashboard/courses');
```

### `useCourses()`

Courses data hook:

```typescript
const { courses, loading, error, refetch } = useCourses();
```

### `useProfile()`

Profile management hook:

```typescript
const { profile, loading, updateProfile, deleteProfile } = useProfile();
```

## API Client

The API client (`utils/api.ts`) is configured with:

- Base URL from environment variables
- Automatic token injection via interceptors
- Error handling with toast notifications
- 401 handling (auto logout)

### Usage

```typescript
import apiClient from './utils/api';

// GET request
const response = await apiClient.get('/dashboard/courses');

// POST request
const response = await apiClient.post('/api/login', {
  email: 'user@example.com',
  password: 'password123'
});
```

## Form Validation

Forms use Zod for validation:

```typescript
import { z } from 'zod';

const SignInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const result = SignInSchema.safeParse(formData);
if (!result.success) {
  setErrors(result.error.format());
}
```

## Component Structure

### UI Components (`components/ui/`)

Base components for forms and UI:

- `TextInput.tsx` - Text input field
- `PasswordInput.tsx` - Password input with show/hide
- `Select.tsx` - Dropdown select
- `FileUpload.tsx` - File upload component
- `InputError.tsx` - Error message display
- `PrimaryButton.tsx` - Primary action button
- `SecondaryButton.tsx` - Secondary button
- `DangerButton.tsx` - Destructive action button
- `Modal.tsx` - Modal dialog
- `Dropdown.tsx` - Dropdown menu

### Protected Routes

Use the `ProtectedRoute` component to protect routes:

```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>

// With role requirement
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requireRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

## Error Handling

### Error Boundary

The app uses an `ErrorBoundary` component to catch React errors:

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### API Error Handling

API errors are handled via interceptors in `utils/api.ts`:

- 401: Auto logout and redirect to login
- 422: Validation errors (handled by forms)
- 404: Resource not found toast
- 500: Server error toast
- Network errors: Connection error toast

## Code Splitting

Routes are lazy-loaded for optimal bundle size:

```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'));
```

This splits the bundle into smaller chunks loaded on demand.

## Build Optimization

The Vite config includes:

- Manual chunk splitting for vendor libraries
- Code splitting for routes
- Tree shaking for unused code

## Testing

Tests are written with Vitest and React Testing Library:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Styling

The app uses Tailwind CSS for styling. Classes follow the pattern:

- `bg-brand-dark` - Dark background
- `text-slate-300` - Light text
- `border-slate-700` - Border colors

## TypeScript Types

Type definitions are in `types/api.ts`:

- `User` - User object type
- `Course` - Course object type
- `Transaction` - Transaction type
- `ApiError` - API error type

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_MIDTRANS_CLIENT_KEY` | Midtrans client key | Yes (for payments) |
| `GEMINI_API_KEY` | Gemini API key | No |

## Common Patterns

### Form Handling

```typescript
const [formData, setFormData] = useState({ email: '', password: '' });
const [errors, setErrors] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();
  const validation = Schema.safeParse(formData);
  if (!validation.success) {
    setErrors(validation.error.format());
    return;
  }
  
  try {
    await apiClient.post('/api/login', formData);
  } catch (error) {
    // Handle error
  }
};
```

### Loading States

```typescript
const { data, loading, error } = useCourses();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <CourseList courses={data} />;
```

## Deployment

1. Set environment variables in production
2. Build the app: `npm run build`
3. Serve the `dist/` directory with a static file server
4. Configure API base URL to point to production backend

## Troubleshooting

### CORS Issues

Ensure backend CORS is configured for your frontend domain.

### Authentication Issues

Check that:
- Token is stored in localStorage
- Token is included in API requests
- Backend token validation is working

### Build Issues

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

