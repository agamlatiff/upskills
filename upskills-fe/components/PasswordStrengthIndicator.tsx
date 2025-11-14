import React from 'react';

export const PasswordStrengthIndicator: React.FC<{ level: number }> = ({ level }) => {
    const strength = {
        0: { label: '', color: '', textColor: '' },
        1: { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400' },
        2: { label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-400' },
        3: { label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
        4: { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-400' },
    };

    const currentStrength = strength[level as keyof typeof strength] || strength[0];
    const barCount = 4;

    return (
        <div className="flex items-center mt-2 space-x-2">
            <div className="flex-1 grid grid-cols-4 gap-x-1.5">
                {Array.from({ length: barCount }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-colors ${index < level ? currentStrength.color : 'bg-slate-700'}`}
                    />
                ))}
            </div>
            <p className={`text-xs font-medium w-14 text-right transition-colors ${currentStrength.textColor}`}>
                {currentStrength.label}
            </p>
        </div>
    );
};
