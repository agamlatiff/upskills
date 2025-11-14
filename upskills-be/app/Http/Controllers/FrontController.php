<?php

namespace App\Http\Controllers;

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
    public function index()
    {
        return view("front.index");
    }

    public function pricing()
    {
        $pricing_packages = $this->pricingService->getAllPackages();
        $user = Auth::user();
        return view("front.pricing", compact("pricing_packages", "user"));
    }

    public function checkout(Pricing $pricing)
    {
        $checkoutData = $this->transactionService->prepareCheckout($pricing);

        if ($checkoutData["alreadySubscribed"]) {
            return redirect()->route("front.pricing")->with("error", "You are already subscribed to this plan.");
        }

        return view("front.checkout", $checkoutData);
    }

    public function paymentStoreMidtrans()
    {
        try {
            $pricingId = session()->get("pricing_id");
            if (!$pricingId) {
                return response()->json(
                    ["error" => "No pricing data found in the session"],
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
                ["error" => "Payment Failed: " . $error->getMessage(), 500]
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

    public function checkoutSuccess()
    {
        $pricing = $this->transactionService->getRecentPricing();

        if (!$pricing) {
            return redirect()->route("front.pricing")->with("error", "No recent subscription found.");
        }

        return view("front.checkout_success", compact("pricing"));
        
    }

}
