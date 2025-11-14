import React from 'react';
import { allCourses } from '../data/courses';
import { CourseCard } from './CourseCard';

const freeCourses = allCourses.filter(course => course.isFree);

const FreeCourses: React.FC = () => {
  if (freeCourses.length === 0) {
    return null;
  }

  return (
    <section id="free-courses" className="py-16 sm:py-20 lg:py-24 bg-brand-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Start Learning for Free
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            Get a taste of our platform with these free introductory courses. No credit card required.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {freeCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeCourses;