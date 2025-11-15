<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FrontController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/front', [FrontController::class, 'index'])->name('api.front.index');
Route::get('/pricing', [FrontController::class, 'pricing'])->name('api.pricing');

// Payment notification (public webhook)
Route::match(['get', 'post'], '/payment/midtrans/notification', [FrontController::class, 'paymentMidtransNotification'])
    ->name('api.payment.midtrans.notification');

// Authentication routes (guest only)
Route::middleware('guest')->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('api.register');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('api.login');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('api.password.email');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('api.password.store');
});

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // User profile
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('api.profile.show');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('api.profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('api.profile.destroy');
    
    // Password management
    Route::put('/password', [PasswordController::class, 'update'])->name('api.password.update');
    Route::post('/confirm-password', [ConfirmablePasswordController::class, 'store'])->name('api.password.confirm');
    
    // Email verification
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('api.verification.verify');
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('api.verification.send');
    
    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('api.logout');
    
    // Student routes
    Route::middleware('role:student')->group(function () {
        // Dashboard courses
        Route::get('/dashboard/courses', [CourseController::class, 'index'])->name('api.dashboard.courses');
        Route::get('/dashboard/courses/{course:slug}', [CourseController::class, 'details'])->name('api.dashboard.courses.details');
        Route::get('/dashboard/search/courses', [CourseController::class, 'search_courses'])->name('api.dashboard.search.courses');
        
        // Subscriptions
        Route::get('/dashboard/subscriptions', [DashboardController::class, 'subscriptions'])->name('api.dashboard.subscriptions');
        Route::get('/dashboard/subscription/{transaction}', [DashboardController::class, 'subscription_details'])->name('api.dashboard.subscription.details');
        
        // Checkout
        Route::get('/checkout/{pricing}', [FrontController::class, 'checkout'])->name('api.checkout');
        Route::get('/checkout/success', [FrontController::class, 'checkoutSuccess'])->name('api.checkout.success');
        Route::post('/payment/midtrans', [FrontController::class, 'paymentStoreMidtrans'])->name('api.payment.midtrans');
        
        // Course learning (requires active subscription)
        Route::middleware('check.subscription')->group(function () {
            Route::post('/dashboard/join/{course:slug}', [CourseController::class, 'join'])->name('api.dashboard.courses.join');
            Route::get('/dashboard/learning/{course:slug}/{courseSection}/{sectionContent}', [CourseController::class, 'learning'])->name('api.dashboard.courses.learning');
            Route::get('/dashboard/learning/{course:slug}/finished', [CourseController::class, 'learning_finished'])->name('api.dashboard.courses.learning.finished');
        });
    });
});
