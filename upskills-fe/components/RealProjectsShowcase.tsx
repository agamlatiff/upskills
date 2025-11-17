import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { useCourses } from '../hooks/useCourses';
import { CourseCard } from './CourseCard';
import { Course as ApiCourse } from '../types/api';
import { getCourseThumbnailUrl, getProfilePhotoUrl } from '../utils/imageUrl';

// Helper function to convert API Course to frontend Course format
const convertApiCourseToCourse = (apiCourse: ApiCourse): any => {
  // Map API difficulty to frontend format
  const difficultyMap: Record<string, string> = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
  };
  
  const difficulty = apiCourse.difficulty 
    ? difficultyMap[apiCourse.difficulty] || 'All Levels'
    : 'All Levels';

  return {
    id: apiCourse.id,
    slug: apiCourse.slug,
    title: apiCourse.name,
    image: getCourseThumbnailUrl(apiCourse.thumbnail),
    shortDescription: apiCourse.about ? apiCourse.about.substring(0, 150) + '...' : 'No description available',
    category: apiCourse.category?.name || 'Uncategorized',
    difficulty: difficulty,
    duration: apiCourse.content_count && apiCourse.content_count > 0 
      ? `${apiCourse.content_count} lessons` 
      : 'No lessons yet',
    rating: 4.8, // Default rating
    students: 0, // Not provided by API
    price: 0, // Not provided by API
    isFree: apiCourse.is_free || false,
    popular: apiCourse.is_populer || false,
    longDescription: apiCourse.about || '',
    instructor: {
      name: apiCourse.course_mentors?.[0]?.mentor?.name || 'Instructor',
      avatar: apiCourse.course_mentors?.[0]?.mentor?.photo 
        ? getProfilePhotoUrl(apiCourse.course_mentors[0].mentor.photo)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(apiCourse.course_mentors?.[0]?.mentor?.name || 'Instructor')}&background=1e293b&color=fff&size=64`,
    },
  };
};

const RealProjectsShowcase: React.FC = () => {
    const { courses, loading } = useCourses();
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Flatten courses from all categories, convert them, and get first 6 courses
    const allCourses = courses.flatMap(category => category.courses || []);
    const convertedCourses = allCourses.map(convertApiCourseToCourse);
    const popularCourses = convertedCourses.slice(0, 6);
    
    // This assumes a desktop-first view with 3 slides. 
    // A more complex implementation would calculate this based on window width.
    const slidesPerView = 3; 
    const maxIndex = popularCourses.length > slidesPerView ? popularCourses.length - slidesPerView : 0;

    const next = useCallback(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const prev = () => {
        setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
    };
    
    useEffect(() => {
      const timer = setInterval(next, 5000); // auto-slide every 5 seconds
      return () => clearInterval(timer);
    }, [next]);


  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Explore Our Popular Courses
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
              Hand-picked courses designed to help you build skills, create a portfolio, and accelerate your career.
            </p>
          </div>
          <div className="mt-16 flex items-center justify-center min-h-[400px]">
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
              <p className="mt-4 text-slate-400">Loading courses...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (popularCourses.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Explore Our Popular Courses
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            Hand-picked courses designed to help you build skills, create a portfolio, and accelerate your career.
          </p>
        </div>

        <div className="mt-16 relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }}>
              {popularCourses.map((course) => (
                <div key={course.id} className="w-full lg:w-1/3 flex-shrink-0 px-4">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
          
          {maxIndex > 0 && (
            <>
                <button 
                    onClick={prev} 
                    className="absolute top-1/2 -left-4 -translate-y-1/2 bg-slate-800/50 hover:bg-slate-700/80 backdrop-blur-sm text-white p-3 rounded-full z-10 transition-colors hidden lg:block"
                    aria-label="Previous course"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button 
                    onClick={next} 
                    className="absolute top-1/2 -right-4 -translate-y-1/2 bg-slate-800/50 hover:bg-slate-700/80 backdrop-blur-sm text-white p-3 rounded-full z-10 transition-colors hidden lg:block"
                    aria-label="Next course"
                >
                    <ChevronRightIcon className="h-6 w-6" />
                </button>
            </>
          )}
        </div>

        <div className="mt-16 text-center">
            <Link to="/courses" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-transform hover:scale-105 duration-300">
                Explore All Courses
            </Link>
        </div>
      </div>
    </section>
  );
};

export default RealProjectsShowcase;
