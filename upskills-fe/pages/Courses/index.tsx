import React, { useState, useEffect } from 'react';
import { SearchIcon, StarIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from '../../components/Icons';
import { allCourses } from '../../data/courses';
import type { Course } from '../../types';
import { CourseCard } from '../../components/CourseCard';

const categoryOptions = ['Frontend', 'Backend', 'Data Science', 'UI/UX Design', 'DevOps'];
const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const Courses: React.FC = () => {
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(allCourses);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
    const [difficultyFilters, setDifficultyFilters] = useState<string[]>([]);
    const [popularFilter, setPopularFilter] = useState(false);
    const [freeFilter, setFreeFilter] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const COURSES_PER_PAGE = 9;

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

    useEffect(() => {
        let courses = allCourses;

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

    }, [searchTerm, categoryFilters, difficultyFilters, popularFilter, freeFilter]);

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
                            <SparklesIcon className={`h-5 w-5 mr-2 transition-colors ${freeFilter ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
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
                                <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-teal-600 transition-colors group-hover:bg-slate-600 peer-checked:group-hover:bg-teal-500"></div>
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