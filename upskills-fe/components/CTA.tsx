
import React from 'react';

const CTA: React.FC = () => {
  return (
    <section className="relative bg-brand-dark py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue-800 via-brand-dark to-slate-900"></div>
      
      {/* Abstract background shapes */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-900/40 rounded-full filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-teal/10 rounded-full filter blur-3xl opacity-50 translate-x-1/4 translate-y-1/4"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white">
            Start Your Tech Journey Today
          </h2>
          <p className="mt-6 text-lg text-slate-300 leading-relaxed">
            Join 5,000+ learners who are leveling up their skills with Upskill’s expert-led roadmaps, hands-on projects, and dedicated career support.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="#" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-bold rounded-full shadow-lg hover:bg-slate-200 transition-transform hover:scale-105 duration-300">
              Get Started Free
            </a>
            <a href="#" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-transparent text-slate-200 font-semibold rounded-full ring-1 ring-slate-500 hover:bg-slate-800/50 transition-colors duration-300">
              View Roadmaps
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-400">
            No credit card required — start learning today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
