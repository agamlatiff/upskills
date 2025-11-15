import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourse } from '../../hooks/useCourses';
import useWishlistStore from '../../store/wishlistStore';
import { useAuth } from '../../hooks/useAuth';
import RequireAuth from '../../components/RequireAuth';
import useToastStore from '../../store/toastStore';
import apiClient from '../../utils/api';
import { getCourseThumbnailUrl } from '../../utils/imageUrl';
import { 
    StarIcon,
    CheckBadgeIcon,
    VideoCameraIcon,
    PlayIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ChevronRightIcon,
    HeartIcon
} from '../../components/Icons';

const CourseDetail: React.FC = () => {
    const { courseSlug } = useParams<{ courseSlug: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { course, loading, error } = useCourse(courseSlug || '');
    const { isWishlisted, toggleWishlist } = useWishlistStore();
    const toast = useToastStore();
    const [activeTab, setActiveTab] = useState<'about' | 'lessons' | 'testimonials' | 'portfolios' | 'rewards'>('about');
    const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
    const [isJoining, setIsJoining] = useState(false);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [courseSlug]);

    const handleJoinCourse = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to join this course');
            navigate('/signin', { state: { from: { pathname: `/courses/${courseSlug}` } } });
            return;
        }

        if (!courseSlug) return;

        setIsJoining(true);
        try {
            const response = await apiClient.post(`/dashboard/join/${courseSlug}`);
            toast.success('Successfully joined the course!');
            // Redirect to success page or directly to learning
            const firstSectionId = response.data.first_section_id;
            const firstContentId = response.data.first_content_id;
            if (firstSectionId && firstContentId) {
                navigate(`/courses/${courseSlug}/learn/${firstSectionId}/${firstContentId}`);
            } else {
                navigate(`/courses/${courseSlug}/success`);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to join course. Please try again.');
            setIsJoining(false);
        }
    };

    const handleToggleWishlist = () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to add courses to your wishlist');
            navigate('/signin', { state: { from: { pathname: `/courses/${courseSlug}` } } });
            return;
        }
        
        if (course) {
            toggleWishlist(course.id);
            const isWishlistedNow = isWishlisted(course.id);
            toast.success(isWishlistedNow ? 'Added to wishlist' : 'Removed from wishlist');
        }
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
                            <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
                            <p className="text-slate-400 mb-8">{error || "We couldn't find the course you were looking for."}</p>
                            <Link to="/dashboard" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const wishlisted = isWishlisted(course.id);
    const thumbnailUrl = getCourseThumbnailUrl(course.thumbnail);
    const totalLessons = course.course_sections?.reduce((acc, section) => acc + (section.section_contents?.length || 0), 0) || 0;

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
                                    <img src={thumbnailUrl} alt={course.name} className="w-full h-full object-cover" />
                                    {course.is_populer && (
                                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full px-3 py-1 flex items-center gap-2">
                                            <StarIcon className="h-4 w-4 text-white" />
                                            <span className="text-xs font-semibold text-white">Popular</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Course Info */}
                            <div className="lg:col-span-2">
                                <nav className="text-sm mb-4 text-slate-400 flex items-center" aria-label="Breadcrumb">
                                    <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
                                    <ChevronRightIcon className="h-4 w-4 mx-1.5" />
                                    <span className="hover:text-white">{course.category?.name || 'Course'}</span>
                                    <ChevronRightIcon className="h-4 w-4 mx-1.5" />
                                    <span className="text-slate-500 truncate">{course.name}</span>
                                </nav>
                                
                                <h1 className="text-4xl font-extrabold text-white mb-3">{course.name}</h1>
                                
                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-6">
                                    {course.category && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-400">Category:</span>
                                            <span className="font-semibold text-slate-300">{course.category.name}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <VideoCameraIcon className="h-5 w-5 text-slate-400" />
                                        <span className="text-slate-300">{course.content_count || totalLessons} Lessons</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleJoinCourse}
                                        disabled={isJoining}
                                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isJoining ? 'Joining...' : 'Start Learning Now'}
                                    </button>
                                    <button
                                        onClick={handleToggleWishlist}
                                        className="px-6 py-3 border border-slate-700 text-white font-semibold rounded-full hover:border-blue-500 transition-colors flex items-center gap-2"
                                    >
                                        <HeartIcon className={`h-5 w-5 ${wishlisted ? 'text-red-500 fill-red-500' : ''}`} />
                                        {wishlisted ? 'Saved' : 'Add to Wishlist'}
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
                                onClick={() => setActiveTab('about')}
                                className={`px-4 py-2 rounded-full border transition-all ${
                                    activeTab === 'about'
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'
                                }`}
                            >
                                About
                            </button>
                            <button
                                onClick={() => setActiveTab('lessons')}
                                className={`px-4 py-2 rounded-full border transition-all ${
                                    activeTab === 'lessons'
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'
                                }`}
                            >
                                Lessons
                            </button>
                            <button
                                onClick={() => setActiveTab('testimonials')}
                                className={`px-4 py-2 rounded-full border transition-all ${
                                    activeTab === 'testimonials'
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'
                                }`}
                            >
                                Testimonials
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-8">
                            {/* About Tab */}
                            {activeTab === 'about' && (
                                <div className="space-y-8">
                                    {/* Description */}
                                    {course.about && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-4">About This Course</h2>
                                            <p className="text-slate-300 leading-relaxed whitespace-pre-line">{course.about}</p>
                                        </div>
                                    )}

                                    {/* What You'll Learn */}
                                    {course.benefits && course.benefits.length > 0 && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-4">What You'll Learn</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {course.benefits.map((benefit, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <CheckBadgeIcon className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                                                        <span className="text-slate-300">{benefit.benefit}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Instructors */}
                                    {course.course_mentors && course.course_mentors.length > 0 && (
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-4">Course Instructors</h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {course.course_mentors.map((mentor, index) => (
                                                    mentor.mentor && (
                                                        <div key={index} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                                            <div className="flex items-center gap-4 mb-4">
                                                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
                                                                    <span className="text-white font-semibold">
                                                                        {mentor.mentor.name.charAt(0).toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold text-white">{mentor.mentor.name}</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Lessons Tab */}
                            {activeTab === 'lessons' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-4">Course Content</h2>
                                    <div className="text-sm text-slate-400 mb-6">
                                        {course.course_sections?.length || 0} sections • {totalLessons} lessons
                                    </div>
                                    <div className="space-y-4">
                                        {course.course_sections?.map((section, sectionIndex) => (
                                            <div key={section.id} className="border border-slate-800 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => setOpenSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                                                    className="w-full flex justify-between items-center p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors"
                                                >
                                                    <span className="font-semibold text-white text-left">{section.name}</span>
                                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                                        <span>{section.section_contents?.length || 0} lessons</span>
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
                                                            <div key={content.id} className="flex items-center gap-3 py-2 text-slate-300">
                                                                <VideoCameraIcon className="h-5 w-5 text-slate-500 flex-shrink-0" />
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
                            {activeTab === 'testimonials' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-4">Student Testimonials</h2>
                                    <p className="text-slate-400">No testimonials available yet.</p>
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
