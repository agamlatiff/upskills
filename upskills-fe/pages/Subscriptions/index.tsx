import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Transaction } from '../../types/api';

const Subscriptions: React.FC = () => {
  const { subscriptions, loading, error, refetch } = useSubscriptions();

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

  const isActive = (transaction: Transaction) => {
    if (!transaction.is_active) return false;
    const endedAt = new Date(transaction.ended_at);
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
              <p className="mt-4 text-slate-400">Loading subscriptions...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Subscriptions</h2>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">My Subscriptions</h1>
          <p className="text-lg text-slate-400">View and manage your subscription packages.</p>
        </div>

        {subscriptions.length > 0 ? (
          <div className="space-y-4 max-w-5xl">
            {subscriptions.map((transaction: Transaction) => (
              <div
                key={transaction.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center flex-1 gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {transaction.pricing?.name || 'Unknown Package'}
                    </h3>
                    <p className="text-slate-400">
                      {transaction.pricing?.duration || 0} months duration
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 min-w-[120px]">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Price</span>
                  </div>
                  <p className="font-semibold text-white">
                    {formatCurrency(transaction.sub_total_amount)}
                  </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-2 min-w-[150px]">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Started At</span>
                  </div>
                  <p className="font-semibold text-white">{formatDate(transaction.started_at)}</p>
                </div>

                <div className="flex items-center justify-center min-w-[100px]">
                  {isActive(transaction) ? (
                    <span className="font-bold text-xs text-green-400 bg-green-400/20 rounded-full py-2 px-4">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="font-bold text-xs text-red-400 bg-red-400/20 rounded-full py-2 px-4">
                      EXPIRED
                    </span>
                  )}
                </div>

                <Link
                  to={`/dashboard/subscription/${transaction.id}`}
                  className="rounded-full border border-slate-700 py-2.5 px-6 bg-slate-800 hover:border-blue-500 hover:bg-slate-700 transition-all duration-300 text-white font-semibold"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800 border border-slate-700 rounded-2xl">
            <svg
              className="w-16 h-16 text-slate-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">No Subscriptions Yet</h3>
            <p className="text-slate-400 mb-6">You haven't subscribed to any package yet.</p>
            <Link
              to="/pricing"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              View Pricing Plans
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

const SubscriptionsWithProtection: React.FC = () => (
  <ProtectedRoute>
    <Subscriptions />
  </ProtectedRoute>
);

export default SubscriptionsWithProtection;

