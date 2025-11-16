import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, ChartBarIcon, StarIcon, HeartIcon } from './Icons';
import { useWishlist } from '../hooks/useWishlist';
import { getProfilePhotoUrl } from '../utils/imageUrl';
import type { Course } from '../types';

interface CourseCardProps {
    course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(course.id);

    const handleWishlistClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleWishlist(course.id);
    };

    // Get difficulty badge color
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty.toLowerCase()) {
            case 'beginner':
                return 'bg-green-600 text-white';
            case 'intermediate':
                return 'bg-yellow-500 text-yellow-900';
            case 'advanced':
                return 'bg-red-600 text-white';
            default:
                return 'bg-blue-600 text-white';
        }
    };

    return (
        <Link to={`/courses/${course.slug}`} className="bg-brand-dark border border-slate-800 rounded-2xl shadow-lg overflow-hidden group flex flex-col h-full transition-all duration-300 hover:shadow-blue-500/20 hover:-translate-y-1">
            <div className="relative overflow-hidden h-48">
                <img src={course.image} alt={`Thumbnail for ${course.title}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
                <button
                    onClick={handleWishlistClick}
                    aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors z-10"
                >
                    <HeartIcon className={`h-6 w-6 transition-colors ${wishlisted ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </button>
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        {typeof course.category === 'string' ? course.category : course.category?.name || 'Uncategorized'}
                    </span>
                    {course.popular && (
                        <span className="inline-flex items-center bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            <StarIcon className="h-4 w-4 mr-1.5" />
                            Popular
                        </span>
                    )}
                     {course.isFree && (
                        <span className="inline-flex items-center bg-brand-teal text-brand-green-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                            Free
                        </span>
                    )}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-3">{course.title}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{course.shortDescription}</p>
                
                <div className="mt-auto pt-4 border-t border-slate-700">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        {/* Instructor */}
                        {course.instructor && (
                            <div className="col-span-2 flex items-center gap-3">
                                <img 
                                    src={course.instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'Instructor')}&background=1e293b&color=fff&size=64`} 
                                    alt={course.instructor?.name || 'Instructor'} 
                                    className="h-8 w-8 rounded-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name || 'Instructor')}&background=1e293b&color=fff&size=64`;
                                    }}
                                />
                                <span className="font-medium text-slate-300 truncate">{course.instructor?.name || 'Instructor'}</span>
                            </div>
                        )}
                        
                        {/* Duration */}
                        <div className="flex items-center gap-2 text-slate-400">
                            <BookOpenIcon className="h-5 w-5 text-blue-400" />
                            <span>{course.duration}</span>
                        </div>

                        {/* Difficulty */}
                        <div className="flex items-center gap-2 text-slate-400">
                            <ChartBarIcon className="h-5 w-5 text-blue-400" />
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getDifficultyColor(course.difficulty)}`}>
                                {course.difficulty}
                            </span>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Link>
    );
};