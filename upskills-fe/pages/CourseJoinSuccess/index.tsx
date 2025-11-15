import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourse } from '../../hooks/useCourses';
import ProtectedRoute from '../../components/ProtectedRoute';
import { CheckCircleIcon } from '../../components/Icons';

const CourseJoinSuccess: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { course, loading } = useCourse(courseSlug || '');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseSlug]);

  const handleStartLearning = () => {
    if (!courseSlug) return;
    
    // Get first section and content from course
    const firstSection = course?.course_sections?.[0];
    const firstContent = firstSection?.section_contents?.[0];
    
    if (firstSection && firstContent) {
      navigate(`/courses/${courseSlug}/learn/${firstSection.id}/${firstContent.id}`);
    } else {
      navigate(`/courses/${courseSlug}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
          <Link to="/dashboard" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const thumbnailUrl = course.thumbnail || '/placeholder-course.jpg';
  const totalLessons = course.course_sections?.reduce(
    (acc, section) => acc + (section.section_contents?.length || 0),
    0
  ) || course.content_count || 0;

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 md:p-12 text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Welcome to Class,<br />Upgrade Your New Skills
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              Let's learn and improve our latest skills together with experienced mentors for a better future.
            </p>
          </div>

          {/* Course Card */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex items-center gap-6">
            <div className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden bg-slate-700">
              <img src={thumbnailUrl} alt={course.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold text-white mb-2">{course.name}</h2>
              <div className="space-y-2">
                {course.category && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center">📚</span>
                    <span>{course.category.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="w-5 h-5 flex items-center justify-center">📖</span>
                  <span>{totalLessons} Lessons</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button className="px-6 py-3 border border-slate-700 rounded-full text-white font-semibold hover:border-blue-500 transition-all">
              Get Guidelines
            </button>
            <button
              onClick={handleStartLearning}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Learning
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

const CourseJoinSuccessWithProtection: React.FC = () => (
  <ProtectedRoute>
    <CourseJoinSuccess />
  </ProtectedRoute>
);

export default CourseJoinSuccessWithProtection;

