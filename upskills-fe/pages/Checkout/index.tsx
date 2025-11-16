import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCheckout, usePayment } from '../../hooks/useCheckout';
import { useAuth } from '../../hooks/useAuth';
import ProtectedRoute from '../../components/ProtectedRoute';
import { TrophyIcon, FilledCheckCircleIcon } from '../../components/Icons';

// Declare Midtrans Snap type
declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const Checkout: React.FC = () => {
  const { pricingId } = useParams<{ pricingId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { checkoutData, loading, error } = useCheckout(pricingId || '');
  const { initiatePayment, loading: paymentLoading, error: paymentError } = usePayment();
  const [midtransLoaded, setMidtransLoaded] = useState(false);

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    script.onload = () => setMidtransLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePayNow = async () => {
    if (!checkoutData?.pricing?.id) {
      alert('Pricing information is missing. Please try again.');
      return;
    }

    if (!midtransLoaded) {
      alert('Payment gateway is still loading. Please wait a moment.');
      return;
    }

    const snapToken = await initiatePayment(checkoutData.pricing.id);
    
    if (!snapToken) {
      alert(paymentError || 'Failed to initiate payment. Please try again.');
      return;
    }

    // Open Midtrans payment popup
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          navigate('/checkout/success');
        },
        onPending: (result) => {
          alert('Payment is pending. Please complete the payment.');
          navigate('/dashboard/subscriptions');
        },
        onError: (result) => {
          alert(`Payment failed: ${result.status_message || 'Unknown error'}`);
        },
        onClose: () => {
          // User closed the popup, do nothing or show a message
        },
      });
    } else {
      alert('Payment gateway is not available. Please refresh the page.');
    }
  };

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
              <p className="mt-4 text-slate-400">Loading checkout details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !checkoutData) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white mb-4">Error Loading Checkout</h1>
              <p className="text-red-400 mb-6">{error || 'Failed to load checkout information'}</p>
              <Link
                to="/pricing"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const planFeatures = [
    'Access All Online Courses',
    'Get Premium Courses',
    'High Quality Work Portfolio',
    'Career Consultation 2025',
    'Support learning 24/7'
  ];

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8 text-slate-400 flex items-center" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/pricing" className="hover:text-white">Pricing Packages</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-500">Checkout Subscription</span>
        </nav>

        {/* Main checkout card */}
        <div className="max-w-6xl mx-auto bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-16">
            {/* Left Column: Details */}
            <div className="lg:col-span-3">
              <h1 className="text-3xl font-bold text-white mb-8">Checkout {checkoutData.pricing.name}</h1>

              {/* Give Access To */}
              <section className="mb-10">
                <h2 className="text-lg font-semibold text-slate-300 mb-4">Give Access to</h2>
                <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    {user?.photo ? (
                      <img src={user.photo} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-700 flex items-center justify-center">
                        <span className="text-white font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-white">{user?.name || checkoutData.user?.name}</p>
                      <p className="text-sm text-slate-400">{user?.occupation || 'Student'}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-opacity">
                    Change Account
                  </Link>
                </div>
              </section>

              {/* Transaction Details */}
              <section>
                <h2 className="text-lg font-semibold text-slate-300 mb-4">Transaction Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📝</span>
                      <span className="text-slate-300">Subscription Package</span>
                    </div>
                    <strong className="font-semibold text-white">{formatCurrency(checkoutData.sub_total_amount)}</strong>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📅</span>
                      <span className="text-slate-300">Access Duration</span>
                    </div>
                    <strong className="font-semibold text-white">{checkoutData.pricing.duration} Months</strong>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📅</span>
                      <span className="text-slate-300">Started At</span>
                    </div>
                    <strong className="font-semibold text-white">{formatDate(checkoutData.started_at)}</strong>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📅</span>
                      <span className="text-slate-300">Ended At</span>
                    </div>
                    <strong className="font-semibold text-white">{formatDate(checkoutData.ended_at)}</strong>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">💰</span>
                      <span className="text-slate-300">PPN 11%</span>
                    </div>
                    <strong className="font-semibold text-white">{formatCurrency(checkoutData.total_tax_amount)}</strong>
                  </div>
                  <div className="flex items-center justify-between py-4 border-t-2 border-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">💳</span>
                      <span className="text-lg font-bold text-white">Grand Total</span>
                    </div>
                    <strong className="font-bold text-2xl text-green-400">
                      {formatCurrency(checkoutData.grand_total_amount)}
                    </strong>
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="mt-10 flex items-center gap-4">
                <Link
                  to="/pricing"
                  className="w-full px-6 py-3 text-center font-semibold text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handlePayNow}
                  disabled={paymentLoading || !midtransLoaded}
                  className="w-full px-6 py-3 text-center font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
              {paymentError && (
                <p className="mt-4 text-sm text-red-400 text-center">{paymentError}</p>
              )}
              <p className="text-center text-xs text-slate-400 mt-4">
                By proceeding you agree to our Terms & Conditions.
              </p>
            </div>

            {/* Right Column: Plan Card */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700 h-full">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop"
                    alt="Team collaborating"
                    className="rounded-xl w-full h-48 object-cover"
                  />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center">
                      <TrophyIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{checkoutData.pricing.name}</h3>
                      <p className="text-sm text-slate-400">{checkoutData.pricing.duration} months duration</p>
                    </div>
                  </div>
                </div>
                <ul className="mt-16 space-y-3">
                  {planFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <FilledCheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const CheckoutWithProtection: React.FC = () => (
  <ProtectedRoute>
    <Checkout />
  </ProtectedRoute>
);

export default CheckoutWithProtection;
