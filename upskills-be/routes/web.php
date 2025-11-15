<?php

use App\Http\Controllers\FrontController;
use Illuminate\Support\Facades\Route;

// Payment notification webhook (public, no auth required)
Route::match(["get", "post"], "/booking/payment/midtrans/notification", [FrontController::class, "paymentMidtransNotification"])
    ->name("front.payment_midtrans_notification");

// All other routes are handled by React frontend via API routes
// Web routes are kept minimal - only for webhooks and legacy support
