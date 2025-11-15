import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';
import { TestimonialCard } from './TestimonialCard';
import { useTestimonials } from '../hooks/useTestimonials';

const Testimonials: React.FC = () => {
    const { testimonials, loading } = useTestimonials({ verified: true, limit: 10 });
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = useCallback(() => {
      if (testimonials.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }
    }, [testimonials.length]);
  
    const prev = useCallback(() => {
      if (testimonials.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
      }
    }, [testimonials.length]);
    
    useEffect(() => {
      if (testimonials.length > 0) {
        const timer = setInterval(next, 7000); // auto-slide every 7 seconds
        return () => clearInterval(timer);
      }
    }, [next, testimonials.length]);

  return (
    <main>
        <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Success Stories from Upskill Learners
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                Real outcomes—jobs, promotions, and portfolio wins.
            </p>
            </div>

            {loading ? (
                <div className="mt-16 text-center">
                    <p className="text-slate-400">Loading testimonials...</p>
                </div>
            ) : testimonials.length === 0 ? (
                <div className="mt-16 text-center">
                    <p className="text-slate-400">No testimonials available yet.</p>
                </div>
            ) : (
                <div className="mt-16 relative max-w-3xl mx-auto">
                    <div className="overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id} className="w-full flex-shrink-0">
                                    <TestimonialCard testimonial={testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Controls */}
                    {testimonials.length > 1 && (
                        <>
                            <button 
                                onClick={prev} 
                                className="absolute top-1/2 -left-4 sm:-left-6 lg:-left-12 -translate-y-1/2 bg-slate-800/50 hover:bg-slate-700/80 backdrop-blur-sm text-white p-3 rounded-full z-10 transition-colors"
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeftIcon className="h-6 w-6" />
                            </button>
                            <button 
                                onClick={next} 
                                className="absolute top-1/2 -right-4 sm:-right-6 lg:-right-12 -translate-y-1/2 bg-slate-800/50 hover:bg-slate-700/80 backdrop-blur-sm text-white p-3 rounded-full z-10 transition-colors"
                                aria-label="Next testimonial"
                            >
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
                                {testimonials.map((_, index) => (
                                    <button 
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-2 w-2 rounded-full transition-colors ${currentIndex === index ? 'bg-blue-500' : 'bg-slate-600 hover:bg-slate-500'}`}
                                        aria-label={`Go to testimonial ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
        </section>
    </main>
  );
};

export default Testimonials;