import React, { useState, useEffect } from 'react';
import { SearchIcon, StarIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from '../../components/Icons';
import { useCourses } from '../../hooks/useCourses';
import { CourseCard } from '../../components/CourseCard';
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

const Courses: React.FC = () => {
    const { courses: coursesByCategory, loading, error } = useCourses();
    const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
    const [difficultyFilters, setDifficultyFilters] = useState<string[]>([]);
    const [popularFilter, setPopularFilter] = useState(false);
    const [freeFilter, setFreeFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const COURSES_PER_PAGE = 9;

    // Get all unique categories from API
    const categoryOptions = React.useMemo(() => {
        const categories = new Set<string>();
        coursesByCategory.forEach(group => {
            if (group.category) {
                categories.add(group.category);
            }
        });
        return Array.from(categories).sort();
    }, [coursesByCategory]);

    const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

    const handleCategoryToggle = (category: string) => {
        setCategoryFilters(prev => 
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleDifficultyToggle = (difficulty: string) => {
        setDifficultyFilters(prev =>
            prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
        );
    };

    // Convert API courses to frontend format
    useEffect(() => {
        const allApiCourses = coursesByCategory.flatMap(group => group.courses || []);
        const convertedCourses = allApiCourses.map(convertApiCourseToCourse);
        
        let courses = convertedCourses;

        if (searchTerm) {
            courses = courses.filter(course =>
                course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.longDescription.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (categoryFilters.length > 0) {
            courses = courses.filter(course => categoryFilters.includes(course.category));
        }

        if (difficultyFilters.length > 0) {
            courses = courses.filter(course => difficultyFilters.includes(course.difficulty));
        }

        if (popularFilter) {
            courses = courses.filter(course => course.popular);
        }

        if (freeFilter) {
            courses = courses.filter(course => course.isFree);
        }

        setFilteredCourses(courses);
        setCurrentPage(1);

    }, [coursesByCategory, searchTerm, categoryFilters, difficultyFilters, popularFilter, freeFilter]);

    // Pagination logic
    const indexOfLastCourse = currentPage * COURSES_PER_PAGE;
    const indexOfFirstCourse = indexOfLastCourse - COURSES_PER_PAGE;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);

    const paginate = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
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
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center max-w-md">
                            <div className="mb-6">
                                <svg className="h-16 w-16 text-slate-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
                            <p className="text-slate-400 mb-6">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="py-16 sm:py-20 lg:py-24 bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Explore Courses</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        Find the perfect course to level up your skills and advance your career.
                    </p>
                </div>

                {/* Filters and Search */}
                <div className="mb-12 p-6 bg-brand-dark border border-slate-800 rounded-2xl shadow-lg">
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search for courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-slate-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-3">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {categoryOptions.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryToggle(cat)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                            categoryFilters.includes(cat) 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-300 mb-3">Difficulty</label>
                            <div className="flex flex-wrap gap-2">
                                {difficultyOptions.map(diff => (
                                    <button
                                        key={diff}
                                        onClick={() => handleDifficultyToggle(diff)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                                            difficultyFilters.includes(diff) 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-700 flex flex-wrap items-center gap-x-8 gap-y-4">
                        <label htmlFor="popular" className="flex items-center cursor-pointer group">
                            <StarIcon className={`h-5 w-5 mr-2 transition-colors ${popularFilter ? 'text-yellow-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className={`font-medium text-sm transition-colors mr-3 ${popularFilter ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                Popular Only
                            </span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="popular"
                                    className="sr-only peer"
                                    checked={popularFilter}
                                    onChange={(e) => setPopularFilter(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-blue-600 transition-colors group-hover:bg-slate-600 peer-checked:group-hover:bg-blue-500"></div>
                                <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                        </label>
                         <label htmlFor="free" className="flex items-center cursor-pointer group">
                            <SparklesIcon className={`h-5 w-5 mr-2 transition-colors ${freeFilter ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            <span className={`font-medium text-sm transition-colors mr-3 ${freeFilter ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                Free Only
                            </span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="free"
                                    className="sr-only peer"
                                    checked={freeFilter}
                                    onChange={(e) => setFreeFilter(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-blue-600 transition-colors group-hover:bg-slate-600 peer-checked:group-hover:bg-blue-500"></div>
                                <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-transform peer-checked:translate-x-5"></div>
                            </div>
                        </label>
                    </div>
                </div>
                
                {/* Courses Grid */}
                {currentCourses.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <nav aria-label="Course pagination" className="mt-16 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeftIcon className="h-5 w-5" />
                                    <span>Previous</span>
                                </button>
                                
                                <div className="hidden sm:flex items-center space-x-2">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => paginate(i + 1)}
                                            className={`px-4 py-2 text-sm font-medium rounded-lg ${
                                                currentPage === i + 1
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                            aria-label={`Go to page ${i + 1}`}
                                            aria-current={currentPage === i + 1 ? 'page' : undefined}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-slate-400 text-sm sm:hidden">
                                    Page {currentPage} of {totalPages}
                                </span>
                                
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Next page"
                                >
                                    <span>Next</span>
                                    <ChevronRightIcon className="h-5 w-5" />
                                </button>
                            </nav>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <h3 className="text-2xl font-bold text-white">No Courses Found</h3>
                        <p className="mt-2 text-slate-400">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Courses;