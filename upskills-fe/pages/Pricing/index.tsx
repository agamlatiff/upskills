import React, { useState } from 'react';
import { plans, PricingCard } from '../../components/PricingCard';

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <main>
        <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-slate-400">
                Choose a plan that fits your goals. No hidden fees—start learning instantly.
            </p>
            </div>

            <div className="mt-10 flex justify-center items-center space-x-4">
            <span className={`font-medium ${!isYearly ? 'text-white' : 'text-slate-400'}`}>Monthly</span>
            <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                isYearly ? 'bg-blue-600' : 'bg-slate-700'
                }`}
            >
                <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isYearly ? 'translate-x-5' : 'translate-x-0'
                }`}
                />
            </button>
            <span className={`font-medium ${isYearly ? 'text-white' : 'text-slate-400'}`}>Yearly</span>
            <span className="text-xs font-semibold text-brand-teal bg-teal-500/10 px-2 py-1 rounded-full">Save 20%</span>
            </div>

            <div className="mt-12 mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-3xl lg:grid-cols-2">
            {plans.map((plan) => (
                <PricingCard key={plan.title} plan={plan} isYearly={isYearly} />
            ))}
            </div>

            <div className="mt-12 text-center text-sm text-slate-400">
                <p>Join thousands of learners building their tech careers with Upskill. Start free—upgrade anytime.</p>
            </div>
        </div>
        </section>
    </main>
  );
};

export default Pricing;