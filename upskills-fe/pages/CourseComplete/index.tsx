import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourse } from '../../hooks/useCourses';
import { useCourseCompletion } from '../../hooks/useCourseCompletion';
import { useTestimonials } from '../../hooks/useTestimonials';
import ProtectedRoute from '../../components/ProtectedRoute';
import useToastStore from '../../store/toastStore';
import apiClient from '../../utils/api';
import { TrophyIcon, MapIcon, CheckCircleIcon, XIcon } from '../../components/Icons';

const CourseComplete: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { course, loading, error } = useCourse(courseSlug || '');
  const { markAsComplete } = useCourseCompletion();
  const { createTestimonial } = useTestimonials({ courseId: course?.id });
  const toast = useToastStore();
  
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialData, setTestimonialData] = useState({
    quote: '',
    outcome: '',
  });
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);
  const [hasTestimonial, setHasTestimonial] = useState(false);

  // Check if user already has a testimonial for this course
  useEffect(() => {
    if (course?.id) {
      // Check testimonials for this course
      const checkTestimonial = async () => {
        try {
          const response = await apiClient.get(`/testimonials?course_id=${course.id}`);
          const testimonials = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
          // Check if current user has a testimonial
          const userTestimonial = testimonials.find((t: any) => t.user?.id);
          if (userTestimonial) {
            setHasTestimonial(true);
          }
        } catch (err) {
          // Ignore errors
        }
      };
      checkTestimonial();
    }
  }, [course?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Mark course as complete on the backend
    if (course?.id) {
      markAsComplete(course.id).catch(err => {
        console.error('Failed to mark course as complete:', err);
      });
    }
  }, [course?.id, markAsComplete]);

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course?.id || !testimonialData.quote.trim()) {
      toast.error('Please enter your testimonial');
      return;
    }

    setIsSubmittingTestimonial(true);
    try {
      await createTestimonial({
        course_id: course.id,
        quote: testimonialData.quote.trim(),
        outcome: testimonialData.outcome.trim() || undefined,
      });
      toast.success('Thank you for your testimonial!');
      setHasTestimonial(true);
      setShowTestimonialForm(false);
      setTestimonialData({ quote: '', outcome: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit testimonial');
    } finally {
      setIsSubmittingTestimonial(false);
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

  if (error || !course) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
          <p className="text-slate-400 mb-8">{error || "We couldn't find the course you were looking for."}</p>
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
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <TrophyIcon className="h-24 w-24 text-yellow-400 mx-auto" />
              <div className="absolute -top-2 -right-2">
                <CheckCircleIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              What a Day! Now<br />You're Ready to Work
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              You have successfully completed the course material. Next, you can create a portfolio and participate in internships.
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
              Get My Certificate
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Explore Courses
            </Link>
          </div>

          {/* Testimonial Form */}
          {!hasTestimonial && (
            <div className="pt-6 border-t border-slate-700">
              {!showTestimonialForm ? (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Share Your Experience</h3>
                  <p className="text-slate-400 mb-4">Help others by sharing your learning journey</p>
                  <button
                    onClick={() => setShowTestimonialForm(true)}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Add Testimonial
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Write Your Testimonial</h3>
                    <button
                      onClick={() => {
                        setShowTestimonialForm(false);
                        setTestimonialData({ quote: '', outcome: '' });
                      }}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Your Experience <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={testimonialData.quote}
                        onChange={(e) => setTestimonialData({ ...testimonialData, quote: e.target.value })}
                        rows={5}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Share your learning experience, what you gained, and how it helped you..."
                        required
                        minLength={10}
                      />
                      <p className="mt-1 text-xs text-slate-400">Minimum 10 characters</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Outcome (Optional)
                      </label>
                      <input
                        type="text"
                        value={testimonialData.outcome}
                        onChange={(e) => setTestimonialData({ ...testimonialData, outcome: e.target.value })}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Got hired at Google, Started freelancing, $5k/month"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSubmittingTestimonial || !testimonialData.quote.trim()}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingTestimonial ? 'Submitting...' : 'Submit Testimonial'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowTestimonialForm(false);
                          setTestimonialData({ quote: '', outcome: '' });
                        }}
                        className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Additional Actions */}
          <div className="pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/dashboard"
                className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <MapIcon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">Keep Learning</h4>
                <p className="text-sm text-slate-400">Explore more courses</p>
              </Link>
              <Link
                to={`/courses/${courseSlug}`}
                className="p-4 bg-slate-900 border border-slate-700 rounded-lg hover:border-blue-500 transition-colors"
              >
                <CheckCircleIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-white mb-1">Review Course</h4>
                <p className="text-sm text-slate-400">Go back to course details</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const CourseCompleteWithProtection: React.FC = () => (
  <ProtectedRoute>
    <CourseComplete />
  </ProtectedRoute>
);

export default CourseCompleteWithProtection;
