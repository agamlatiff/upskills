# Feature PRD: Testimonials, Course Ratings, Wishlist, Free Courses & Image Fix

## Overview

This PRD outlines the implementation of multiple features to enhance the Upskills platform: testimonials system, course difficulty ratings, wishlist functionality, free course support, and fixing image display issues.

---

## 1. Testimonials System

### 1.1 Database Schema

**Table: `testimonials`**

- `id` (bigint, primary key, auto-increment)
- `user_id` (bigint, foreign key → users.id, nullable)
- `course_id` (bigint, foreign key → courses.id, nullable)
- `quote` (text, required) - The testimonial text
- `rating` (tinyint, 1-5, nullable) - Optional rating
- `outcome` (string, 255, nullable) - e.g., "Hired · 7 weeks", "Freelance · $1.5k/mo"
- `is_verified` (boolean, default: false) - Admin verification status
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Relationships:**

- `belongsTo(User)` - Optional user who wrote the testimonial
- `belongsTo(Course)` - Optional course the testimonial is about

### 1.2 Backend Implementation

**Model: `App\Models\Testimonial`**

- Fillable: `user_id`, `course_id`, `quote`, `rating`, `outcome`, `is_verified`
- Relationships: `user()`, `course()`

**Controller: `App\Http\Controllers\TestimonialController`**

- `index()` - GET `/api/testimonials` - List all testimonials (public)
  - Query params: `verified` (boolean), `course_id` (int), `limit` (int)
- `store()` - POST `/api/testimonials` - Create testimonial (authenticated)
  - Validation: `quote` (required, string, max:1000), `rating` (nullable, integer, 1-5), `outcome` (nullable, string, max:255), `course_id` (nullable, exists:courses,id)
- `update()` - PUT `/api/testimonials/{id}` - Update testimonial (owner or admin)
- `destroy()` - DELETE `/api/testimonials/{id}` - Delete testimonial (owner or admin)

**Resource: `App\Http\Resources\TestimonialResource`**

- Include: `id`, `quote`, `rating`, `outcome`, `is_verified`, `user` (name, photo, occupation), `course` (id, name, slug), `created_at`

**Routes:**

```php
// Public routes
Route::get('/testimonials', [TestimonialController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/testimonials', [TestimonialController::class, 'store']);
    Route::put('/testimonials/{testimonial}', [TestimonialController::class, 'update']);
    Route::delete('/testimonials/{testimonial}', [TestimonialController::class, 'destroy']);
});
```

### 1.3 Frontend Implementation

**API Hook: `hooks/useTestimonials.ts`**

- `getTestimonials(params?)` - Fetch testimonials
- `createTestimonial(data)` - Create new testimonial
- `updateTestimonial(id, data)` - Update testimonial
- `deleteTestimonial(id)` - Delete testimonial

**Components:**

- Update `components/Testimonials.tsx` - Fetch from API instead of hardcoded data
- Update `components/TestimonialCard.tsx` - Use API data structure
- Update `pages/Testimonials/index.tsx` - Integrate API calls

**Features:**

- Display testimonials in carousel/slider
- Show verified badge for verified testimonials
- Display user avatar, name, occupation, company
- Show course link if testimonial is course-specific
- Display outcome badge

---

## 2. Course Difficulty Ratings

### 2.1 Database Schema

**Table: `courses` (modification)**

- Add column: `difficulty` (enum: 'beginner', 'intermediate', 'advanced', nullable, default: 'beginner')

### 2.2 Backend Implementation

**Model: `App\Models\Course`**

- Add `difficulty` to fillable array
- Add validation rule: `difficulty` => `in:beginner,intermediate,advanced`

**Resource: `App\Http\Resources\CourseResource`**

- Add `difficulty` field to response

**Migration:**

```php
Schema::table('courses', function (Blueprint $table) {
    $table->enum('difficulty', ['beginner', 'intermediate', 'advanced'])
          ->default('beginner')
          ->after('is_populer');
});
```

### 2.3 Frontend Implementation

**Types:**

- Update `types/api.ts` - Add `difficulty` to Course type
- Update `types/index.ts` - Add difficulty options

**Components:**

- Update `components/CourseCard.tsx` - Display difficulty badge
- Update `components/CourseDetail.tsx` - Show difficulty in course details
- Update `pages/Courses/index.tsx` - Add difficulty filter
- Update `pages/CourseSearch/index.tsx` - Include difficulty in search/filter

**UI Elements:**

- Difficulty badges with colors:
  - Beginner: Green badge
  - Intermediate: Yellow/Orange badge
  - Advanced: Red badge
- Filter dropdown for difficulty selection

---

## 3. Wishlist Database & Backend

### 3.1 Database Schema

**Table: `wishlists` (modification)**

- `id` (bigint, primary key, auto-increment)
- `user_id` (bigint, foreign key → users.id, onDelete: cascade)
- `course_id` (bigint, foreign key → courses.id, onDelete: cascade)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- Unique constraint: `unique(['user_id', 'course_id'])`

### 3.2 Backend Implementation

**Model: `App\Models\Wishlist`**

- Fillable: `user_id`, `course_id`
- Relationships: `belongsTo(User)`, `belongsTo(Course)`
- Scopes: `forUser($userId)`

**Controller: `App\Http\Controllers\WishlistController`**

- `index()` - GET `/api/wishlist` - Get user's wishlist (authenticated)
- `store()` - POST `/api/wishlist` - Add course to wishlist
  - Validation: `course_id` (required, exists:courses,id)
- `destroy()` - DELETE `/api/wishlist/{course}` - Remove course from wishlist

**Resource: `App\Http\Resources\WishlistResource`**

- Include: `id`, `course` (full CourseResource), `created_at`

**Routes:**

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{course}', [WishlistController::class, 'destroy']);
});
```

### 3.3 Frontend Implementation

**API Hook: `hooks/useWishlist.ts` (update)**

- Replace localStorage with API calls
- `getWishlist()` - Fetch user's wishlist from API
- `addToWishlist(courseId)` - Add course to wishlist
- `removeFromWishlist(courseId)` - Remove course from wishlist
- Sync with backend on mount

**Components:**

- Update `components/CourseCard.tsx` - Use API wishlist
- Update `pages/Wishlist/index.tsx` - Fetch from API
- Update `context/WishlistContext.tsx` - Integrate API calls

**Features:**

- Real-time sync with backend
- Optimistic UI updates
- Error handling for failed API calls

---

## 4. Free Courses Feature

### 4.1 Database Schema

**Table: `courses` (modification)**

- Add column: `is_free` (boolean, default: false)

### 4.2 Backend Implementation

**Model: `App\Models\Course`**

- Add `is_free` to fillable array

**Resource: `App\Http\Resources\CourseResource`**

- Add `is_free` field to response

**Controller: `App\Http\Controllers\CourseController`**

- Update `index()` - Add filter for free courses (optional query param)
- Update `search_courses()` - Include `is_free` in search results

**Migration:**

```php
Schema::table('courses', function (Blueprint $table) {
    $table->boolean('is_free')->default(false)->after('difficulty');
});
```

### 4.3 Frontend Implementation

**Types:**

- Update `types/api.ts` - Add `is_free` to Course type

**Components:**

- Update `components/CourseCard.tsx` - Show "Free" badge if `is_free` is true
- Update `components/Courses.tsx` - Add free course filter
- Update `pages/Courses/index.tsx` - Filter free courses
- Update `pages/CourseSearch/index.tsx` - Include free filter

**Features:**

- "Free" badge on course cards
- Filter to show only free courses
- Free courses accessible without subscription

---

## 5. Image Display Bug Fix

### 5.1 Problem Analysis

Images from database (profile photos, course thumbnails) are not displaying correctly. Likely causes:

- Storage URL generation issues
- Frontend URL construction problems
- CORS or path resolution issues

### 5.2 Backend Fixes

**Storage Configuration:**

- Verify `config/filesystems.php` - Ensure `public` disk is configured correctly
- Ensure `storage/app/public` is symlinked to `public/storage`
- Verify `APP_URL` in `.env` is set correctly

**Resource Updates:**

- `UserResource` - Ensure photo URL uses `Storage::disk('public')->url()`
- `CourseResource` - Ensure thumbnail URL uses `Storage::disk('public')->url()`
- Verify URLs are absolute (include domain) or relative consistently

### 5.3 Frontend Fixes

**Utility: `utils/imageUrl.ts` (update)**

- Verify `VITE_API_URL` environment variable is set correctly
- Ensure URL construction handles both absolute and relative paths
- Add fallback for missing images
- Handle CORS issues if any

**Components:**

- Update all image sources to use `getImageUrl()` or `getCourseThumbnailUrl()`
- Update `components/CourseCard.tsx` - Use `getCourseThumbnailUrl()`
- Update `pages/Profile/index.tsx` - Use `getProfilePhotoUrl()`
- Update `components/CourseDetail.tsx` - Use proper image URL utilities

**Testing:**

- Test with different image paths (relative, absolute, null)
- Test with missing images (should show placeholder)
- Test in different environments (local, staging, production)

---

## 6. Implementation Priority

### Phase 1: Critical Fixes ✅ DONE

1. ✅ Image display bug fix - COMPLETED
2. ✅ Wishlist database migration completion - COMPLETED

### Phase 2: Core Features ✅ DONE

3. ✅ Free courses feature - COMPLETED
4. ✅ Course difficulty ratings - COMPLETED

### Phase 3: Enhanced Features ✅ DONE

5. ✅ Testimonials system (database + backend) - COMPLETED
6. ✅ Testimonials frontend integration - COMPLETED

---

## 7. Testing Requirements

### Unit Tests

- Test model relationships
- Test validation rules
- Test resource transformations

### Integration Tests

- Test API endpoints
- Test authentication/authorization
- Test image URL generation

### E2E Tests

- Test wishlist add/remove flow
- Test testimonial creation
- Test course filtering by difficulty and free status
- Test image display across all pages

---

## 8. Migration Strategy

### Database Migrations

1. Create `testimonials` table
2. Add `difficulty` to `courses` table
3. Complete `wishlists` table (add user_id, course_id)
4. Add `is_free` to `courses` table

### Data Migration

- Migrate existing hardcoded testimonials to database (optional)
- Set default difficulty for existing courses
- Set default `is_free` value for existing courses

---

## 9. API Documentation Updates

Update `API_DOCUMENTATION.md` with:

- Testimonials endpoints
- Wishlist endpoints
- Updated Course resource (difficulty, is_free)
- Image URL format documentation

---

## 10. Frontend Documentation Updates

Update `FRONTEND_DOCUMENTATION.md` with:

- New hooks (useTestimonials, updated useWishlist)
- Updated components
- Image URL utility usage
- New filtering options

---

## 11. Acceptance Criteria ✅ ALL COMPLETED

### Testimonials ✅ DONE

- ✅ Users can view testimonials on testimonials page - IMPLEMENTED
- ✅ Authenticated users can create testimonials - IMPLEMENTED
- ✅ Testimonials display user info and course info if available - IMPLEMENTED
- ✅ Verified testimonials show verification badge - IMPLEMENTED

### Course Difficulty ✅ DONE

- ✅ Courses display difficulty badge - IMPLEMENTED
- ✅ Users can filter courses by difficulty - IMPLEMENTED
- ✅ Difficulty is shown in course details - IMPLEMENTED

### Wishlist ✅ DONE

- ✅ Users can add/remove courses from wishlist - IMPLEMENTED
- ✅ Wishlist persists across sessions (via API) - IMPLEMENTED
- ✅ Wishlist page shows all wishlisted courses - IMPLEMENTED

### Free Courses ✅ DONE

- ✅ Free courses display "Free" badge - IMPLEMENTED
- ✅ Users can filter to show only free courses - IMPLEMENTED
- ✅ Free courses are accessible without subscription - IMPLEMENTED

### Image Display ✅ DONE

- ✅ All images from database display correctly - IMPLEMENTED
- ✅ Profile photos display correctly - IMPLEMENTED
- ✅ Course thumbnails display correctly - IMPLEMENTED
- ✅ Placeholder shown for missing images - IMPLEMENTED

---

## 12. Rollout Plan

1. **Development**: Implement all features in development environment
2. **Testing**: Run full test suite, fix any issues
3. **Staging**: Deploy to staging, perform UAT
4. **Production**: Deploy migrations first, then code updates
5. **Monitoring**: Monitor for errors, especially image loading issues

---

## Notes

- All migrations should be reversible
- Backward compatibility should be maintained where possible
- API responses should include all necessary data for frontend
- Error handling should be comprehensive
- Loading states should be implemented for all async operations
