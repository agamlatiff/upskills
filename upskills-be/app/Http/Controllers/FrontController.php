<?php

namespace App\Http\Controllers;

use App\Http\Resources\PricingResource;
use App\Http\Resources\TransactionResource;
use App\Models\Pricing;
use App\Services\PaymentService;
use App\Services\PricingService;
use App\Services\TransactionService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $pricing = $this->transactionService->getRecentPricing();

        if (!$pricing) {
            return response()->json([
                'error' => 'No recent subscription found.'
            ], 404);
        }

        return response()->json([
            'message' => 'Checkout successful',
            'pricing' => new PricingResource($pricing)
        ]);
    }

}
