import { useState } from 'react';
import apiClient from '../utils/api';

export const useCourseCompletion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markAsComplete = async (courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/courses/${courseId}/complete`);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to mark course as complete';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkCompletion = async (courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/courses/${courseId}/completion-status`);
      return response.data.completed as boolean;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to check completion status';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getCompletedCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/user/completed-courses');
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch completed courses';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    markAsComplete,
    checkCompletion,
    getCompletedCourses,
    loading,
    error,
  };
};

