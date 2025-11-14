import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from './Icons';

export const plans = [
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

export const PricingCard: React.FC<{ plan: Plan; isYearly: boolean }> = ({ plan, isYearly }) => {
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
