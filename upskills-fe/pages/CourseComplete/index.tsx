
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { allCourses } from '../../data/courses';
import { TrophyIcon, MapIcon } from '../../components/Icons';

const CourseComplete: React.FC = () => {
    const { courseSlug } = useParams<{ courseSlug: string }>();
    const course = allCourses.find(c => c.slug === courseSlug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [courseSlug]);

    if (!course) {
        return (
             <div className="flex items-center justify-center h-screen bg-slate-900">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
                    <p className="text-slate-400 mb-8">We couldn't find the course you were looking for.</p>
                    <Link to="/courses" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="py-16 sm:py-20 lg:py-24 bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <TrophyIcon className="h-24 w-24 mx-auto text-yellow-400 mb-6" />
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Congratulations!</h1>
                    <p className="mt-4 text-lg text-slate-300">
                        You have successfully completed the course:
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-blue-400">{course.title}</h2>

                    <div className="mt-12 p-8 bg-brand-dark border border-slate-800 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-6">What's Next?</h3>
                        <div className="grid grid-cols-1 sm:max-w-xs mx-auto">
                            {/* Action Card: Explore More */}
                            <div className="flex flex-col items-center p-6 bg-slate-800/50 rounded-lg">
                                <MapIcon className="h-10 w-10 text-blue-400 mb-4" />
                                <h4 className="font-semibold text-white mb-2">Keep Learning</h4>
                                <Link to="/courses" className="w-full mt-auto text-center px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                                    Explore More Courses
                                </Link>
                            </div>
                        </div>
                    </div>

                     <div className="mt-12">
                        <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CourseComplete;
