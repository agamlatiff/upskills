import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Pricing } from '../types/api';

interface CheckoutData {
  pricing: Pricing;
  user: {
    id: number;
    name: string;
    email: string;
  } | null;
  sub_total_amount: number;
  total_tax_amount: number;
  grand_total_amount: number;
  started_at: string;
  ended_at: string;
}

export const useCheckout = (pricingId: string | number) => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCheckoutData = async () => {
    if (!pricingId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: CheckoutData } | CheckoutData>(
        `/checkout/${pricingId}`
      );
      // Handle both wrapped and unwrapped responses
      const data = (response.data as any)?.data || response.data;
      setCheckoutData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutData();
  }, [pricingId]);

  return {
    checkoutData,
    loading,
    error,
    refetch: fetchCheckoutData,
  };
};

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (pricingId: number): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      // The backend expects pricing_id in session, but for API we'll send it in the request body
      // However, looking at the backend code, it uses session. Let's try sending it in body first
      const response = await apiClient.post<{ snap_token: string } | { error: string }>('/payment/midtrans', {
        pricing_id: pricingId,
      });
      
      if ('error' in response.data) {
        setError(response.data.error);
        return null;
      }
      
      return (response.data as { snap_token: string }).snap_token;
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to initiate payment');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
};

