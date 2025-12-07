import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Pricing } from '../types/api';
import useCacheStore from '../store/cacheStore';

export const usePricing = () => {
  const [pricingPlans, setPricingPlans] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getPricingPlans: getCachedPricing, setPricingPlans: cachePricing } = useCacheStore();

  const fetchPricing = async (forceRefresh = false) => {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = getCachedPricing();
      if (cached) {
        setPricingPlans(cached);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Pricing[] } | Pricing[]>('/pricing');
      // Handle both wrapped and unwrapped responses
      const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
      setPricingPlans(data);
      // Update cache
      cachePricing(data);
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
    refetch: () => fetchPricing(true),
  };
};

