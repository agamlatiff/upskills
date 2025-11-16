import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { allCourses } from "../data/courses";
import { useWishlist } from "../hooks/useWishlist";
import {
  StarIcon,
  CheckBadgeIcon,
  ClockIcon,
  BookOpenIcon,
  TrophyIcon,
  FileTextIcon,
  MobileIcon,
  PlayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  HeartIcon,
} from "./Icons";

const CourseDetail: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = allCourses.find((c) => c.slug === courseSlug);
  const { isWishlisted, toggleWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseSlug]);

  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Course Not Found
          </h1>
          <p className="text-slate-400 mb-8">
            We couldn't find the course you were looking for.
          </p>
          <Link
            to="/courses"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const wishlisted = isWishlisted(course.id);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const totalLessons = course.curriculum.reduce(
    (acc, section) => acc + section.lessons.length,
    0
  );

  return (
    <main>
      {/* Header Section */}
      <section className="bg-brand-dark pt-12 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <nav
                className="text-sm mb-4 text-slate-400 flex items-center"
                aria-label="Breadcrumb"
              >
                <Link to="/courses" className="hover:text-white">
                  Courses
                </Link>
                <ChevronRightIcon className="h-4 w-4 mx-1.5" />
                <span className="hover:text-white">{course.category}</span>
                <ChevronRightIcon className="h-4 w-4 mx-1.5" />
                <span className="text-slate-500 truncate">{course.title}</span>
              </nav>
              <h1 className="text-4xl font-extrabold text-white mb-3">
                {course.title}
              </h1>
              <p className="text-xl text-slate-300 mb-6">
                {course.shortDescription}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {course.instructor && (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        course.instructor?.avatar || "/placeholder-avatar.jpg"
                      }
                      alt={course.instructor?.name || "Instructor"}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="font-medium text-slate-300">
                      Created by {course.instructor?.name || "Instructor"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2">
              <div className="space-y-12">
                {/* What you'll learn */}
                <div className="p-8 border border-slate-800 rounded-2xl bg-brand-dark">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    What you'll learn
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {course.whatYouWillLearn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckBadgeIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Course Content */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Course content
                  </h2>
                  <div className="flex items-center text-sm text-slate-400 mb-4 space-x-4">
                    <span>{course.curriculum.length} sections</span>
                    <span className="text-slate-600">•</span>
                    <span>{totalLessons} lectures</span>
                  </div>
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    {course.curriculum.map((section, index) => (
                      <div
                        key={index}
                        className="border-b border-slate-800 last:border-b-0"
                      >
                        <button
                          onClick={() => toggleSection(index)}
                          className="w-full flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                        >
                          <span className="font-bold text-white text-left">
                            {section.title}
                          </span>
                          <div className="flex items-center text-sm text-slate-400">
                            <span>{section.lessons.length} lectures</span>
                            {openSections[index] ? (
                              <ChevronUpIcon className="h-5 w-5 ml-4" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 ml-4" />
                            )}
                          </div>
                        </button>
                        {openSections[index] && (
                          <ul className="p-4 bg-brand-dark">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <li
                                key={lessonIndex}
                                className="flex items-center py-2 text-slate-300"
                              >
                                <BookOpenIcon className="h-5 w-5 text-slate-500 mr-3 flex-shrink-0" />
                                <span>{lesson.title}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-3 mt-1.5">•</span>
                        <span className="text-slate-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Description
                  </h2>
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">
                    {course.longDescription}
                  </p>
                </div>

                {/* Instructor */}
                {course.instructor && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Instructor
                    </h2>
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          course.instructor?.avatar || "/placeholder-avatar.jpg"
                        }
                        alt={course.instructor?.name || "Instructor"}
                        className="h-24 w-24 rounded-full"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-blue-400">
                          {course.instructor?.name || "Instructor"}
                        </h3>
                        <p className="text-slate-400">
                          Web Developer, Designer, and Teacher
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Sticky Sidebar) */}
            <div className="relative">
              <div className="sticky top-28 space-y-4">
                <div className="bg-brand-dark border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative group">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayIcon className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4 text-center">
                      <h2 className="text-2xl font-bold text-white">
                        Part of Upskills Pro
                      </h2>
                      <p className="text-slate-400 mt-2">
                        Unlock this course and 50+ others with a subscription.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Link
                        to={`/courses/${course.slug}/learn`}
                        className="w-full block text-center py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                      >
                        Start Learning Now
                      </Link>
                      <button
                        onClick={() => toggleWishlist(course.id)}
                        className="w-full flex items-center justify-center text-center py-3 bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-700 transition-colors"
                      >
                        <HeartIcon
                          className={`h-5 w-5 mr-2 transition-colors ${
                            wishlisted ? "text-red-500 fill-red-500" : ""
                          }`}
                        />
                        {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
                      </button>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-bold text-white mb-3">
                        Your subscription includes:
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center text-slate-300">
                          <BookOpenIcon className="h-5 w-5 mr-3 text-slate-400" />
                          {totalLessons} lessons
                        </li>
                        <li className="flex items-center text-slate-300">
                          <FileTextIcon className="h-5 w-5 mr-3 text-slate-400" />
                          Articles & resources
                        </li>
                        <li className="flex items-center text-slate-300">
                          <MobileIcon className="h-5 w-5 mr-3 text-slate-400" />
                          Access on mobile and TV
                        </li>
                        <li className="flex items-center text-slate-300">
                          <TrophyIcon className="h-5 w-5 mr-3 text-slate-400" />
                          Certificate of completion
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseDetail;
