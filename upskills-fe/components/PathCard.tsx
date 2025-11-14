import React from 'react';
import { Link } from 'react-router-dom';
import { DesktopIcon, ServerIcon, ChartBarIcon, PaletteIcon } from './Icons';

type Path = {
    id: string;
    Icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
}

export const PathCard: React.FC<{ path: Path }> = ({ path }) => (
  <div className="bg-brand-dark p-8 rounded-2xl shadow-lg border border-slate-800 flex flex-col text-left hover:border-blue-700 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 hover:scale-105 transition-all duration-300">
    <div className="bg-slate-800 p-3 rounded-full self-start mb-6">
      <path.Icon className="h-8 w-8 text-blue-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{path.title}</h3>
    <p className="text-slate-400 mb-6 flex-grow">{path.description}</p>
    <Link to={`/roadmaps/${path.id}`} className="mt-auto inline-block px-6 py-2 text-blue-400 font-semibold rounded-full ring-1 ring-slate-700 hover:bg-slate-800 transition-colors">
      View Roadmap
    </Link>
  </div>
);
