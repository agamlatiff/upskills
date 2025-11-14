

import React from 'react';
import { Link } from 'react-router-dom';
import { DesktopIcon, ServerIcon, ChartBarIcon, PaletteIcon } from './Icons';
import { PathCard } from './PathCard';

const learningPaths = [
  {
    id: 'frontend-developer',
    Icon: DesktopIcon,
    title: 'Frontend Developer',
    description: 'Learn modern frameworks, UI principles, and responsive design to build stunning user interfaces.',
  },
  {
    id: 'backend-developer',
    Icon: ServerIcon,
    title: 'Backend Developer',
    description: 'Master APIs, databases, and scalable server-side architectures to power applications.',
  },
  {
    id: 'data-analyst',
    Icon: ChartBarIcon,
    title: 'Data Analyst',
    description: 'Analyze data, create insightful dashboards, and tell compelling stories with data.',
  },
  {
    id: 'ui-ux-designer',
    Icon: PaletteIcon,
    title: 'UI/UX Designer',
    description: 'Design human-centered interfaces with Figma, user research, and usability testing.',
  },
];

const LearningPaths: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Choose Your Learning Path
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            Follow guided, expert-crafted roadmaps and build real projects that accelerate your career.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {learningPaths.map((path) => (
            <PathCard key={path.title} path={path} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningPaths;
