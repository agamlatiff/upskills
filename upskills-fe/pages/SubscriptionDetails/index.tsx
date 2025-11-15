import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSubscriptionDetails } from '../../hooks/useSubscriptions';
import ProtectedRoute from '../../components/ProtectedRoute';

const SubscriptionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subscription, loading, error } = useSubscriptionDetails(id || '');

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
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isActive = () => {
    if (!subscription?.is_active) return false;
    const endedAt = new Date(subscription.ended_at);
    const now = new Date();
    return endedAt > now;
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
              <p className="mt-4 text-slate-400">Loading subscription details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !subscription) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Subscription Not Found</h2>
            <p className="text-red-400 mb-6">{error || 'The subscription you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/dashboard/subscriptions')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Subscriptions
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard/subscriptions')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Subscriptions
          </button>
          <h1 className="text-4xl font-extrabold text-white mb-2">Subscription Details</h1>
          <p className="text-lg text-slate-400">View detailed information about your subscription.</p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">
              {subscription.pricing?.name || 'Unknown Package'}
            </h2>
            {isActive() ? (
              <span className="font-bold text-sm text-green-400 bg-green-400/20 rounded-full py-2 px-4">
                ACTIVE
              </span>
            ) : (
              <span className="font-bold text-sm text-red-400 bg-red-400/20 rounded-full py-2 px-4">
                EXPIRED
              </span>
            )}
          </div>

          {/* Package Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Package Duration</h3>
              <p className="text-lg font-semibold text-white">
                {subscription.pricing?.duration || 0} months
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Transaction ID</h3>
              <p className="text-lg font-semibold text-white font-mono">
                {subscription.booking_trx_id}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Started At</h3>
              <p className="text-lg font-semibold text-white">{formatDate(subscription.started_at)}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Ends At</h3>
              <p className="text-lg font-semibold text-white">{formatDate(subscription.ended_at)}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="pt-6 border-t border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Payment Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sub Total</span>
                <span className="text-white font-semibold">
                  {formatCurrency(subscription.sub_total_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tax</span>
                <span className="text-white font-semibold">
                  {formatCurrency(subscription.total_tax_amount)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                <span className="text-lg font-bold text-white">Grand Total</span>
                <span className="text-lg font-bold text-blue-500">
                  {formatCurrency(subscription.grand_total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="pt-6 border-t border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Payment Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Payment Status</span>
                <span
                  className={`font-semibold ${
                    subscription.is_paid ? 'text-green-400' : 'text-yellow-400'
                  }`}
                >
                  {subscription.is_paid ? 'Paid' : 'Pending'}
                </span>
              </div>
              {subscription.payment_type && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payment Method</span>
                  <span className="text-white font-semibold">{subscription.payment_type}</span>
                </div>
              )}
              {subscription.proof && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Proof of Payment</span>
                  <a
                    href={subscription.proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    View Proof
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-700 flex gap-4">
            <Link
              to="/dashboard"
              className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/pricing"
              className="flex-1 text-center px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-semibold"
            >
              View Plans
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

const SubscriptionDetailsWithProtection: React.FC = () => (
  <ProtectedRoute>
    <SubscriptionDetails />
  </ProtectedRoute>
);

export default SubscriptionDetailsWithProtection;

