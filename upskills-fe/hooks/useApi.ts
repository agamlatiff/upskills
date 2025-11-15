import { useState, useCallback } from 'react';
import apiClient from '../utils/api';
import { AxiosError } from 'axios';
import { ApiError } from '../types/api';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export const useApi = <T = any>(options?: UseApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (
      method: 'get' | 'post' | 'put' | 'patch' | 'delete',
      url: string,
      payload?: any,
      config?: any
    ) => {
      setLoading(true);
      setError(null);

      try {
        let response;
        switch (method) {
          case 'get':
            response = await apiClient.get<T>(url, config);
            break;
          case 'post':
            response = await apiClient.post<T>(url, payload, config);
            break;
          case 'put':
            response = await apiClient.put<T>(url, payload, config);
            break;
          case 'patch':
            response = await apiClient.patch<T>(url, payload, config);
            break;
          case 'delete':
            response = await apiClient.delete<T>(url, config);
            break;
        }

        const responseData = response.data;
        setData(responseData);
        
        if (options?.onSuccess) {
          options.onSuccess(responseData);
        }

        return responseData;
      } catch (err) {
        const axiosError = err as AxiosError<ApiError>;
        const apiError: ApiError = {
          message: axiosError.response?.data?.message || axiosError.message || 'An error occurred',
          error: axiosError.response?.data?.error,
          errors: axiosError.response?.data?.errors,
        };

        setError(apiError);
        
        if (options?.onError) {
          options.onError(apiError);
        }

        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export default useApi;

