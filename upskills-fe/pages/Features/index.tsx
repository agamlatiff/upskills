import React from 'react';
import { CompassIcon, CodeBracketIcon, UserGroupIcon, TrendingUpIcon } from '../../components/Icons';
import { AdvantageCard } from '../../components/AdvantageCard';

const advantages = [
  {
    Icon: CompassIcon,
    title: 'Expert-Crafted Roadmaps',
    description: 'Learn from industry professionals with curated, outcome-driven paths.',
  },
  {
    Icon: CodeBracketIcon,
    title: 'Project-Based Learning',
    description: 'Build real-world apps and showcase them in your portfolio.',
  },
  {
    Icon: UserGroupIcon,
    title: 'Personalized Mentorship',
    description: 'Get direct feedback and support from experienced mentors.',
  },
  {
    Icon: TrendingUpIcon,
    title: 'Career Acceleration Tools',
    description: 'Access mock interviews, portfolio reviews, and job placement assistance.',
  },
];


const Features: React.FC = () => {
  return (
    <main>
        <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark relative overflow-hidden">
        <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 opacity-10 pointer-events-none">
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M400 0 L800 400 L400 800 L0 400 Z" stroke="white" strokeWidth="1"/>
                <path d="M0 400 L800 400" stroke="white" strokeWidth="1"/>
                <path d="M400 0 V 800" stroke="white" strokeWidth="1"/>
                <rect x="200" y="200" width="400" height="400" stroke="white" strokeWidth="1" transform="rotate(45 400 400)"/>
            </svg>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Column */}
            <div className="text-left">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
                Why Choose Upskills
                </h2>
                <p className="text-lg text-slate-300 max-w-lg mb-8">
                A structured, guided, and hands-on learning experience designed to get you job-ready faster.
                </p>
                <div className="rounded-2xl shadow-2xl overflow-hidden h-96">
                    <img 
                        src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop"
                        alt="Students collaborating on a laptop"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-6">
                {advantages.map((advantage) => (
                <AdvantageCard key={advantage.title} advantage={advantage} />
                ))}
            </div>

            </div>
        </div>
        </section>
    </main>
  );
};

export default Features;