import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { allCourses } from '../data/courses';
import { CourseCard } from './CourseCard';

// Get all popular courses to display in the slider
const popularCourses = allCourses.filter(course => course.popular);

const RealProjectsShowcase: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
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
