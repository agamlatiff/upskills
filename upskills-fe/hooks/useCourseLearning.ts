import { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { Course } from '../types/api';

interface LearningData {
  course: Course;
  current_section: {
    id: number;
    name: string;
    position: number;
  } | null;
  current_content: {
    id: number;
    name: string;
    content: string;
  } | null;
  next_content: {
    id: number;
    name: string;
    course_section_id?: number;
  } | null;
  is_finished: boolean;
}

export const useCourseLearning = (courseSlug: string, sectionId: string, contentId: string) => {
  const [learningData, setLearningData] = useState<LearningData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLearningData = async () => {
    if (!courseSlug || !sectionId || !contentId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ data: LearningData } | LearningData>(
        `/dashboard/learning/${courseSlug}/${sectionId}/${contentId}`
      );
      // Handle both wrapped and unwrapped responses
      const data = (response.data as any)?.data || response.data;
      setLearningData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch learning content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLearningData();
  }, [courseSlug, sectionId, contentId]);

  return {
    learningData,
    loading,
    error,
    refetch: fetchLearningData,
  };
};

