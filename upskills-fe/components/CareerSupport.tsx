import React from 'react';
import { AcademicCapIcon, DocumentCheckIcon, ChatBubbleLeftRightIcon, GlobeAltIcon } from './Icons';
import { FeatureCard } from './career-support/FeatureCard';

const supportFeatures = [
  {
    Icon: AcademicCapIcon,
    title: '1-on-1 Mentorship',
    description: 'Get personalized advice and project feedback from experienced professionals.',
  },
  {
    Icon: DocumentCheckIcon,
    title: 'Resume & Portfolio Review',
    description: 'Learn how to present your skills and showcase your projects effectively.',
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    title: 'Mock Interviews & Coaching',
    description: 'Practice real-world technical and behavioral interviews with experts.',
  },
  {
    Icon: GlobeAltIcon,
    title: 'Job Matching & Referrals',
    description: 'Access curated job boards, alumni networks, and partner companies.',
  },
];

const CareerSupport: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Career Support That Gets You Job-Ready
            </h2>
            <p className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-slate-300 leading-relaxed">
              Beyond learning—Upskill provides personal guidance, career tools, and networking opportunities to help you land your next role. You won’t navigate your career alone.
            </p>
            <div className="mt-10">
              <a href="#" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-transform hover:scale-105 duration-300">
                Start Your Career Journey
              </a>
            </div>
          </div>
          
          {/* Right Column - Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {supportFeatures.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerSupport;
