import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Testimonial } from '../types/api';

interface UseTestimonialsParams {
  verified?: boolean;
  courseId?: number;
  limit?: number;
}

export const useTestimonials = (params?: UseTestimonialsParams) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (params?.verified !== undefined) {
        queryParams.append('verified', params.verified.toString());
      }
      if (params?.courseId) {
        queryParams.append('course_id', params.courseId.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      const queryString = queryParams.toString();
      const url = `/testimonials${queryString ? `?${queryString}` : ''}`;
      const response = await apiClient.get<{ data: Testimonial[] } | Testimonial[]>(url);
      // Handle both wrapped and unwrapped responses
      const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
      setTestimonials(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [params?.verified, params?.courseId, params?.limit]);

  const createTestimonial = async (testimonialData: {
    quote: string;
    outcome?: string;
    course_id: number;
  }) => {
    try {
      const response = await apiClient.post<Testimonial>('/testimonials', testimonialData);
      const newTestimonial = response.data;
      setTestimonials((prev) => [newTestimonial, ...prev]);
      return newTestimonial;
    } catch (err) {
      throw err;
    }
  };

  const updateTestimonial = async (id: number, testimonialData: {
    quote?: string;
    outcome?: string;
  }) => {
    try {
      const response = await apiClient.put<Testimonial>(`/testimonials/${id}`, testimonialData);
      const updatedTestimonial = response.data;
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? updatedTestimonial : t))
      );
      return updatedTestimonial;
    } catch (err) {
      throw err;
    }
  };

  const deleteTestimonial = async (id: number) => {
    try {
      await apiClient.delete(`/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  };
};

