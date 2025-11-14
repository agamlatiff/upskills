import React from 'react';
import { Link } from 'react-router-dom';
import useWishlistStore from '../../store/wishlistStore';
import { allCourses } from '../../data/courses';
import { CourseCard } from '../../components/CourseCard';
import { HeartIcon } from '../../components/Icons';

const Wishlist: React.FC = () => {
    const { wishlist } = useWishlistStore();
    const wishlistedCourses = allCourses.filter(course => wishlist.includes(course.id));

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

                {wishlistedCourses.length > 0 ? (
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
