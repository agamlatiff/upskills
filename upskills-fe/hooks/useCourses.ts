import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Course, CoursesByCategory } from '../types/api';

export const useCourses = () => {
  const [courses, setCourses] = useState<CoursesByCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<CoursesByCategory[]>('/dashboard/courses');
      setCourses(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
  };
};

export const useCourse = (slug: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Course } | Course>(`/dashboard/courses/${slug}`);
      // Handle both wrapped and unwrapped responses
      const data = (response.data as any)?.data || response.data;
      setCourse(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch course');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  return {
    course,
    loading,
    error,
    refetch: fetchCourse,
  };
};

export const useSearchCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCourses = async (keyword: string) => {
    if (!keyword.trim()) {
      setCourses([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ keyword: string; courses: Course[] }>(
        '/dashboard/search/courses',
        { params: { search: keyword } }
      );
      // Handle both wrapped and unwrapped responses
      const data = response.data;
      const coursesData = Array.isArray(data.courses) 
        ? data.courses 
        : (data as any)?.data?.courses || [];
      setCourses(coursesData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    loading,
    error,
    searchCourses,
  };
};

export default useCourses;

