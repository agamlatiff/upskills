import React, { useState } from 'react';
import { TestimonialCard } from '../../components/TestimonialCard';
import { useTestimonials } from '../../hooks/useTestimonials';

type FilterType = 'all' | 'verified';

const Testimonials: React.FC = () => {
    const [filter, setFilter] = useState<FilterType>('all');
    const { testimonials: allTestimonials, loading: loadingAll } = useTestimonials({ 
        limit: 100 
    });
    const { testimonials: verifiedTestimonials, loading: loadingVerified } = useTestimonials({ 
        verified: true, 
        limit: 100 
    });

    const testimonials = filter === 'verified' ? verifiedTestimonials : allTestimonials;
    const loading = filter === 'verified' ? loadingVerified : loadingAll;
    const verifiedCount = verifiedTestimonials.length;
    const totalCount = allTestimonials.length;

    return (
        <main>
            <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                            Success Stories from Upskills Learners
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                            Real outcomes—jobs, promotions, and portfolio wins.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded-full border transition-all ${
                                filter === 'all'
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'
                            }`}
                        >
                            All ({totalCount})
                        </button>
                        <button
                            onClick={() => setFilter('verified')}
                            className={`px-6 py-2 rounded-full border transition-all ${
                                filter === 'verified'
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500'
                            }`}
                        >
                            Verified ({verifiedCount})
                        </button>
                    </div>

                    {loading ? (
                        <div className="mt-16 text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            <p className="text-slate-400 mt-4">Loading testimonials...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <div className="mt-16 text-center bg-slate-800/50 rounded-xl border border-slate-700 p-12">
                            <svg
                                className="w-16 h-16 text-slate-500 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            <p className="text-slate-400 text-lg mb-2">
                                {filter === 'verified' 
                                    ? 'No verified testimonials yet.' 
                                    : 'No testimonials available yet.'}
                            </p>
                            <p className="text-slate-500 text-sm">
                                {filter === 'verified' 
                                    ? 'Check back soon for verified testimonials from our learners!' 
                                    : 'Be the first to share your success story!'}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testimonials.map((testimonial) => (
                                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Testimonials;