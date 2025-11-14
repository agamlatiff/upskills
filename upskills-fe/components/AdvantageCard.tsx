import React from 'react';

type Advantage = {
    Icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
}

export const AdvantageCard: React.FC<{ advantage: Advantage }> = ({ advantage }) => (
  <div className="bg-brand-blue-950/50 p-6 rounded-2xl transition-all duration-300 hover:bg-brand-blue-950 backdrop-blur-sm border border-brand-blue-900">
    <div className="bg-slate-800/50 rounded-lg p-3 inline-block mb-4">
      <advantage.Icon className="h-7 w-7 text-slate-300" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{advantage.title}</h3>
    <p className="text-slate-400">{advantage.description}</p>
  </div>
);
