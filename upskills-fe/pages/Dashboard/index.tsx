import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../../hooks/useCourses';
import { CourseCard } from '../../components/CourseCard';
import { Course as ApiCourse } from '../../types/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getCourseThumbnailUrl, getProfilePhotoUrl } from '../../utils/imageUrl';

interface CourseCategoryGroup {
  category: string;
  courses: ApiCourse[];
}

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

  const mentor = apiCourse.course_mentors?.[0]?.mentor;
  const mentorPhoto = mentor?.photo 
    ? getProfilePhotoUrl(mentor.photo)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor?.name || 'Instructor')}&background=1e293b&color=fff&size=64`;

  return {
    id: apiCourse.id,
    slug: apiCourse.slug,
    title: apiCourse.name,
    image: getCourseThumbnailUrl(apiCourse.thumbnail),
    shortDescription: apiCourse.about ? apiCourse.about.substring(0, 150) + '...' : 'No description available',
    category: apiCourse.category?.name || 'Uncategorized',
    difficulty: difficulty,
    duration: `${apiCourse.content_count || 0} lessons`,
    rating: 4.8, // Default rating
    students: 0, // Not provided by API
    price: 0, // Not provided by API
    isFree: apiCourse.is_free || false,
    popular: apiCourse.is_populer || false,
    longDescription: apiCourse.about || '',
    instructor: {
      name: mentor?.name || 'Instructor',
      avatar: mentorPhoto,
    },
  };
};

const Dashboard: React.FC = () => {
  const { courses, loading, error, refetch } = useCourses();
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    if (courses && courses.length > 0) {
      setActiveTab(courses[0].category);
    }
  }, [courses]);

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
              <p className="mt-4 text-slate-400">Loading courses...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Error Loading Courses</h2>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2">Dashboard</h1>
          <p className="text-lg text-slate-400">Welcome back! Continue your learning journey.</p>
        </div>

        {/* Course Catalog */}
        {courses && courses.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Course Catalog</h2>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-slate-800">
              {courses.map((group: CourseCategoryGroup) => (
                <button
                  key={group.category}
                  type="button"
                  onClick={() => setActiveTab(group.category)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 ${
                    activeTab === group.category
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'
                  }`}
                >
                  {group.category}
                </button>
              ))}
            </div>

            {/* Courses Grid */}
            {courses
              .filter((group: CourseCategoryGroup) => group.category === activeTab)
              .map((group: CourseCategoryGroup) => (
                <div key={group.category} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {group.courses.length > 0 ? (
                    group.courses.map((apiCourse: ApiCourse) => {
                      const course = convertApiCourseToCourse(apiCourse);
                      return (
                        <CourseCard key={apiCourse.id} course={course} />
                      );
                    })
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-slate-400">No courses available in this category yet.</p>
                    </div>
                  )}
                </div>
              ))}
          </section>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-white mb-4">No Courses Available</h3>
            <p className="text-slate-400 mb-6">Check back later for new courses.</p>
            <Link
              to="/pricing"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Pricing Plans
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

const DashboardWithProtection: React.FC = () => (
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
);

export default DashboardWithProtection;

