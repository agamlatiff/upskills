import React from 'react';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon } from './Icons';
import { Testimonial } from '../types/api';
import { getProfilePhotoUrl } from '../utils/imageUrl';

export const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
    const user = testimonial.user;
    const userName = user?.name || 'Anonymous';
    const userPhoto = user?.photo ? getProfilePhotoUrl(user.photo) : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=1e293b&color=fff';
    const userTitle = user?.occupation || '';
    const company = ''; // Not in API, could be added later

    return (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <img src={userPhoto} alt={`Avatar of ${userName}`} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                        <p className="font-bold text-white">{userName}</p>
                        <p className="text-sm text-slate-400">
                            {userTitle}
                            {company && ` at ${company}`}
                        </p>
                    </div>
                </div>
                {testimonial.is_verified && (
                    <div className="flex-shrink-0">
                        <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-500">
                            <CheckBadgeIcon className="h-5 w-5 text-blue-500" />
                            Verified
                        </div>
                    </div>
                )}
            </div>
            <blockquote className="relative flex-grow">
                <p className="text-slate-300 leading-relaxed z-10 relative">
                    <span className="absolute -left-2 -top-2 text-6xl text-slate-800/50 font-serif z-0">"</span>
                    {testimonial.quote}
                </p>
            </blockquote>
            {testimonial.outcome && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="font-semibold text-slate-200 text-sm">{testimonial.outcome}</p>
                </div>
            )}
            {testimonial.course && (
                <div className="mt-2">
                    <Link 
                        to={`/courses/${testimonial.course.slug}`}
                        className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                    >
                        View Course: {testimonial.course.name} →
                    </Link>
                </div>
            )}
        </div>
    );
};
