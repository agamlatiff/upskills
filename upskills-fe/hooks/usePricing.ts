import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Pricing } from '../types/api';

export const usePricing = () => {
  const [pricingPlans, setPricingPlans] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPricing = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Pricing[] } | Pricing[]>('/pricing');
      // Handle both wrapped and unwrapped responses
      const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
      setPricingPlans(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch pricing plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  return {
    pricingPlans,
    loading,
    error,
    refetch: fetchPricing,
  };
};

