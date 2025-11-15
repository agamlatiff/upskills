
import React from 'react';
import { Link } from 'react-router-dom';
import { PlayIcon, CrownIcon, StarIcon } from './Icons';
import { UserAvatar } from './hero/UserAvatar';
import { RoadmapCard } from './hero/RoadmapCard';
import { CodeEditor } from './hero/CodeEditor';

const Hero: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-slate-800 text-blue-400 font-semibold px-4 py-1.5 rounded-full mb-8">
              <CrownIcon className="h-5 w-5 mr-2" />
              Powering careers at 500+ top companies
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white">
              Master In-Demand Tech  <span className="block text-blue-500 ">Skills, Accelerate Your Career</span>
            </h1>
            <p className="mt-8 max-w-xl mx-auto lg:mx-0 text-lg text-slate-400 leading-relaxed">
              Dive into comprehensive learning paths designed by industry experts. Build real-world projects and get the guidance you need to land your dream job.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-transform hover:scale-105 duration-300">
                Get Started
              </Link>
              <Link to="/#learning-paths" className="inline-flex items-center justify-center px-8 py-3 bg-slate-800 text-slate-200 font-semibold rounded-full shadow-md ring-1 ring-slate-700 hover:bg-slate-700 transition-transform hover:scale-105 duration-300">
                <PlayIcon className="h-6 w-6 mr-2 text-blue-500" />
                How It Works
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center lg:justify-start">
              <div className="flex -space-x-2">
                <UserAvatar src="https://picsum.photos/id/1005/40/40" />
                <UserAvatar src="https://picsum.photos/id/1011/40/40" />
                <UserAvatar src="https://picsum.photos/id/1025/40/40" />
                <UserAvatar src="https://picsum.photos/id/1027/40/40" />
                <UserAvatar src="https://picsum.photos/id/1028/40/40" />
              </div>
              <div className="ml-4 text-left">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                   <span className="ml-2 font-bold text-slate-200">5.0</span>
                </div>
                <p className="text-sm text-slate-400">Join thousands of successful developers</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Visuals */}
          <div className="relative mt-12 lg:mt-0">
              <RoadmapCard />
              <CodeEditor />
              <div className="absolute -bottom-10 -right-10 w-56 h-40 hidden lg:block">
                  <img src="https://picsum.photos/seed/devteam/300/200" alt="Developers collaborating" className="rounded-2xl shadow-2xl object-cover w-full h-full" />
              </div>
              <div className="absolute bottom-10 -left-10 w-16 h-16 bg-teal-300 rounded-full hidden lg:block"></div>
              <div className="absolute -top-10 right-0 w-20 h-20 bg-blue-200 rounded-2xl transform rotate-12 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
