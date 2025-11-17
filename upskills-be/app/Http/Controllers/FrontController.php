<?php

namespace App\Http\Controllers;

use App\Http\Resources\PricingResource;
use App\Http\Resources\TransactionResource;
use App\Models\Pricing;
use App\Models\Transaction;
use App\Services\PaymentService;
use App\Services\PricingService;
use App\Services\TransactionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class FrontController extends Controller
{

    public function __construct(
        protected PaymentService $paymentService,
        protected TransactionService $transactionService,
        protected PricingService $pricingService
    ) {
    }
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Welcome to UpSkills API',
            'version' => '1.0'
        ]);
    }

    public function pricing(Request $request)
    {
        $pricing_packages = $this->pricingService->getAllPackages();
        return PricingResource::collection($pricing_packages);
    }

    public function checkout(Request $request, Pricing $pricing)
    {
        $checkoutData = $this->transactionService->prepareCheckout($pricing);

        if ($checkoutData["alreadySubscribed"]) {
            return response()->json([
                'error' => 'You are already subscribed to this plan.'
            ], 400);
        }

        return response()->json([
            'pricing' => new PricingResource($checkoutData['pricing']),
            'user' => $checkoutData['user'] ? [
                'id' => $checkoutData['user']->id,
                'name' => $checkoutData['user']->name,
                'email' => $checkoutData['user']->email,
            ] : null,
            'sub_total_amount' => $checkoutData['sub_total_amount'],
            'total_tax_amount' => $checkoutData['total_tax_amount'],
            'grand_total_amount' => $checkoutData['grand_total_amount'],
            'started_at' => $checkoutData['started_at'],
            'ended_at' => $checkoutData['ended_at'],
        ]);
    }

    public function paymentStoreMidtrans(Request $request)
    {
        try {
            // Accept pricing_id from request body
            $pricingId = $request->input('pricing_id');

            if (!$pricingId) {
                return response()->json(
                    ["error" => "No pricing data found. Please provide pricing_id."],
                    400
                );
            }

            $snapToken = $this->paymentService->createPayment($pricingId);

            if (!$snapToken) {
                return response()->json([
                    "error" => "Failed to create Midtrans transactions"
                ], 500);
            }

            return response()->json(["snap_token" => $snapToken], 200);
        } catch (Exception $error) {
            return response()->json(
                ["error" => "Payment Failed: " . $error->getMessage()],
                500
            );
        }
    }

    public function paymentMidtransNotification(Request $request)
    {
        try {
            $transactionStatus = $this->paymentService->handlePaymentService();

            if (!$transactionStatus) {
                return response()->json(["error" => "Invalid notitfication data."], 400);
            }

            return response()->json(["status" => $transactionStatus], 200);
        } catch (Exception $error) {
            Log::error("Failed to handle midtrans notification:", ["error" => $error->getMessage()]);

            return response()->json([
                "error" => "Failed to handle midtrans notification."
            ], 500);
        }
    }

    public function checkoutSuccess(Request $request)
    {
        try {
            $orderId = $request->query('order_id');
            $userId = Auth::id();
            $transactionStatus = $request->query('transaction_status');
            $statusCode = $request->query('status_code');
            $grossAmount = $request->query('gross_amount');

            Log::info('Checkout success endpoint called', [
                'order_id' => $orderId,
                'user_id' => $userId,
                'transaction_status' => $transactionStatus,
                'status_code' => $statusCode,
                'all_params' => $request->all()
            ]);

        // Jika ada order_id, cari transaksi berdasarkan order_id
        if ($orderId) {
            // Retry logic: tunggu webhook proses (max 5 detik)
            $maxRetries = 10;
            $retryDelay = 500000; // 0.5 detik
            
            for ($attempt = 0; $attempt < $maxRetries; $attempt++) {
                $transaction = Transaction::where('booking_trx_id', $orderId)
                    ->where('user_id', $userId)
                    ->with('pricing')
                    ->first();

                if ($transaction && $transaction->pricing) {
                    return response()->json([
                        'message' => 'Checkout successful',
                        'pricing' => new PricingResource($transaction->pricing)
                    ]);
                }

                if ($attempt < $maxRetries - 1) {
                    usleep($retryDelay);
                }
            }

            // FALLBACK: Buat transaksi langsung jika status capture/settlement
            if (in_array($transactionStatus, ['capture', 'settlement']) && $statusCode == '200') {
                try {
                    Log::info('Attempting fallback transaction creation', [
                        'order_id' => $orderId,
                        'user_id' => $userId,
                        'status' => $transactionStatus
                    ]);
                    
                    $pricingId = Cache::get("order_pricing_{$orderId}");
                    
                    Log::info('Cache lookup result', [
                        'order_id' => $orderId,
                        'pricing_id_from_cache' => $pricingId,
                        'cache_key' => "order_pricing_{$orderId}"
                    ]);
                    
                    if ($pricingId) {
                        $pricing = Pricing::find($pricingId);
                        
                        if ($pricing) {
                            // Cek apakah transaksi sudah ada
                            $existingTransaction = Transaction::where('booking_trx_id', $orderId)->first();
                            
                            if (!$existingTransaction) {
                                // Buat transaksi baru
                                $startedAt = now()->startOfDay();
                                $endedAt = $startedAt->copy()->addMonths($pricing->duration)->endOfDay();
                                
                                $newTransaction = Transaction::create([
                                    "user_id" => $userId,
                                    "pricing_id" => $pricingId,
                                    "sub_total_amount" => $pricing->price,
                                    "total_tax_amount" => $pricing->price * 0.11,
                                    "grand_total_amount" => $grossAmount ? (int)$grossAmount : (int)($pricing->price * 1.11),
                                    "payment_type" => "Midtrans",
                                    "is_paid" => true,
                                    "booking_trx_id" => $orderId,
                                    "started_at" => $startedAt,
                                    "ended_at" => $endedAt,
                                ]);
                                
                                Log::info('Transaction created via fallback', [
                                    'order_id' => $orderId,
                                    'transaction_id' => $newTransaction->id,
                                    'user_id' => $userId,
                                    'pricing_id' => $pricingId
                                ]);
                                
                                Cache::forget("order_pricing_{$orderId}");
                                $newTransaction->load('pricing');
                                
                                return response()->json([
                                    'message' => 'Checkout successful',
                                    'pricing' => new PricingResource($newTransaction->pricing)
                                ]);
                            } else {
                                // Transaksi sudah ada, gunakan yang existing
                                Log::info('Transaction already exists, using existing', [
                                    'order_id' => $orderId,
                                    'transaction_id' => $existingTransaction->id
                                ]);
                                $existingTransaction->load('pricing');
                                return response()->json([
                                    'message' => 'Checkout successful',
                                    'pricing' => new PricingResource($existingTransaction->pricing)
                                ]);
                            }
                        } else {
                            Log::warning('Pricing not found for cached pricing_id', [
                                'order_id' => $orderId,
                                'pricing_id' => $pricingId
                            ]);
                        }
                    } else {
                        Log::warning('No pricing_id found in cache for fallback', [
                            'order_id' => $orderId,
                            'user_id' => $userId
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Fallback transaction creation failed', [
                        'error' => $e->getMessage(),
                        'order_id' => $orderId,
                        'user_id' => $userId,
                        'trace' => $e->getTraceAsString()
                    ]);
                }
            } else {
                Log::info('Fallback skipped - invalid status', [
                    'order_id' => $orderId,
                    'transaction_status' => $transactionStatus,
                    'status_code' => $statusCode
                ]);
            }

            // Fallback: cari transaksi terbaru user
            $recentTransaction = Transaction::where('user_id', $userId)
                ->where('is_paid', true)
                ->with('pricing')
                ->orderBy('created_at', 'desc')
                ->first();

            if ($recentTransaction && $recentTransaction->pricing) {
                return response()->json([
                    'message' => 'Checkout successful',
                    'pricing' => new PricingResource($recentTransaction->pricing)
                ]);
            }
        }

        // Fallback: cari transaksi terbaru user (jika order_id tidak ada atau tidak ditemukan)
        $recentTransaction = Transaction::where('user_id', $userId)
            ->where('is_paid', true)
            ->with('pricing')
            ->orderBy('created_at', 'desc')
            ->first();

        if ($recentTransaction && $recentTransaction->pricing) {
            Log::info('Using recent transaction as fallback', [
                'order_id' => $orderId,
                'found_transaction_id' => $recentTransaction->id,
                'user_id' => $userId
            ]);
            
            return response()->json([
                'message' => 'Checkout successful',
                'pricing' => new PricingResource($recentTransaction->pricing)
            ]);
        }

        // Fallback terakhir: cek session (backward compatibility) - hanya jika session ada
        try {
            $pricingIdFromSession = session()->get('pricing_id');
            if ($pricingIdFromSession) {
                $pricing = Pricing::find($pricingIdFromSession);
                if ($pricing) {
                    return response()->json([
                        'message' => 'Checkout successful',
                        'pricing' => new PricingResource($pricing)
                    ]);
                }
            }
        } catch (\Exception $e) {
            Log::warning('Session fallback failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId
            ]);
        }

        Log::warning('No transaction found after all fallbacks', [
            'order_id' => $orderId,
            'user_id' => $userId,
            'transaction_status' => $transactionStatus,
            'status_code' => $statusCode,
            'has_cache' => $orderId ? !is_null(Cache::get("order_pricing_{$orderId}")) : false,
            'has_recent_transaction' => $recentTransaction ? true : false
        ]);

        // Return 200 dengan retry flag (bukan 404) agar frontend bisa handle retry
        return response()->json([
            'error' => 'Transaction is being processed. Please wait a moment and refresh the page, or check your subscriptions page.',
            'retry' => true,
            'order_id' => $orderId
        ], 200);
        } catch (\Exception $e) {
            Log::error('Checkout success endpoint error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'order_id' => $request->query('order_id'),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'error' => 'An error occurred while processing your checkout. Please try again or contact support.',
                'retry' => false
            ], 500);
        }
    }

}
