<?php

namespace App\Services;

use App\Helpers\TransactionHelper;
use App\Models\Pricing;
use App\Repositories\PricingRepositoryInterface;
use App\Repositories\TransactionRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class PaymentService
{
  public function __construct(
    protected MidtransService $midtransService,
    protected PricingRepositoryInterface $pricingRepository,
    protected TransactionRepositoryInterface $transactionRepository
  ) {
  }

  public function createPayment(int $pricingId)
  {
    $user = Auth::user();
    // $pricing = Pricing::findOrFail($pricingId);
    $pricing = $this->pricingRepository->findById($pricingId);


    $tax = 0.11;
    $totalTax = $pricing->price * $tax;
    $grandTotal = $pricing->price + $totalTax;

    // Get frontend URL from environment or use default
    // Priority: FRONTEND_URL > APP_URL > localhost:3000
    $frontendUrl = env('FRONTEND_URL');

    if (!$frontendUrl) {
      // Fallback to APP_URL if FRONTEND_URL not set
      $frontendUrl = env('APP_URL', 'http://localhost:3000');
    }

    // Remove trailing slash
    $frontendUrl = rtrim($frontendUrl, '/');

    // Log untuk debugging
    Log::info('Frontend URL used for Midtrans callback', [
      'frontend_url' => $frontendUrl,
      'env_frontend_url' => env('FRONTEND_URL'),
      'env_app_url' => env('APP_URL'),
      'user_id' => $user->id
    ]);

    // Validate URL - jangan sampai pakai example.com atau URL invalid
    if (str_contains($frontendUrl, 'example.com') || empty($frontendUrl)) {
      Log::error('Invalid FRONTEND_URL detected!', [
        'frontend_url' => $frontendUrl,
        'falling_back_to' => 'http://localhost:3000'
      ]);
      $frontendUrl = 'http://localhost:3000';
    }

    $orderId = TransactionHelper::generateUniqueTrxId();

    // Simpan mapping order_id -> pricing_id ke cache (expire 1 jam)
    // Ini untuk fallback jika webhook tidak memproses transaksi
    Cache::put("order_pricing_{$orderId}", $pricingId, 3600);

    Log::info('Order pricing mapping cached', [
      'order_id' => $orderId,
      'pricing_id' => $pricingId,
      'user_id' => $user->id
    ]);

    $params = [
      "transaction_details" => [
        "order_id" => $orderId,
        "gross_amount" => (int) $grandTotal,
      ],
      "customer_details" => [
        "first_name" => $user->name,
        "email" => $user->email,
        "phone" => "081241247314"
      ],
      "item_details" => [
        [
          "id" => $pricing->id,
          "price" => (int) $pricing->price,
          "quantity" => 1,
          "name" => $pricing->name,
        ],
        [
          "id" => "tax",
          "price" => (int) $totalTax,
          "quantity" => 1,
          "name" => "PPN 11%"
        ]
      ],
      "custom_field1" => $user->id,
      "custom_field2" => $pricingId,
      "callbacks" => [
        "finish" => $frontendUrl . "/checkout/success",
        "unfinish" => $frontendUrl . "/checkout/success",
        "error" => $frontendUrl . "/pricing?error=payment_failed"
      ]
    ];

    return $this->midtransService->createSnapToken($params);
  }

  public function handlePaymentService()
  {
    $notification = $this->midtransService->handleNotification();

    if (in_array($notification["transaction_status"], ["capture", "settlement"])) {
      // $pricing = Pricing::findOrFail($notification["custom_field2"]);
      $pricing = $this->pricingRepository->findById($notification["custom_field2"]);

      $this->createTransaction($notification, $pricing);
    }

    return $notification["transaction_status"];
  }

  protected function createTransaction(array $notification, Pricing $pricing)
  {
    $startedAt = now()->startOfDay();
    $endedAt = $startedAt->copy()->addMonths($pricing->duration)->endOfDay();

    $transactionData = [
      "user_id" => $notification["custom_field1"],
      "pricing_id" => $notification["custom_field2"],
      "sub_total_amount" => $pricing->price,
      "total_tax_amount" => $pricing->price * 0.11,
      "grand_total_amount" => $notification["gross_amount"],
      "payment_type" => "Midtrans",
      "is_paid" => true,
      "booking_trx_id" => $notification["order_id"],
      "started_at" => $startedAt,
      "ended_at" => $endedAt,
    ];

    $this->transactionRepository->create($transactionData);

    Log::info("Transaction created successfully: " . $notification["order_id"]);
  }

}