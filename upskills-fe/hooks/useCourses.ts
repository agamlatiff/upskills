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
      const response = await apiClient.get<CoursesByCategory[]>('/courses');
      setCourses(response.data);
    } catch (err: any) {
      // Show user-friendly error message
      const errorMessage = err.response?.data?.message || '';
      if (errorMessage.includes('SQLSTATE') || errorMessage.includes('SQL:') || errorMessage.includes("doesn't exist")) {
        setError('Unable to load courses at the moment. Please try again later.');
      } else {
        setError(errorMessage || 'Unable to load courses. Please try again.');
      }
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
      const response = await apiClient.get<{ data: Course } | Course>(`/courses/${slug}`);
      // Handle both wrapped and unwrapped responses
      const data = (response.data as any)?.data || response.data;
      setCourse(data);
    } catch (err: any) {
      // Show user-friendly error message
      const errorMessage = err.response?.data?.message || '';
      if (errorMessage.includes('SQLSTATE') || errorMessage.includes('SQL:') || errorMessage.includes("doesn't exist")) {
        setError('Unable to load course details. Please try again later.');
      } else {
        setError(errorMessage || 'Unable to load course. Please try again.');
      }
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
        '/courses/search',
        { params: { search: keyword } }
      );
      // Handle both wrapped and unwrapped responses
      const data = response.data;
      const coursesData = Array.isArray(data.courses) 
        ? data.courses 
        : (data as any)?.data?.courses || [];
      setCourses(coursesData);
    } catch (err: any) {
      // Show user-friendly error message
      const errorMessage = err.response?.data?.message || '';
      if (errorMessage.includes('SQLSTATE') || errorMessage.includes('SQL:') || errorMessage.includes("doesn't exist")) {
        setError('Unable to search courses at the moment. Please try again later.');
      } else {
        setError(errorMessage || 'Unable to search courses. Please try again.');
      }
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

