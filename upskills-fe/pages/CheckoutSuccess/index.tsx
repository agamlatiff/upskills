import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import apiClient from "../../utils/api";
import { Pricing } from "../../types/api";
import { TrophyIcon } from "../../components/Icons";
import useAuthStore from "../../store/authStore";

const CheckoutSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const fetchSuccessData = async (retryCount = 0) => {
      try {
        // Check if this is a redirect from Midtrans
        const orderId = searchParams.get("order_id");
        const statusCode = searchParams.get("status_code");
        const transactionStatus = searchParams.get("transaction_status");

        // Build endpoint dengan order_id jika ada
        let endpoint = "/checkout/success";
        if (orderId) {
          endpoint = `/checkout/success?order_id=${encodeURIComponent(orderId)}`;
          if (statusCode) {
            endpoint += `&status_code=${encodeURIComponent(statusCode)}`;
          }
          if (transactionStatus) {
            endpoint += `&transaction_status=${encodeURIComponent(transactionStatus)}`;
          }
        }

        const response = await apiClient.get<{
          data?: { pricing: Pricing };
          pricing?: Pricing;
          message?: string;
          error?: string;
          retry?: boolean;
        }>(endpoint);

        // Handle error response with retry flag
        if (response.data.error) {
          // If backend says to retry and we haven't retried too many times
          if (response.data.retry && retryCount < 5) {
            setError(response.data.error + " Retrying...");
            setTimeout(() => {
              fetchSuccessData(retryCount + 1);
            }, 2000);
            return;
          }

          setError(response.data.error);
          setLoading(false);
          return;
        }

        // Handle both wrapped and unwrapped responses
        const data = (response.data as any)?.data || response.data;
        const pricingData = data.pricing || data;

        if (pricingData) {
          setPricing(pricingData);
          setError(null);
          // Force refresh user data to update subscription status and profile
          // Don't await to avoid blocking UI, let it run in background
          checkAuth(true).catch((err) => {
            // Silently handle error, user data will be refreshed on next navigation
            if (process.env.NODE_ENV === "development") {
              console.error("Failed to refresh user data:", err);
            }
          });
        } else {
          setError("Pricing information not found");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Failed to load checkout success data";

        // If it's a 404 and we have an order_id, try retrying a few times
        if (
          err.response?.status === 404 &&
          searchParams.get("order_id") &&
          retryCount < 3
        ) {
          setError("Transaction is being processed. Please wait...");
          setTimeout(() => {
            fetchSuccessData(retryCount + 1);
          }, 2000);
          return;
        }

        setError(errorMessage);

        // Log error untuk debugging (development only)
        if (process.env.NODE_ENV === "development") {
          console.error("Checkout success error:", {
            error: errorMessage,
            orderId: searchParams.get("order_id"),
            statusCode: searchParams.get("status_code"),
            transactionStatus: searchParams.get("transaction_status"),
            response: err.response?.data,
            retryCount,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessData();
  }, [searchParams]);

  if (loading) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-slate-400">Loading...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !pricing) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">
                Checkout Information Not Found
              </h1>
              <p className="text-red-400 mb-6">
                {error || "Unable to load checkout success information"}
              </p>
              <Link
                to="/dashboard/subscriptions"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View My Subscriptions
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 md:p-12 text-center space-y-8">
            {/* Success Badge */}
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/20 px-4 py-2 flex items-center gap-2">
                <span className="text-2xl">👑</span>
                <p className="font-bold text-sm text-green-400">PRO UNLOCKED</p>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Payment Successful
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                You now have access to the latest course materials as
                preparation for working in the current digital industry era.
                Yay!
              </p>
            </div>

            {/* Subscription Card */}
            <div className="relative bg-slate-900 border border-slate-700 rounded-xl p-6 flex items-center gap-6">
              <div className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop"
                  alt="Success"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-xl font-bold text-white mb-2">
                  Subscription Active:
                  <br />
                  {pricing.name}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center">
                      📅
                    </span>
                    <span>{pricing.duration} Months Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center">
                      💼
                    </span>
                    <span>Job-Ready Skills</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                <TrophyIcon className="h-12 w-12 text-green-500" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                to="/dashboard/subscriptions"
                className="w-full sm:w-auto px-6 py-3 border border-slate-700 rounded-full text-white font-semibold hover:border-blue-500 transition-all text-center"
              >
                My Transactions
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const CheckoutSuccessWithProtection: React.FC = () => (
  <ProtectedRoute>
    <CheckoutSuccess />
  </ProtectedRoute>
);

export default CheckoutSuccessWithProtection;
