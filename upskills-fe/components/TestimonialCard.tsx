import React from 'react';
import { CheckBadgeIcon } from './Icons';

type Testimonial = {
    avatar: string;
    name: string;
    title: string;
    company: string;
    quote: string;
    outcome: string;
}

export const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
                <img src={testimonial.avatar} alt={`Avatar of ${testimonial.name}`} className="w-14 h-14 rounded-full object-cover" />
                <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.title} at {testimonial.company}</p>
                </div>
            </div>
            <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal">
                    <CheckBadgeIcon className="h-5 w-5" />
                    Verified
                </div>
            </div>
        </div>
        <blockquote className="relative flex-grow">
            <p className="text-slate-300 leading-relaxed z-10 relative">
                <span className="absolute -left-2 -top-2 text-6xl text-slate-800/50 font-serif z-0">“</span>
                {testimonial.quote}
            </p>
        </blockquote>
        <div className="mt-4 pt-4 border-t border-slate-700">
            <p className="font-semibold text-slate-200 text-sm">{testimonial.outcome}</p>
        </div>
    </div>
);
