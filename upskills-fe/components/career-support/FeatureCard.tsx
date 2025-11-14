import React from 'react';

type Feature = {
    Icon: React.FC<{ className?: string }>;
    title: string;
    description: string;
}

export const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => (
    <div className="bg-brand-dark p-6 rounded-2xl border border-slate-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-slate-700">
        <div className="bg-slate-800 text-blue-400 rounded-full h-12 w-12 flex items-center justify-center mb-4">
            <feature.Icon className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
        <p className="text-slate-400 text-sm">{feature.description}</p>
    </div>
);
