# UpSkills API Documentation

## Base URL

```
http://localhost:8000/api
```

Production: `https://api.upskills.com/api`

## Authentication

The API uses Laravel Sanctum for authentication. Most endpoints require authentication via Bearer token.

### Getting an Authentication Token

**Endpoint:** `POST /api/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "photo": "http://localhost:8000/storage/photos/photo.jpg",
    "occupation": "Developer",
    "email_verified_at": "2024-01-01T00:00:00.000000Z",
    "has_active_subscription": true,
    "roles": ["student"],
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz1234567890"
}
```

**Using the Token:**

Include the token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Public Endpoints

### Get Homepage Data

**Endpoint:** `GET /api/front`

**Response:**
```json
{
  "message": "Welcome to UpSkills API",
  "version": "1.0"
}
```

### Get Pricing Packages

**Endpoint:** `GET /api/pricing`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Basic Plan",
    "duration": 30,
    "price": 100000,
    "is_subscribed": false,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
]
```

---

## Authentication Endpoints

### Register User

**Endpoint:** `POST /api/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "occupation": "Developer",
  "photo": "<file>"
}
```

**Response:** `201 Created`
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "occupation": "Developer",
    "roles": ["student"]
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz1234567890"
}
```

### Login

**Endpoint:** `POST /api/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "1|..."
}
```

### Logout

**Endpoint:** `POST /api/logout`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "message": "Logout successful"
}
```

### Forgot Password

**Endpoint:** `POST /api/forgot-password`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset link sent to your email"
}
```

### Reset Password

**Endpoint:** `POST /api/reset-password`

**Request:**
```json
{
  "token": "reset-token",
  "email": "user@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password reset successful"
}
```

### Verify Email

**Endpoint:** `GET /api/verify-email/{id}/{hash}`

**Query Parameters:**
- `signature` (optional)
- `expires` (optional)

**Response:** `200 OK`
```json
{
  "message": "Email verified successfully",
  "user": { ... }
}
```

### Resend Verification Email

**Endpoint:** `POST /api/email/verification-notification`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "message": "Verification link sent!"
}
```

### Confirm Password

**Endpoint:** `POST /api/confirm-password`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "password": "currentpassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password confirmed successfully"
}
```

---

## User Profile Endpoints

### Get Profile

**Endpoint:** `GET /api/profile`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "photo": "http://localhost:8000/storage/photos/photo.jpg",
  "occupation": "Developer",
  "email_verified_at": "2024-01-01T00:00:00.000000Z",
  "has_active_subscription": true,
  "roles": ["student"],
  "created_at": "2024-01-01T00:00:00.000000Z",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

### Update Profile

**Endpoint:** `PATCH /api/profile`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "occupation": "Senior Developer",
  "photo": "<file>"
}
```

**Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Update Password

**Endpoint:** `PUT /api/password`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "current_password": "oldpassword123",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password updated successfully"
}
```

### Delete Account

**Endpoint:** `DELETE /api/profile`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "password": "currentpassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Account deleted successfully"
}
```

---

## Course Endpoints (Student Role Required)

### Get Courses

**Endpoint:** `GET /api/dashboard/courses`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
[
  {
    "category": "Web Development",
    "courses": [
      {
        "id": 1,
        "slug": "laravel-fundamentals",
        "name": "Laravel Fundamentals",
        "thumbnail": "http://localhost:8000/storage/thumbnails/laravel.jpg",
        "about": "Learn Laravel from scratch",
        "is_populer": true,
        "content_count": 50,
        "category": {
          "id": 1,
          "name": "Web Development"
        },
        "benefits": [
          {
            "id": 1,
            "benefit": "Learn modern PHP framework"
          }
        ],
        "course_sections": [ ... ],
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ]
  }
]
```

### Get Course Details

**Endpoint:** `GET /api/dashboard/courses/{courseSlug}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "slug": "laravel-fundamentals",
  "name": "Laravel Fundamentals",
  "thumbnail": "http://localhost:8000/storage/thumbnails/laravel.jpg",
  "about": "Learn Laravel from scratch",
  "is_populer": true,
  "content_count": 50,
  "category": { ... },
  "benefits": [ ... ],
  "course_sections": [
    {
      "id": 1,
      "name": "Introduction",
      "position": 1,
      "section_contents": [
        {
          "id": 1,
          "name": "Welcome",
          "content": "<p>Welcome to the course</p>",
          "course_section_id": 1
        }
      ]
    }
  ],
  "course_mentors": [ ... ]
}
```

### Search Courses

**Endpoint:** `GET /api/dashboard/search/courses?search=laravel`

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `search` (required): Search query

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "slug": "laravel-fundamentals",
    "name": "Laravel Fundamentals",
    ...
  }
]
```

### Join Course

**Endpoint:** `POST /api/dashboard/join/{courseSlug}`

**Headers:** `Authorization: Bearer {token}`

**Note:** Requires active subscription

**Response:** `200 OK`
```json
{
  "message": "Successfully joined course",
  "student_name": "John Doe"
}
```

### Get Learning Content

**Endpoint:** `GET /api/dashboard/learning/{courseSlug}/{sectionId}/{contentId}`

**Headers:** `Authorization: Bearer {token}`

**Note:** Requires active subscription

**Response:** `200 OK`
```json
{
  "course": { ... },
  "current_section": {
    "id": 1,
    "name": "Introduction",
    "position": 1
  },
  "current_content": {
    "id": 1,
    "name": "Welcome",
    "content": "<p>Welcome to the course</p>"
  },
  "next_content": {
    "id": 2,
    "name": "Getting Started"
  },
  "is_finished": false
}
```

### Get Course Completion

**Endpoint:** `GET /api/dashboard/learning/{courseSlug}/finished`

**Headers:** `Authorization: Bearer {token}`

**Note:** Requires active subscription

**Response:** `200 OK`
```json
{
  "message": "Course completed successfully",
  "course": { ... }
}
```

---

## Subscription Endpoints (Student Role Required)

### Get Subscriptions

**Endpoint:** `GET /api/dashboard/subscriptions`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "booking_trx_id": "TRX-123456",
    "user_id": 1,
    "pricing_id": 1,
    "grand_total_amount": 110000,
    "sub_total_amount": 100000,
    "total_tax_amount": 10000,
    "is_paid": true,
    "payment_type": "midtrans",
    "started_at": "2024-01-01T00:00:00.000000Z",
    "ended_at": "2024-01-31T23:59:59.000000Z",
    "is_active": true,
    "pricing": { ... },
    "student": { ... },
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  }
]
```

### Get Subscription Details

**Endpoint:** `GET /api/dashboard/subscription/{transactionId}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "id": 1,
  "booking_trx_id": "TRX-123456",
  "grand_total_amount": 110000,
  "is_paid": true,
  "pricing": { ... },
  "student": { ... }
}
```

---

## Checkout & Payment Endpoints (Student Role Required)

### Get Checkout Data

**Endpoint:** `GET /api/checkout/{pricingId}`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "pricing": {
    "id": 1,
    "name": "Basic Plan",
    "duration": 30,
    "price": 100000
  },
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "sub_total_amount": 100000,
  "total_tax_amount": 10000,
  "grand_total_amount": 110000,
  "started_at": "2024-01-01T00:00:00.000000Z",
  "ended_at": "2024-01-31T23:59:59.000000Z"
}
```

### Process Payment

**Endpoint:** `POST /api/payment/midtrans`

**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "pricing_id": 1
}
```

**Response:** `200 OK`
```json
{
  "message": "Payment processed successfully",
  "transaction": { ... },
  "snap_token": "midtrans-snap-token"
}
```

### Get Checkout Success

**Endpoint:** `GET /api/checkout/success`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`
```json
{
  "message": "Checkout successful",
  "pricing": { ... }
}
```

### Payment Notification (Webhook)

**Endpoint:** `POST /api/payment/midtrans/notification`

**Note:** Public endpoint, no authentication required

**Request:** (Midtrans notification payload)

**Response:** `200 OK`

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Bad request",
  "error": "error_code"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated"
}
```

### 403 Forbidden
```json
{
  "message": "You need an active subscription to proceed.",
  "error": "subscription_required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": [
      "The email field is required."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

### 500 Server Error
```json
{
  "message": "Server error. Please try again later."
}
```

---

## Rate Limiting

Some endpoints have rate limiting:
- Email verification: 6 requests per minute
- Login: Rate limited via LoginRequest

---

## Pagination

Currently, endpoints return all results. Pagination will be added in future versions.

---

## Versioning

Current API version: `v1` (implicit)

Future versions will use `/api/v2/...` format.

