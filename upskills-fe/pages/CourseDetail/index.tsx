import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks/useCourses";
import { useAuth } from "../../hooks/useAuth";
import { useTestimonials } from "../../hooks/useTestimonials";
import { useCourseCompletion } from "../../hooks/useCourseCompletion";
import { useSubscriptions } from "../../hooks/useSubscriptions";
import RequireAuth from "../../components/RequireAuth";
import useToastStore from "../../store/toastStore";
import apiClient from "../../utils/api";
import {
  getCourseThumbnailUrl,
  getProfilePhotoUrl,
} from "../../utils/imageUrl";
import {
  StarIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  BookOpenIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
} from "../../components/Icons";
import { TestimonialCard } from "../../components/TestimonialCard";

const CourseDetail: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, checkAuth } = useAuth();
  const { course, loading, error } = useCourse(courseSlug || "");
  const { checkCompletion } = useCourseCompletion();
  const { subscriptions } = useSubscriptions();
  const toast = useToastStore();
  const { testimonials: courseTestimonials, loading: testimonialsLoading } = useTestimonials({
    courseId: course?.id,
    verified: true,
    limit: 50,
  });
  
  // Check if user has active subscription from subscriptions list
  const hasActiveSubscription = useMemo(() => {
    // If not authenticated, no subscription
    if (!isAuthenticated) {
      return false;
    }
    
    // If we have subscriptions list, check for active subscription
    if (subscriptions && subscriptions.length > 0) {
      const activeSubscription = subscriptions.find((sub: any) => {
        if (!sub.is_paid) return false;
        const endedAt = new Date(sub.ended_at);
        const now = new Date();
        return endedAt > now;
      });
      
      if (activeSubscription) {
        return true;
      }
    }
    
    // Fallback to user's has_active_subscription from API
    return user?.has_active_subscription || false;
  }, [subscriptions, user?.has_active_subscription, isAuthenticated]);
  const [activeTab, setActiveTab] = useState<
    "about" | "lessons" | "testimonials" | "portfolios" | "rewards"
  >("about");
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [isJoining, setIsJoining] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseSlug]);

  // Refresh user data when component mounts or course changes to ensure subscription status is up-to-date
  useEffect(() => {
    if (isAuthenticated && course) {
      checkAuth();
    }
  }, [isAuthenticated, course?.id, checkAuth]);

  // Check completion status
  useEffect(() => {
    if (course?.id && isAuthenticated) {
      checkCompletion(course.id).then((completed) => {
        setIsCompleted(completed);
      }).catch(() => {
        setIsCompleted(false);
      });
    }
  }, [course?.id, isAuthenticated, checkCompletion]);

  // Check if mentor is trying to access another mentor's course
  useEffect(() => {
    if (course && isAuthenticated && user) {
      const userRoles = Array.isArray(user.roles) ? user.roles : [];
      const roleNames = userRoles.map((r: any) => typeof r === 'string' ? r : r?.name || '');
      const isMentor = roleNames.includes('mentor');
      
      if (isMentor && course.course_mentors) {
        // Check if current user is NOT the owner of this course
        const isMentorOwnedCourse = course.course_mentors.some((cm: any) => 
          cm.mentor && cm.mentor.id === user?.id
        );
        
        if (!isMentorOwnedCourse) {
          toast.error("You can only access courses that you created. Please go to 'My Courses' to manage your own courses.");
          navigate("/mentor/courses");
        }
      }
    }
  }, [course, isAuthenticated, user, navigate, toast]);

  const handleJoinCourse = async () => {
    // Step 1: Check if user is authenticated
    if (!isAuthenticated) {
      toast.error("Please sign in to start learning");
      navigate("/signin", {
        state: { from: { pathname: `/courses/${courseSlug}` } },
      });
      return;
    }

    // Step 2: Check if course is free - free courses don't require subscription
    if (course?.is_free) {
      // Free courses can proceed without subscription check
    } else {
      // Step 3: Check if user is a mentor who owns this course
      const userRoles = Array.isArray(user?.roles) ? user?.roles : [];
      const roleNames = userRoles.map((r: any) => typeof r === 'string' ? r : r?.name || '');
      const isMentor = roleNames.includes('mentor');
      
      let isMentorOwnedCourse = false;
      if (isMentor && course?.course_mentors) {
        // Check if current user is in the course mentors list
        isMentorOwnedCourse = course.course_mentors.some((cm: any) => 
          cm.mentor && cm.mentor.id === user?.id
        );
      }

      // Step 4: Skip frontend subscription check - let backend handle it
      // Backend middleware will check subscription and return proper error if needed
      // This prevents issues where frontend user data might be stale
    }

    if (!courseSlug) return;

    setIsJoining(true);
    try {
      const response = await apiClient.post(`/dashboard/join/${courseSlug}`);
      toast.success("Successfully joined the course!");
      
      // Refresh user data to update subscription status
      checkAuth();
      
      // Redirect to success page or directly to learning
      const firstSectionId = response.data.first_section_id;
      const firstContentId = response.data.first_content_id;
      if (firstSectionId && firstContentId) {
        navigate(
          `/courses/${courseSlug}/learn/${firstSectionId}/${firstContentId}`
        );
      } else {
        navigate(`/courses/${courseSlug}/success`);
      }
    } catch (err: any) {
      // Handle subscription error specifically
      if (
        err.response?.status === 403 &&
        err.response?.data?.error === "subscription_required"
      ) {
        toast.error("You need an active subscription to start learning");
        navigate("/pricing");
      } else {
        toast.error(
          err.response?.data?.message ||
            "Failed to join course. Please try again."
        );
      }
      setIsJoining(false);
    }
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty?: string) => {
    if (!difficulty) return "bg-blue-600 text-white";
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-600 text-white";
      case "intermediate":
        return "bg-yellow-500 text-yellow-900";
      case "advanced":
        return "bg-red-600 text-white";
      default:
        return "bg-blue-600 text-white";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    if (!difficulty) return "All Levels";
    const map: Record<string, string> = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
    };
    return map[difficulty] || "All Levels";
  };

  if (loading) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
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
              <p className="mt-4 text-slate-400">Loading course details...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Course Not Found
              </h1>
              <p className="text-slate-400 mb-8">
                {error || "We couldn't find the course you were looking for."}
              </p>
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const thumbnailUrl = getCourseThumbnailUrl(course.thumbnail);
  const totalLessons =
    course.course_sections?.reduce(
      (acc, section) => acc + (section.section_contents?.length || 0),
      0
    ) || 0;

  return (
    <main className="bg-slate-900 min-h-screen">
      {/* Header Section */}
      <section className="bg-brand-dark pt-12 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Thumbnail */}
              <div className="lg:col-span-1">
                <div className="relative rounded-2xl overflow-hidden bg-slate-800 aspect-video">
                  <img
                    src={thumbnailUrl}
                    alt={course.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231e293b" width="400" height="300"/%3E%3Ctext fill="%23475569" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {course.is_populer && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-3 py-1 flex items-center gap-2">
                      <StarIcon className="h-4 w-4 text-white" />
                      <span className="text-xs font-semibold text-white">
                        Popular
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="lg:col-span-2">
                <nav
                  className="text-sm mb-4 text-slate-400 flex items-center"
                  aria-label="Breadcrumb"
                >
                  <Link to="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                  <ChevronRightIcon className="h-4 w-4 mx-1.5" />
                  <span className="hover:text-white">
                    {course.category?.name || "Course"}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 mx-1.5" />
                  <span className="text-slate-500 truncate">{course.name}</span>
                </nav>

                <h1 className="text-4xl font-extrabold text-white mb-3">
                  {course.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-6">
                  {course.category && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Category:</span>
                      <span className="font-semibold text-slate-300">
                        {course.category.name}
                      </span>
                    </div>
                  )}
                  {course.difficulty && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Difficulty:</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${getDifficultyColor(
                          course.difficulty
                        )}`}
                      >
                        {getDifficultyLabel(course.difficulty)}
                      </span>
                    </div>
                  )}
                  {course.is_free && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center bg-brand-teal text-brand-green-dark text-xs font-bold px-3 py-1 rounded-full">
                        Free
                      </span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                        Completed
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-300">
                      {course.content_count || totalLessons} Lessons
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleJoinCourse}
                    disabled={isJoining}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {(() => {
                      if (isJoining) return "Starting...";
                      if (!isAuthenticated) return "Sign In to Start Learning";
                      
                      // Check if user is mentor who owns this course
                      // Free courses don't require subscription
                      if (course?.is_free) return "Start Learning Now";
                      
                      const userRoles = Array.isArray(user?.roles) ? user?.roles : [];
                      const roleNames = userRoles.map((r: any) => typeof r === 'string' ? r : r?.name || '');
                      const isMentor = roleNames.includes('mentor');
                      const isMentorOwnedCourse = isMentor && course?.course_mentors?.some((cm: any) => 
                        cm.mentor && cm.mentor.id === user?.id
                      );
                      
                      if (isMentorOwnedCourse) return "Start Learning Now";
                      if (hasActiveSubscription) return "Start Learning Now";
                      return "Subscribe to Learn";
                    })()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-8 border-b border-slate-800 pb-4">
              <button
                onClick={() => setActiveTab("about")}
                className={`px-4 py-2 rounded-full border transition-all ${
                  activeTab === "about"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500"
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("lessons")}
                className={`px-4 py-2 rounded-full border transition-all ${
                  activeTab === "lessons"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500"
                }`}
              >
                Lessons
              </button>
              <button
                onClick={() => setActiveTab("testimonials")}
                className={`px-4 py-2 rounded-full border transition-all ${
                  activeTab === "testimonials"
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500"
                }`}
              >
                Testimonials
              </button>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {/* About Tab */}
              {activeTab === "about" && (
                <div className="space-y-8">
                  {/* Description */}
                  {course.about && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">
                        About This Course
                      </h2>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                        {course.about}
                      </p>
                    </div>
                  )}

                  {/* What You'll Learn */}
                  {course.benefits && course.benefits.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4">
                        What You'll Learn
                      </h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.benefits.map((benefit, index) => (
                          <li
                            key={benefit.id || index}
                            className="flex items-start gap-3"
                          >
                            <CheckBadgeIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-300">
                              {benefit.name || benefit.benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Instructors */}
                  {course.course_mentors &&
                    course.course_mentors.length > 0 && (
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                          Course Instructors
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {course.course_mentors.map(
                            (courseMentor, index) =>
                              courseMentor.mentor && (
                                <div
                                  key={index}
                                  className="bg-slate-800 border border-slate-700 rounded-xl p-6"
                                >
                                  <div className="flex items-center gap-4">
                                    <img
                                      src={
                                        courseMentor.mentor.photo
                                          ? getProfilePhotoUrl(
                                              courseMentor.mentor.photo
                                            )
                                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                              courseMentor.mentor.name
                                            )}&background=1e293b&color=fff&size=64`
                                      }
                                      alt={courseMentor.mentor.name}
                                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                                      onError={(e) => {
                                        const target =
                                          e.target as HTMLImageElement;
                                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                          courseMentor.mentor?.name || ""
                                        )}&background=1e293b&color=fff&size=64`;
                                      }}
                                    />
                                    <div>
                                      <h3 className="font-semibold text-white text-lg">
                                        {courseMentor.mentor.name}
                                      </h3>
                                      {courseMentor.mentor.occupation && (
                                        <p className="text-slate-400 text-sm mt-1">
                                          {courseMentor.mentor.occupation}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Lessons Tab */}
              {activeTab === "lessons" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Course Content
                  </h2>
                  <div className="text-sm text-slate-400 mb-6">
                    {course.course_sections?.length || 0} sections •{" "}
                    {totalLessons} lessons
                  </div>
                  <div className="space-y-4">
                    {course.course_sections?.map((section, sectionIndex) => (
                      <div
                        key={section.id}
                        className="border border-slate-800 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setOpenSections((prev) => ({
                              ...prev,
                              [section.id]: !prev[section.id],
                            }))
                          }
                          className="w-full flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                          <span className="font-semibold text-white text-left">
                            {section.name}
                          </span>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>
                              {section.section_contents?.length || 0} lessons
                            </span>
                            {openSections[section.id] ? (
                              <ChevronUpIcon className="h-5 w-5" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5" />
                            )}
                          </div>
                        </button>
                        {openSections[section.id] && (
                          <div className="p-4 bg-brand-dark space-y-2">
                            {section.section_contents?.map((content) => (
                              <div
                                key={content.id}
                                className="flex items-center gap-3 py-2 text-slate-300"
                              >
                                <BookOpenIcon className="h-5 w-5 text-slate-500 flex-shrink-0" />
                                <span>{content.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials Tab */}
              {activeTab === "testimonials" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Student Testimonials
                    </h2>
                    {courseTestimonials.length > 0 && (
                      <span className="text-slate-400 text-sm">
                        {courseTestimonials.length} {courseTestimonials.length === 1 ? 'testimonial' : 'testimonials'}
                      </span>
                    )}
                  </div>
                  
                  {testimonialsLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      <p className="text-slate-400 mt-4">Loading testimonials...</p>
                    </div>
                  ) : courseTestimonials.length === 0 ? (
                    <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
                      <p className="text-slate-400 text-lg mb-2">No testimonials yet</p>
                      <p className="text-slate-500 text-sm">
                        Be the first to share your experience after completing this course!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {courseTestimonials.map((testimonial) => (
                        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseDetail;
