import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Transaction } from '../types/api';

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = async () => {
    // Check if user is authenticated before fetching
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Transaction[] } | Transaction[]>('/dashboard/subscriptions');
      // Laravel Resource collections wrap data in a 'data' key
      const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
      setSubscriptions(data);
    } catch (err: any) {
      // If 401 or 403, user is not authenticated or doesn't have access
      if (err.response?.status === 401 || err.response?.status === 403) {
        setSubscriptions([]);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch subscriptions');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return {
    subscriptions,
    loading,
    error,
    refetch: fetchSubscriptions,
  };
};

export const useSubscriptionDetails = (transactionId: string | number) => {
  const [subscription, setSubscription] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Transaction } | Transaction>(`/dashboard/subscription/${transactionId}`);
      // Handle both wrapped and unwrapped responses
      const data = (response.data as any)?.data || response.data;
      setSubscription(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch subscription details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      fetchSubscriptionDetails();
    }
  }, [transactionId]);

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscriptionDetails,
  };
};

