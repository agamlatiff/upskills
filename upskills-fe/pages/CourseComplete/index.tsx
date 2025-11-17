import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCourse } from "../../hooks/useCourses";
import { useCourseCompletion } from "../../hooks/useCourseCompletion";
import { useTestimonials } from "../../hooks/useTestimonials";
import { useAuth } from "../../hooks/useAuth";
import ProtectedRoute from "../../components/ProtectedRoute";
import useToastStore from "../../store/toastStore";
import apiClient from "../../utils/api";
import { TestimonialCard } from "../../components/TestimonialCard";
import { Testimonial } from "../../types/api";
import { getProfilePhotoUrl } from "../../utils/imageUrl";
import {
  TrophyIcon,
  MapIcon,
  CheckCircleIcon,
  XIcon,
  EnvelopeIcon,
  TrashIcon,
} from "../../components/Icons";

const CourseComplete: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();
  const { course, loading, error } = useCourse(courseSlug || "");
  const { markAsComplete, deleteCompletion } = useCourseCompletion();
  const { createTestimonial, updateTestimonial } = useTestimonials({ courseId: course?.id });
  const { user } = useAuth();
  const toast = useToastStore();

  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [testimonialData, setTestimonialData] = useState({
    quote: "",
    outcome: "",
  });
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);
  const [hasTestimonial, setHasTestimonial] = useState(false);
  const [userTestimonial, setUserTestimonial] = useState<Testimonial | null>(
    null
  );
  const [showMentorContact, setShowMentorContact] = useState(false);
  const [mentorMessage, setMentorMessage] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const markedCourseIdRef = useRef<number | null>(null);
  const testimonialFormRef = useRef<HTMLDivElement>(null);

  // Check if user already has a testimonial for this course
  useEffect(() => {
    if (course?.id && user?.id) {
      // Check testimonials for this course
      const checkTestimonial = async () => {
        try {
          const response = await apiClient.get(
            `/testimonials?course_id=${course.id}`
          );
          const testimonials = Array.isArray(response.data)
            ? response.data
            : (response.data as any)?.data || [];
          // Check if current user has a testimonial (compare with current user's ID)
          const currentUserTestimonial = testimonials.find(
            (t: any) => t.user?.id === user.id
          );
          if (currentUserTestimonial) {
            setHasTestimonial(true);
            setUserTestimonial(currentUserTestimonial);
            // Pre-fill form with existing testimonial data
            setTestimonialData({
              quote: currentUserTestimonial.quote || "",
              outcome: currentUserTestimonial.outcome || "",
            });
          }
        } catch (err) {
          // Ignore errors
        }
      };
      checkTestimonial();
    }
  }, [course?.id, user?.id]);

  // Scroll to top only once on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to testimonial form when it opens
  useEffect(() => {
    if (showTestimonialForm && testimonialFormRef.current) {
      setTimeout(() => {
        testimonialFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [showTestimonialForm]);

  // Mark course as complete only once when course is loaded
  useEffect(() => {
    const courseId = course?.id;

    // Only mark if we have a course ID and haven't marked this specific course yet
    if (courseId && markedCourseIdRef.current !== courseId) {
      markedCourseIdRef.current = courseId;

      // Call the API
      markAsComplete(courseId).catch((err) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to mark course as complete:", err);
        }
        // Reset ref on error so it can be retried if needed
        if (markedCourseIdRef.current === courseId) {
          markedCourseIdRef.current = null;
        }
      });
    }
  }, [course?.id, markAsComplete]);

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course?.id || !testimonialData.quote.trim()) {
      toast.error("Please enter your testimonial");
      return;
    }

    setIsSubmittingTestimonial(true);
    try {
      // If user already has a testimonial, update it instead of creating new one
      if (hasTestimonial && userTestimonial) {
        const updatedTestimonial = await updateTestimonial(userTestimonial.id, {
          quote: testimonialData.quote.trim(),
          outcome: testimonialData.outcome.trim() || undefined,
        });
        toast.success("Testimonial updated successfully!");
        setUserTestimonial(updatedTestimonial);
        setShowTestimonialForm(false);
        setTestimonialData({ quote: "", outcome: "" });
      } else {
        // Create new testimonial
        const newTestimonial = await createTestimonial({
          course_id: course.id,
          quote: testimonialData.quote.trim(),
          outcome: testimonialData.outcome.trim() || undefined,
        });
        toast.success("Thank you for your testimonial!");
        setHasTestimonial(true);
        setUserTestimonial(newTestimonial);
        setShowTestimonialForm(false);
        setTestimonialData({ quote: "", outcome: "" });
      }
    } catch (err: any) {
      // If error says testimonial already exists, switch to edit mode
      if (err.response?.status === 422 && err.response?.data?.message?.includes('already left')) {
        toast.info("Loading your existing testimonial...");
        // Refresh testimonials to get existing one
        const response = await apiClient.get(`/testimonials?course_id=${course.id}`);
        const testimonials = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
        const existingTestimonial = testimonials.find((t: any) => t.user?.id === user?.id);
        if (existingTestimonial) {
          setHasTestimonial(true);
          setUserTestimonial(existingTestimonial);
          setTestimonialData({
            quote: existingTestimonial.quote || "",
            outcome: existingTestimonial.outcome || "",
          });
          setShowTestimonialForm(true);
          toast.info("You already have a testimonial. You can edit it below.");
        }
      } else {
        toast.error(
          err.response?.data?.message || "Failed to submit testimonial"
        );
      }
    } finally {
      setIsSubmittingTestimonial(false);
    }
  };

  const handleContactMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course?.id || !mentorMessage.trim()) {
      toast.error("Please enter your message");
      return;
    }

    // Get mentor from course
    const mentor = course.course_mentors?.[0]?.mentor;
    if (!mentor) {
      toast.error("Mentor information not available");
      return;
    }

    if (mentorMessage.trim().length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    setIsSendingMessage(true);
    try {
      const response = await apiClient.post('/mentor-messages', {
        message: mentorMessage.trim(),
        course_id: course.id,
        mentor_id: mentor.id,
      });

      toast.success(
        `Your message has been sent to ${mentor.name}. They will respond soon!`
      );
      setMentorMessage("");
      setShowMentorContact(false);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to send message. Please try again."
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleDeleteCompletion = async () => {
    if (!course?.id) return;

    setIsDeleting(true);
    try {
      await deleteCompletion(course.id);
      toast.success(
        "Course completion removed. You can mark it as complete again anytime."
      );
      navigate(`/courses/${courseSlug}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove completion");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
    );
  }

  const thumbnailUrl = course.thumbnail || "/placeholder-course.jpg";
  const totalLessons =
    course.course_sections?.reduce(
      (acc, section) => acc + (section.section_contents?.length || 0),
      0
    ) ||
    course.content_count ||
    0;

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
              What a Day! Now
              <br />
              You're Ready to Work
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed">
              You have successfully completed the course material. Next, you can
              create a portfolio and participate in internships.
            </p>
          </div>

          {/* Course Card */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 flex items-center gap-6">
            <div className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden bg-slate-700">
              <img
                src={thumbnailUrl}
                alt={course.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold text-white mb-2">
                {course.name}
              </h2>
              <div className="space-y-2">
                {course.category && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <span className="w-5 h-5 flex items-center justify-center">
                      📚
                    </span>
                    <span>{course.category.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="w-5 h-5 flex items-center justify-center">
                    📖
                  </span>
                  <span>{totalLessons} Lessons</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center pt-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Explore Courses
            </Link>
          </div>

          {/* Testimonial Section */}
          <div
            className="pt-6 border-t border-slate-700"
            ref={testimonialFormRef}
          >
            {hasTestimonial && userTestimonial && !showTestimonialForm ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Your Testimonial
                </h3>
                <div className="max-w-2xl mx-auto">
                  <TestimonialCard testimonial={userTestimonial} />
                </div>
                {userTestimonial.is_verified && (
                  <p className="text-sm text-slate-400 mt-4 text-center">
                    ✓ Your testimonial has been verified and is visible to others
                  </p>
                )}
                <div className="text-center mt-6">
                  <button
                    onClick={() => {
                      setTestimonialData({
                        quote: userTestimonial.quote || "",
                        outcome: userTestimonial.outcome || "",
                      });
                      setShowTestimonialForm(true);
                    }}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                  >
                    Edit Testimonial
                  </button>
                </div>
              </div>
            ) : !showTestimonialForm ? (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Share Your Experience
                </h3>
                <p className="text-slate-400 mb-4">
                  Help others by sharing your learning journey
                </p>
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
                  <h3 className="text-lg font-semibold text-white">
                    {hasTestimonial ? "Edit Your Testimonial" : "Write Your Testimonial"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowTestimonialForm(false);
                      // Reset form data only if not editing existing testimonial
                      if (!hasTestimonial) {
                        setTestimonialData({ quote: "", outcome: "" });
                      } else if (userTestimonial) {
                        // Reset to original testimonial data
                        setTestimonialData({
                          quote: userTestimonial.quote || "",
                          outcome: userTestimonial.outcome || "",
                        });
                      }
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
                      onChange={(e) =>
                        setTestimonialData({
                          ...testimonialData,
                          quote: e.target.value,
                        })
                      }
                      rows={5}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your learning experience, what you gained, and how it helped you..."
                      required
                      minLength={10}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Minimum 10 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Outcome (Optional)
                    </label>
                    <input
                      type="text"
                      value={testimonialData.outcome}
                      onChange={(e) =>
                        setTestimonialData({
                          ...testimonialData,
                          outcome: e.target.value,
                        })
                      }
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Got hired at Google, Started freelancing, $5k/month"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={
                        isSubmittingTestimonial || !testimonialData.quote.trim()
                      }
                      className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingTestimonial
                        ? (hasTestimonial ? "Updating..." : "Submitting...")
                        : (hasTestimonial ? "Update Testimonial" : "Submit Testimonial")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTestimonialForm(false);
                        // Reset form data only if not editing existing testimonial
                        if (!hasTestimonial) {
                          setTestimonialData({ quote: "", outcome: "" });
                        } else if (userTestimonial) {
                          // Reset to original testimonial data
                          setTestimonialData({
                            quote: userTestimonial.quote || "",
                            outcome: userTestimonial.outcome || "",
                          });
                        }
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

          {/* Mentor Contact Section */}
          {course.course_mentors && course.course_mentors.length > 0 && (
            <div className="pt-6 border-t border-slate-700">
              {!showMentorContact ? (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Have Questions?
                  </h3>
                  <p className="text-slate-400 mb-4">
                    Contact your course mentor for guidance
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    {course.course_mentors.map(
                      (cm, idx) =>
                        cm.mentor && (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-lg p-3"
                          >
                            <img
                              src={
                                cm.mentor.photo
                                  ? getProfilePhotoUrl(cm.mentor.photo)
                                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      cm.mentor.name
                                    )}&background=1e293b&color=fff&size=64`
                              }
                              alt={cm.mentor.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="text-left">
                              <p className="text-white font-semibold text-sm">
                                {cm.mentor.name}
                              </p>
                              {cm.mentor.occupation && (
                                <p className="text-slate-400 text-xs">
                                  {cm.mentor.occupation}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                  <button
                    onClick={() => setShowMentorContact(true)}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                  >
                    <EnvelopeIcon className="h-5 w-5" />
                    Ask Mentor
                  </button>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Contact Mentor
                    </h3>
                    <button
                      onClick={() => {
                        setShowMentorContact(false);
                        setMentorMessage("");
                      }}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      <XIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={handleContactMentor} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Your Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={mentorMessage}
                        onChange={(e) => setMentorMessage(e.target.value)}
                        rows={5}
                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ask your mentor about the course, career advice, or any questions you have..."
                        required
                        minLength={10}
                        maxLength={2000}
                      />
                      <p className="mt-1 text-xs text-slate-400">
                        Minimum 10 characters, maximum 2000 characters
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSendingMessage || !mentorMessage.trim()}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                      >
                        {isSendingMessage ? (
                          "Sending..."
                        ) : (
                          <>
                            <EnvelopeIcon className="h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowMentorContact(false);
                          setMentorMessage("");
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

          {/* Delete Completion Section */}
          <div className="pt-6 border-t border-slate-700">
            <div className="text-center">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 border border-red-600 text-red-400 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <TrashIcon className="h-5 w-5" />
                Remove Completion
              </button>
              <p className="text-xs text-slate-500 mt-2">
                You can mark this course as complete again later
              </p>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-4">
                  Remove Completion?
                </h3>
                <p className="text-slate-400 mb-6">
                  Are you sure you want to remove the completion status for this
                  course? You can mark it as complete again anytime.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCompletion}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Removing..." : "Yes, Remove"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Additional Actions */}
          <div className="pt-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              What's Next?
            </h3>
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
                <p className="text-sm text-slate-400">
                  Go back to course details
                </p>
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
