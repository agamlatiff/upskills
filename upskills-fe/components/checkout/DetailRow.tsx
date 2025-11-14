import React from 'react';
import { ClipboardListIcon } from '../Icons';

export const DetailRow: React.FC<{ label: string; value: string; isBold?: boolean }> = ({ label, value, isBold = false }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center text-slate-400">
            <ClipboardListIcon className="h-5 w-5 text-slate-500" />
            <span className="ml-3">{label}</span>
        </div>
        <span className={`font-semibold ${isBold ? 'text-xl text-white' : 'text-slate-200'}`}>{value}</span>
    </div>
);
