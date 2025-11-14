import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TrophyIcon,
    FilledCheckCircleIcon
} from '../../components/Icons';
import { DetailRow } from '../../components/checkout/DetailRow';


const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const planFeatures = [
        'Access 1500+ Online Courses',
        'Get Premium Certifications',
        'High Quality Work Portfolio',
        'Career Consultation 2025',
        'Support learning 24/7'
    ];

    return (
        <main className="py-16 sm:py-20 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main checkout card */}
                <div className="max-w-6xl mx-auto bg-slate-900 rounded-2xl shadow-2xl shadow-blue-500/10 border border-slate-800 p-8 sm:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-16">
                        
                        {/* Left Column: Details */}
                        <div className="lg:col-span-3">
                            <h1 className="text-3xl font-bold text-white mb-8">Checkout Pro</h1>

                            {/* Give Access To */}
                            <section className="mb-10">
                                <h2 className="text-lg font-semibold text-slate-300 mb-4">Give Access to</h2>
                                <div className="flex items-center justify-between bg-brand-dark border border-slate-700 rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <img src="https://i.pravatar.cc/48?u=bigboymonster" alt="User Avatar" className="h-12 w-12 rounded-full" />
                                        <div>
                                            <p className="font-bold text-white">Big Boy</p>
                                            <p className="text-sm text-slate-400">Monster</p>
                                        </div>
                                    </div>
                                    <a href="#" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-opacity">Change Account</a>
                                </div>
                            </section>

                            {/* Transaction Details */}
                            <section>
                                <h2 className="text-lg font-semibold text-slate-300 mb-2">Transaction Details</h2>
                                <div className="divide-y divide-slate-700">
                                    <DetailRow
                                        label="Subscription Package"
                                        value="Rp 299.000"
                                    />
                                    <DetailRow
                                        label="Access Duration"
                                        value="1 Months"
                                    />
                                    <DetailRow
                                        label="Started At"
                                        value="13 Nov, 2025"
                                    />
                                    <DetailRow
                                        label="Ended At"
                                        value="13 Dec, 2025"
                                    />
                                    <DetailRow
                                        label="PPN 11%"
                                        value="Rp 32.890"
                                    />
                                    <DetailRow
                                        label="Grand Total"
                                        value="Rp 331.890"
                                        isBold={true}
                                    />
                                </div>
                            </section>
                            
                            {/* Action Buttons */}
                            <div className="mt-10 flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/pricing')}
                                    className="w-full px-6 py-3 text-center font-semibold text-slate-300 rounded-xl border border-slate-700 hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button className="w-full px-6 py-3 text-center font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-opacity">
                                    Pay Now
                                </button>
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-4">
                                By proceeding you agree to our Terms & Conditions.
                            </p>
                        </div>

                        {/* Right Column: Plan Card */}
                        <div className="lg:col-span-2">
                            <div className="bg-brand-dark rounded-2xl p-6 border border-slate-800 h-full">
                                <div className="relative">
                                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop" alt="Team collaborating" className="rounded-xl w-full h-48 object-cover"/>
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                                        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center">
                                            <TrophyIcon className="h-6 w-6"/>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Pro Team</h3>
                                            <p className="text-sm text-slate-400">1 months duration</p>
                                        </div>
                                    </div>
                                </div>
                                <ul className="mt-16 space-y-3">
                                    {planFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-center">
                                            <FilledCheckCircleIcon className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0" />
                                            <span className="text-slate-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;