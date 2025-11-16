import { useState, useEffect } from "react";
import apiClient from "../utils/api";
import { Course } from "../types/api";

export const useMentorCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: Course[] } | Course[]>(
        "/mentor/courses"
      );
      const data = Array.isArray(response.data)
        ? response.data
        : (response.data as any)?.data || [];
      setCourses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (courseData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ course: Course }>(
        "/mentor/courses",
        courseData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await fetchCourses();
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to create course";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (courseId: number, courseData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.put<{ course: Course }>(
        `/mentor/courses/${courseId}`,
        courseData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await fetchCourses();
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update course";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/mentor/courses/${courseId}`);
      await fetchCourses();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete course";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    loading,
    error,
    refetch: fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
};
