import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { CourseCard } from '../../components/CourseCard';
import { HeartIcon } from '../../components/Icons';
import { getCourseThumbnailUrl, getProfilePhotoUrl } from '../../utils/imageUrl';
import type { Course } from '../types';

// Helper function to convert API Course to frontend Course format
const convertApiCourseToCourse = (apiCourse: any): Course => {
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
    duration: `${apiCourse.content_count || 0} lessons`,
    rating: apiCourse.rating || 0,
    students: apiCourse.rating_count || 0,
    price: 0,
    isFree: apiCourse.is_free || false,
    popular: apiCourse.is_populer || false,
    longDescription: apiCourse.about || '',
    instructor: {
      name: apiCourse.course_mentors?.[0]?.mentor?.name || 'Instructor',
      avatar: apiCourse.course_mentors?.[0]?.mentor?.photo 
        ? getProfilePhotoUrl(apiCourse.course_mentors[0].mentor.photo)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(apiCourse.course_mentors?.[0]?.mentor?.name || 'Instructor')}&background=1e293b&color=fff&size=64`,
    },
    whatYouWillLearn: [],
    requirements: [],
    curriculum: [],
    reviews: [],
  };
};

const Wishlist: React.FC = () => {
    const { wishlistItems, loading } = useWishlist();
    const wishlistedCourses = wishlistItems.map(item => convertApiCourseToCourse(item.course));

    return (
        <main className="py-16 sm:py-20 lg:py-24 bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Your Wishlist</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        The courses you've saved for later.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <p className="text-slate-400">Loading wishlist...</p>
                    </div>
                ) : wishlistedCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {wishlistedCourses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-brand-dark border border-slate-800 rounded-2xl">
                        <HeartIcon className="h-16 w-16 mx-auto text-slate-600 mb-6" />
                        <h3 className="text-2xl font-bold text-white">Your wishlist is empty</h3>
                        <p className="mt-2 text-slate-400 mb-8">Browse our courses and save the ones you're interested in.</p>
                        <Link to="/courses" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-transform hover:scale-105 duration-300">
                            Explore Courses
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Wishlist;
