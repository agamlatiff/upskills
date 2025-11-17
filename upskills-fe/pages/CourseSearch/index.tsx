import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearchCourses } from '../../hooks/useCourses';
import { CourseCard } from '../../components/CourseCard';
import { SearchIcon, SparklesIcon } from '../../components/Icons';
import { Course as ApiCourse } from '../../types/api';
import { getCourseThumbnailUrl, getProfilePhotoUrl } from '../../utils/imageUrl';

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
    students: apiCourse.testimonial_count || 0,
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

const CourseSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialKeyword = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const { courses, loading, error, searchCourses } = useSearchCourses();

  useEffect(() => {
    if (initialKeyword) {
      searchCourses(initialKeyword);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchCourses(searchTerm.trim());
      navigate(`/courses/search?q=${encodeURIComponent(searchTerm.trim())}`, { replace: true });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Search Courses
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Find the perfect course to level up your skills and advance your career.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for courses by name, description, or category..."
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className="h-6 w-6 text-slate-500" />
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-500 hover:text-blue-400 transition-colors"
            >
              <span className="font-semibold">Search</span>
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
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
              <p className="mt-4 text-slate-400">Searching courses...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {courses.length > 0 ? (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SparklesIcon className="h-6 w-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-white">
                      {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Found
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((apiCourse: ApiCourse) => {
                    const course = convertApiCourseToCourse(apiCourse);
                    return (
                      <CourseCard key={apiCourse.id} course={course} />
                    );
                  })}
                </div>
              </>
            ) : searchTerm ? (
              <div className="text-center py-16">
                <div className="inline-block p-8 bg-slate-800/50 border border-slate-700 rounded-2xl">
                  <SearchIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                  <p className="text-slate-400 mb-6">
                    We couldn't find any courses matching "{searchTerm}". Try different keywords or browse all courses.
                  </p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse All Courses
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-block p-8 bg-slate-800/50 border border-slate-700 rounded-2xl">
                  <SearchIcon className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Start Your Search</h3>
                  <p className="text-slate-400">
                    Enter keywords above to search for courses by name, description, or category.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default CourseSearch;

