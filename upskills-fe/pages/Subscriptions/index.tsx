import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSubscriptions } from '../../hooks/useSubscriptions';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Transaction } from '../../types/api';

type FilterType = 'all' | 'active' | 'expired';

const Subscriptions: React.FC = () => {
  const { subscriptions, loading, error, refetch } = useSubscriptions();
  const [filter, setFilter] = useState<FilterType>('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isActive = (transaction: Transaction) => {
    if (!transaction.is_paid) return false;
    const endedAt = new Date(transaction.ended_at);
    const now = new Date();
    return endedAt > now;
  };

  const getDaysRemaining = (endedAt: string) => {
    const end = new Date(endedAt);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const total = subscriptions.length;
    const active = subscriptions.filter((t) => isActive(t)).length;
    const expired = subscriptions.filter((t) => !isActive(t) && t.is_paid).length;
    const totalSpent = subscriptions
      .filter((t) => t.is_paid)
      .reduce((sum, t) => sum + t.grand_total_amount, 0);

    return { total, active, expired, totalSpent };
  }, [subscriptions]);

  // Filter transactions
  const filteredSubscriptions = useMemo(() => {
    let filtered = [...subscriptions];

    if (filter === 'active') {
      filtered = filtered.filter((t) => isActive(t));
    } else if (filter === 'expired') {
      filtered = filtered.filter((t) => !isActive(t) && t.is_paid);
    }

    // Sort by created_at descending (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }, [subscriptions, filter]);

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
              <p className="mt-4 text-slate-400">Loading subscription history...</p>
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
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">Subscription History</h1>
          <p className="text-lg text-slate-400">Track and manage all your subscription packages.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Subscriptions</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Active Subscriptions</p>
                <p className="text-3xl font-bold text-green-400">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Expired</p>
                <p className="text-3xl font-bold text-red-400">{stats.expired}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSpent)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-700">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-semibold transition-colors ${
              filter === 'all'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 font-semibold transition-colors ${
              filter === 'active'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`px-4 py-2 font-semibold transition-colors ${
              filter === 'expired'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Expired ({stats.expired})
          </button>
        </div>

        {/* Subscription List */}
        {filteredSubscriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredSubscriptions.map((transaction: Transaction) => {
              const active = isActive(transaction);
              const daysRemaining = active ? getDaysRemaining(transaction.ended_at) : 0;

              return (
                <div
                  key={transaction.id}
                  className={`bg-slate-800 border rounded-2xl p-6 hover:border-blue-500 transition-all ${
                    active ? 'border-green-500/50' : 'border-slate-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left Section - Package Info */}
                    <div className="flex-1 flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                        active ? 'bg-green-500/20' : 'bg-slate-700'
                      }`}>
                        {active ? (
                          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {transaction.pricing?.name || 'Unknown Package'}
                          </h3>
                          <span
                            className={`text-xs font-bold rounded-full py-1 px-3 ${
                              active
                                ? 'text-green-400 bg-green-400/20'
                                : transaction.is_paid
                                ? 'text-red-400 bg-red-400/20'
                                : 'text-yellow-400 bg-yellow-400/20'
                            }`}
                          >
                            {active
                              ? 'ACTIVE'
                              : transaction.is_paid
                              ? 'EXPIRED'
                              : 'PENDING'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {transaction.pricing?.duration || 0} months
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Started: {formatDate(transaction.started_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Ends: {formatDate(transaction.ended_at)}
                          </span>
                          {active && daysRemaining > 0 && (
                            <span className="flex items-center gap-1 text-green-400 font-semibold">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {daysRemaining} days remaining
                            </span>
                          )}
                        </div>
                        {transaction.booking_trx_id && (
                          <p className="text-xs text-slate-500 mt-2">
                            Transaction ID: {transaction.booking_trx_id}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Price & Actions */}
                    <div className="flex flex-col lg:items-end gap-4 min-w-[200px]">
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(transaction.grand_total_amount)}
                        </p>
                        {transaction.payment_type && (
                          <p className="text-xs text-slate-500 mt-1">
                            Paid via {transaction.payment_type}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/dashboard/subscription/${transaction.id}`}
                        className="w-full lg:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <h3 className="text-2xl font-bold text-white mb-2">
              {filter === 'active'
                ? 'No Active Subscriptions'
                : filter === 'expired'
                ? 'No Expired Subscriptions'
                : 'No Subscriptions Yet'}
            </h3>
            <p className="text-slate-400 mb-6">
              {filter === 'all'
                ? "You haven't subscribed to any package yet."
                : `You don't have any ${filter} subscriptions.`}
            </p>
            {filter === 'all' && (
              <Link
                to="/pricing"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                View Pricing Plans
              </Link>
            )}
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
