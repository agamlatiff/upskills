import React from 'react';
import { StarIcon, CalendarIcon, BriefcaseIcon, ClipboardListIcon } from '../Icons';

export const RoadmapCard: React.FC = () => (
    <div className="absolute -top-12 -left-12 w-64 bg-brand-blue-950/60 backdrop-blur-sm p-5 rounded-2xl shadow-2xl border border-brand-blue-900 hidden lg:block">
      <div className="flex items-center justify-center space-x-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
        ))}
      </div>
      <h3 className="font-bold text-center text-slate-100 mb-4">Expert-Crafted Roadmaps</h3>
      <ul className="space-y-3 text-slate-400">
        <li className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-blue-500" />
          <span>3 Months Access</span>
        </li>
        <li className="flex items-center gap-3">
          <BriefcaseIcon className="h-5 w-5 text-blue-500" />
          <span>Work Portfolio</span>
        </li>
        <li className="flex items-center gap-3">
          <ClipboardListIcon className="h-5 w-5 text-blue-500" />
          <span>Test Interviews</span>
        </li>
      </ul>
    </div>
  );
