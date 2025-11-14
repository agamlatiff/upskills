import React, { useState, useEffect, useCallback } from 'react';
import { CheckBadgeIcon, ChevronLeftIcon, ChevronRightIcon } from '../../components/Icons';
import { TestimonialCard } from '../../components/TestimonialCard';

const testimonials = [
  {
    avatar: 'https://picsum.photos/id/1027/100/100',
    name: 'Rafi',
    title: 'Junior Backend Developer',
    company: 'Innovate Inc.',
    quote: 'Upskill’s roadmap made the learning curve predictable—I shipped three portfolio projects and landed a job in 7 weeks.',
    outcome: 'Hired · 7 weeks',
  },
  {
    avatar: 'https://picsum.photos/id/1011/100/100',
    name: 'Maya',
    title: 'Freelance UI/UX Designer',
    company: 'Self-Employed',
    quote: 'Mentor feedback turned my side project into a real product. Clients now pay me $1.5k/month for similar work.',
    outcome: 'Freelance · $1.5k/mo',
  },
  {
    avatar: 'https://picsum.photos/id/1025/100/100',
    name: 'Hendra',
    title: 'Frontend Engineer',
    company: 'Tech Solutions',
    quote: 'The interview prep was the differentiator—I passed onsite interviews at two startups and accepted a great offer.',
    outcome: 'Hired · 2 startups',
  },
  {
    avatar: 'https://picsum.photos/id/1005/100/100',
    name: 'Alya Rizki',
    title: 'Junior Frontend Developer',
    company: 'Tokopedia',
    quote: 'I landed a junior frontend role within 6 weeks of completing the Frontend Roadmap. The portfolio I built was key.',
    outcome: 'Hired · 6 weeks',
  },
  {
    avatar: 'https://picsum.photos/id/1028/100/100',
    name: 'Chen',
    title: 'Data Analyst',
    company: 'Data Insights Co.',
    quote: 'The real-world projects helped me build a practical skillset that employers were looking for. I felt confident in my interviews.',
    outcome: 'Hired · 4 weeks',
  },
  {
    avatar: 'https://picsum.photos/id/1012/100/100',
    name: 'Elena',
    title: 'DevOps Engineer',
    company: 'CloudFlow',
    quote: 'The hands-on labs with Docker and Kubernetes were invaluable. I was able to speak to my experience directly and got hired.',
    outcome: 'Promoted · New Role',
  },
];

const Testimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = useCallback(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, []);
  
    const prev = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };
    
    useEffect(() => {
      const timer = setInterval(next, 7000); // auto-slide every 7 seconds
      return () => clearInterval(timer);
    }, [next]);

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

            <div className="mt-16 relative max-w-3xl mx-auto">
            <div className="overflow-hidden">
                <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                {testimonials.map((testimonial) => (
                    <div key={testimonial.name} className="w-full flex-shrink-0">
                        <TestimonialCard testimonial={testimonial} />
                    </div>
                ))}
                </div>
            </div>
            
            {/* Controls */}
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
            </div>
        </div>
        </section>
    </main>
  );
};

export default Testimonials;