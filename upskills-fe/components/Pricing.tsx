

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from './Icons';

const plans = [
  {
    title: 'Starter',
    description: 'Perfect for beginners exploring tech careers.',
    price: { monthly: 0, yearly: 0 },
    features: [
      'Access to all Free Courses',
      'Access to 1 Learning Path',
      'Community discussion forum',
      'Free roadmap previews',
      'Limited projects',
    ],
    cta: 'Get Started',
    ctaLink: '/signup',
  },
  {
    title: 'Pro',
    description: 'Best for serious learners building portfolios.',
    price: { monthly: 435000, yearly: 4300000 },
    features: [
      'All Learning Paths',
      'Unlimited projects & mentorship',
      'Resume & portfolio review',
      'Career support tools',
    ],
    cta: 'Upgrade to Pro',
    ctaLink: '/checkout',
    isPopular: true,
  },
];

type Plan = typeof plans[0];

const PricingCard: React.FC<{ plan: Plan; isYearly: boolean }> = ({ plan, isYearly }) => {
  const isPopular = plan.isPopular;
  const price = isYearly ? plan.price.yearly : plan.price.monthly;
  const formattedPrice = price === 0 ? 'Free' : `Rp ${price.toLocaleString('id-ID')}`;
  const pricePeriod = isYearly ? '/year' : '/month';

  const cardClasses = `relative flex flex-col p-8 rounded-2xl border ${
    isPopular 
      ? 'bg-brand-dark border-blue-500 shadow-2xl shadow-blue-500/20' 
      : 'bg-slate-900 border-slate-800'
  } transform transition-transform duration-300 hover:-translate-y-2`;
  
  const ctaClasses = `w-full text-center py-3 font-semibold rounded-full transition-colors duration-300 ${
    isPopular
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-transparent text-blue-400 border border-blue-600 hover:bg-blue-600/20'
  }`;

  return (
    <div className={cardClasses}>
      {isPopular && (
        <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
          <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Most Popular</span>
        </div>
      )}
      <h3 className="text-xl font-bold text-white">{plan.title}</h3>
      <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
      
      <div className="mt-6">
        <span className="text-4xl font-extrabold text-white">{formattedPrice}</span>
        {price > 0 && (
          <span className="ml-2 text-base font-medium text-slate-400">
            {pricePeriod}
          </span>
        )}
      </div>

      <Link to={plan.ctaLink} className={`mt-8 ${ctaClasses}`}>
        {plan.cta}
      </Link>

      <ul className="mt-8 space-y-4 flex-grow">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start">
            <CheckIcon className={`h-6 w-6 flex-shrink-0 mr-3 ${isPopular ? 'text-blue-500' : 'text-brand-teal'}`} />
            <span className="text-sm text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

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