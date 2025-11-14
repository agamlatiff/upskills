# Laravel Blade to React Migration Todo List

## Overview

This document outlines the step-by-step migration plan to refactor the Laravel Blade frontend to React.

---

## Phase 1: Backend API Setup

### 1.1 Convert Controllers to API Endpoints

- [ ] **FrontController** - Convert to API endpoints

  - [ ] `index()` → `GET /api/front` (homepage data)
  - [ ] `pricing()` → `GET /api/pricing`
  - [ ] `checkout()` → `GET /api/checkout/{pricing}`
  - [ ] `checkoutSuccess()` → `GET /api/checkout/success`
  - [ ] `paymentStoreMidtrans()` → `POST /api/payment/midtrans`
  - [ ] `paymentMidtransNotification()` → `POST /api/payment/midtrans/notification`

- [ ] **CourseController** - Convert to API endpoints

  - [ ] `index()` → `GET /api/dashboard/courses`
  - [ ] `details()` → `GET /api/dashboard/courses/{course:slug}`
  - [ ] `search_courses()` → `GET /api/dashboard/search/courses`
  - [ ] `join()` → `POST /api/dashboard/join/{course:slug}`
  - [ ] `learning()` → `GET /api/dashboard/learning/{course:slug}/{section}/{content}`
  - [ ] `learning_finished()` → `GET /api/dashboard/learning/{course:slug}/finished`

- [ ] **DashboardController** - Convert to API endpoints

  - [ ] `subscriptions()` → `GET /api/dashboard/subscriptions`
  - [ ] `subscription_details()` → `GET /api/dashboard/subscription/{transaction}`

- [ ] **ProfileController** - Convert to API endpoints

  - [ ] `edit()` → `GET /api/profile`
  - [ ] `update()` → `PATCH /api/profile`
  - [ ] `destroy()` → `DELETE /api/profile`

- [ ] **Auth Controllers** - Convert to API endpoints
  - [ ] `RegisteredUserController` → `POST /api/register`
  - [ ] `AuthenticatedSessionController` → `POST /api/login`, `POST /api/logout`
  - [ ] `PasswordResetLinkController` → `POST /api/forgot-password`
  - [ ] `NewPasswordController` → `POST /api/reset-password`
  - [ ] `EmailVerificationNotificationController` → `POST /api/email/verification-notification`
  - [ ] `VerifyEmailController` → `GET /api/verify-email/{id}/{hash}`
  - [ ] `ConfirmablePasswordController` → `POST /api/confirm-password`
  - [ ] `PasswordController` → `PUT /api/password`

### 1.2 API Response Formatting

- [ ] Create API Resource classes for consistent JSON responses
  - [ ] `CourseResource`
  - [ ] `UserResource`
  - [ ] `TransactionResource`
  - [ ] `PricingResource`
  - [ ] `SectionContentResource`

### 1.3 API Authentication Setup

- [ ] Install and configure Laravel Sanctum or Passport
- [ ] Update middleware to use API authentication
- [ ] Configure CORS for React frontend
- [ ] Set up CSRF token handling for API requests

### 1.4 API Routes

- [ ] Create `routes/api.php` with all API endpoints
- [ ] Group routes with proper middleware (auth, role:student, etc.)
- [ ] Add API versioning if needed (`/api/v1/...`)

---

## Phase 2: React Frontend Migration

### 2.1 Authentication Pages

- [ ] **Login Page** (`/signin`)

  - [ ] Migrate `resources/views/auth/login.blade.php`
  - [ ] Implement form validation
  - [ ] Handle authentication state
  - [ ] Add error handling
  - [ ] Redirect after successful login

- [ ] **Register Page** (`/signup`)

  - [ ] Migrate `resources/views/auth/register.blade.php`
  - [ ] Implement form validation
  - [ ] Add password strength indicator (already exists)
  - [ ] Handle registration errors
  - [ ] Redirect after successful registration

- [ ] **Forgot Password Page**

  - [ ] Create `/forgot-password` route
  - [ ] Migrate `resources/views/auth/forgot-password.blade.php`
  - [ ] Implement form submission
  - [ ] Add success/error messages

- [ ] **Reset Password Page**

  - [ ] Create `/reset-password/:token` route
  - [ ] Migrate `resources/views/auth/reset-password.blade.php`
  - [ ] Implement password reset form
  - [ ] Handle token validation

- [ ] **Email Verification**

  - [ ] Create `/verify-email` route
  - [ ] Migrate `resources/views/auth/verify-email.blade.php`
  - [ ] Implement verification flow
  - [ ] Add resend verification email functionality

- [ ] **Confirm Password Page**
  - [ ] Create `/confirm-password` route
  - [ ] Migrate `resources/views/auth/confirm-password.blade.php`
  - [ ] Implement password confirmation for sensitive actions

### 2.2 Dashboard Pages

- [ ] **Dashboard Home** (`/dashboard`)

  - [ ] Migrate `resources/views/dashboard.blade.php`
  - [ ] Create `/dashboard` route in React
  - [ ] Fetch courses data from API
  - [ ] Implement course listing

- [ ] **Subscriptions Page** (`/dashboard/subscriptions`)

  - [ ] Create `/dashboard/subscriptions` route
  - [ ] Migrate `resources/views/front/subscriptions.blade.php`
  - [ ] Fetch subscriptions from API
  - [ ] Display subscription list with status

- [ ] **Subscription Details** (`/dashboard/subscription/:id`)

  - [ ] Create `/dashboard/subscription/:id` route
  - [ ] Migrate `resources/views/front/subscription_details.blade.php`
  - [ ] Fetch subscription details from API
  - [ ] Display transaction details

- [ ] **Course Search** (`/dashboard/search/courses`)
  - [ ] Create `/dashboard/search/courses` route
  - [ ] Migrate `resources/views/courses/search.blade.php`
  - [ ] Implement search functionality
  - [ ] Add filters and sorting

### 2.3 Course Pages

- [ ] **Course Details** (`/dashboard/courses/:slug`)

  - [ ] Migrate `resources/views/courses/details.blade.php`
  - [ ] Update existing `/courses/:courseSlug` page if needed
  - [ ] Fetch course details from API
  - [ ] Display course information, sections, and content

- [ ] **Course Learning** (`/dashboard/learning/:slug/:section/:content`)

  - [ ] Migrate `resources/views/courses/learning.blade.php`
  - [ ] Update existing `/courses/:courseSlug/learn` page
  - [ ] Implement section navigation
  - [ ] Add progress tracking
  - [ ] Handle video/content display

- [ ] **Course Learning Finished** (`/dashboard/learning/:slug/finished`)

  - [ ] Migrate `resources/views/courses/learning_finished.blade.php`
  - [ ] Update existing `/courses/:courseSlug/completed` page
  - [ ] Display completion certificate/badge
  - [ ] Add next course suggestions

- [ ] **Course Join Success** (`/dashboard/courses/:slug/success`)
  - [ ] Migrate `resources/views/courses/success_joined.blade.php`
  - [ ] Create success page after joining course
  - [ ] Add redirect to learning page

### 2.4 Checkout & Payment

- [ ] **Checkout Page** (`/checkout/:pricing`)

  - [ ] Migrate `resources/views/front/checkout.blade.php`
  - [ ] Update existing `/checkout` page
  - [ ] Fetch pricing details from API
  - [ ] Implement Midtrans payment integration
  - [ ] Add form validation

- [ ] **Checkout Success** (`/checkout/success`)

  - [ ] Migrate `resources/views/front/checkout_success.blade.php`
  - [ ] Create `/checkout/success` route
  - [ ] Display transaction confirmation
  - [ ] Add redirect to dashboard

- [ ] **Payment Notification Handler**
  - [ ] Ensure backend handles Midtrans webhooks
  - [ ] Update transaction status automatically

### 2.5 Profile Management

- [ ] **Profile Edit Page** (`/profile`)

  - [ ] Create `/profile` route
  - [ ] Migrate `resources/views/profile/edit.blade.php`
  - [ ] Implement profile update form
  - [ ] Add image upload functionality
  - [ ] Handle form validation

- [ ] **Update Profile Information**

  - [ ] Migrate `resources/views/profile/partials/update-profile-information-form.blade.php`
  - [ ] Create profile information form component
  - [ ] Implement update functionality

- [ ] **Update Password**

  - [ ] Migrate `resources/views/profile/partials/update-password-form.blade.php`
  - [ ] Create password update form component
  - [ ] Add password validation

- [ ] **Delete User Account**
  - [ ] Migrate `resources/views/profile/partials/delete-user-form.blade.php`
  - [ ] Create delete account component
  - [ ] Add confirmation modal
  - [ ] Implement account deletion

### 2.6 Homepage & Public Pages

- [ ] **Homepage** (`/`)

  - [ ] Migrate `resources/views/front/index.blade.php`
  - [ ] Update existing `/` route
  - [ ] Fetch dynamic content from API
  - [ ] Ensure all sections are working

- [ ] **Pricing Page** (`/pricing`)
  - [ ] Migrate `resources/views/front/pricing.blade.php`
  - [ ] Update existing `/pricing` page
  - [ ] Fetch pricing data from API
  - [ ] Add dynamic pricing display

---

## Phase 3: React Infrastructure

### 3.1 State Management

- [ ] Set up authentication context/store

  - [ ] User authentication state
  - [ ] Token management
  - [ ] Login/logout actions
  - [ ] Protected route handling

- [ ] Set up API client

  - [ ] Configure axios/fetch with base URL
  - [ ] Add request interceptors for auth tokens
  - [ ] Add response interceptors for error handling
  - [ ] Handle token refresh

- [ ] Create custom hooks
  - [ ] `useAuth()` - Authentication hook
  - [ ] `useApi()` - API request hook
  - [ ] `useCourses()` - Courses data hook
  - [ ] `useProfile()` - Profile management hook

### 3.2 Routing & Navigation

- [ ] Set up React Router

  - [ ] Configure protected routes
  - [ ] Add route guards for authenticated users
  - [ ] Add role-based route protection (student role)
  - [ ] Implement redirects after login/logout

- [ ] Update navigation components
  - [ ] Update `Header.tsx` with authenticated menu
  - [ ] Add user dropdown menu
  - [ ] Show/hide links based on auth state
  - [ ] Add logout functionality

### 3.3 Form Handling

- [ ] Set up form library (React Hook Form / Formik)
- [ ] Create reusable form components

  - [ ] Text input component
  - [ ] Password input component
  - [ ] Select dropdown component
  - [ ] File upload component
  - [ ] Error message component

- [ ] Implement form validation
  - [ ] Client-side validation
  - [ ] Server-side error handling
  - [ ] Display validation errors

### 3.4 UI Components Migration

- [ ] Migrate Blade components to React
  - [ ] `course-card.blade.php` → Already exists as `CourseCard.tsx`
  - [ ] `modal.blade.php` → Create `Modal.tsx`
  - [ ] `dropdown.blade.php` → Create `Dropdown.tsx`
  - [ ] `input-label.blade.php` → Create `InputLabel.tsx`
  - [ ] `input-error.blade.php` → Create `InputError.tsx`
  - [ ] `primary-button.blade.php` → Create `PrimaryButton.tsx`
  - [ ] `secondary-button.blade.php` → Create `SecondaryButton.tsx`
  - [ ] `danger-button.blade.php` → Create `DangerButton.tsx`

### 3.5 Error Handling

- [ ] Create error boundary component
- [ ] Implement global error handler
- [ ] Add toast notifications for success/error messages
- [ ] Handle API errors gracefully
- [ ] Add loading states for async operations

### 3.6 Data Fetching

- [ ] Implement data fetching patterns
  - [ ] Use React Query or SWR for data caching
  - [ ] Add loading states
  - [ ] Handle error states
  - [ ] Implement data refetching

---

## Phase 4: Backend Updates

### 4.1 Remove Blade Dependencies

- [ ] Remove Blade view returns from controllers
- [ ] Update controllers to return JSON responses
- [ ] Remove view-related middleware if not needed
- [ ] Clean up unused Blade components

### 4.2 Update Middleware

- [ ] Ensure API middleware is properly configured
- [ ] Update role-based middleware for API routes
- [ ] Add rate limiting for API endpoints
- [ ] Configure CORS properly

### 4.3 Session Management

- [ ] Decide on session vs token-based auth
- [ ] If using tokens, remove session dependencies
- [ ] Update CSRF protection for API
- [ ] Configure cookie settings if needed

### 4.4 File Uploads

- [ ] Update file upload handling for API
- [ ] Ensure proper file storage configuration
- [ ] Add file upload endpoints if needed
- [ ] Handle image uploads for profile pictures

---

## Phase 5: Testing & Quality Assurance

### 5.1 API Testing

- [ ] Write API endpoint tests
- [ ] Test authentication flows
- [ ] Test authorization (role-based access)
- [ ] Test error handling
- [ ] Test payment integration

### 5.2 Frontend Testing

- [ ] Write component tests
- [ ] Test form submissions
- [ ] Test navigation flows
- [ ] Test protected routes
- [ ] Test error states

### 5.3 Integration Testing

- [ ] Test complete user flows
  - [ ] Registration → Login → Dashboard
  - [ ] Course browsing → Checkout → Payment
  - [ ] Course learning flow
  - [ ] Profile update flow

### 5.4 E2E Testing

- [ ] Set up E2E testing framework (Cypress/Playwright)
- [ ] Test critical user journeys
- [ ] Test payment flows
- [ ] Test authentication flows

---

## Phase 6: Deployment & Cleanup

### 6.1 Build Configuration

- [ ] Configure React build for production
- [ ] Set up environment variables
- [ ] Configure API base URL for different environments
- [ ] Optimize bundle size

### 6.2 Deployment

- [ ] Update deployment scripts
- [ ] Configure reverse proxy (Nginx/Apache) if needed
- [ ] Set up separate frontend hosting (if applicable)
- [ ] Configure CORS for production domain

### 6.3 Cleanup

- [ ] Remove unused Blade views
- [ ] Remove unused Blade components
- [ ] Clean up unused routes
- [ ] Remove Blade-related dependencies if not needed
- [ ] Update documentation

### 6.4 Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add analytics tracking
- [ ] Monitor API performance
- [ ] Set up logging for API requests

---

## Phase 7: Documentation

### 7.1 API Documentation

- [ ] Document all API endpoints
- [ ] Add request/response examples
- [ ] Document authentication flow
- [ ] Create Postman collection or OpenAPI spec

### 7.2 Frontend Documentation

- [ ] Document component structure
- [ ] Document routing structure
- [ ] Document state management
- [ ] Update README with setup instructions

### 7.3 Migration Notes

- [ ] Document breaking changes
- [ ] Create migration guide for future reference
- [ ] Document known issues and solutions

---

## Priority Order

### High Priority (Must Have)

1. Backend API Setup (Phase 1)
2. Authentication Pages (Phase 2.1)
3. React Infrastructure - Auth & API Client (Phase 3.1)
4. Dashboard Pages (Phase 2.2)
5. Course Pages (Phase 2.3)

### Medium Priority (Should Have)

6. Checkout & Payment (Phase 2.4)
7. Profile Management (Phase 2.5)
8. Routing & Navigation (Phase 3.2)
9. Form Handling (Phase 3.3)

### Low Priority (Nice to Have)

10. UI Components Migration (Phase 3.4)
11. Testing (Phase 5)
12. Documentation (Phase 7)

---

## Notes

- Ensure backward compatibility during migration
- Consider running both Blade and React in parallel during transition
- Test thoroughly before removing Blade views
- Keep API versioning in mind for future changes
- Consider implementing feature flags for gradual rollout

---

## Estimated Timeline

- **Phase 1**: 1-2 weeks
- **Phase 2**: 3-4 weeks
- **Phase 3**: 1-2 weeks
- **Phase 4**: 1 week
- **Phase 5**: 1-2 weeks
- **Phase 6**: 1 week
- **Phase 7**: Ongoing

**Total Estimated Time**: 8-12 weeks (depending on team size and complexity)
