import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePricing } from "../../hooks/usePricing";
import { useAuth } from "../../hooks/useAuth";
import { CheckIcon, StarIcon } from "../../components/Icons";

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const { pricingPlans, loading, error } = usePricing();
  const { isAuthenticated } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <main>
        <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <svg
                  className="animate-spin h-12 w-12 text-blue-500 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-4 text-slate-400">Loading pricing plans...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Error Loading Pricing
              </h2>
              <p className="text-red-400 mb-6">{error}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const planFeatures = [
    "Access All Online Courses",
    "Get Premium Courses",
    "High Quality Work Portfolio",
    "Career Consultation 2025",
    "Support learning 24/7",
  ];

  return (
    <main>
      <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Choose a plan that fits your goals. No hidden fees—start learning
              instantly.
            </p>
          </div>

          {pricingPlans.length > 0 ? (
            <>
              <div className="mt-12 mx-auto grid max-w-md grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-3">
                {pricingPlans.map((plan) => {
                  const isSubscribed = plan.is_subscribed;
                  const cardClasses = `relative flex flex-col p-8 rounded-2xl border ${
                    plan.is_populer
                      ? "bg-brand-dark border-blue-500 shadow-2xl shadow-blue-500/20"
                      : "bg-slate-900 border-slate-800"
                  } transform transition-transform duration-300 hover:-translate-y-2`;

                  return (
                    <div key={plan.id} className={cardClasses}>
                      {plan.is_populer && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            Popular
                          </span>
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-slate-400 mb-6">
                          {plan.duration} months duration
                        </p>

                        <div className="mb-6">
                          <span className="text-4xl font-extrabold text-white">
                            {formatCurrency(plan.price)}
                          </span>
                          <span className="text-slate-400 ml-2">
                            / {plan.duration} months
                          </span>
                        </div>

                        <ul className="space-y-3 mb-8">
                          {planFeatures.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-slate-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {isAuthenticated ? (
                        isSubscribed ? (
                          <button
                            disabled
                            className="w-full text-center py-3 font-semibold rounded-full bg-slate-700 text-slate-400 cursor-not-allowed"
                          >
                            Currently Active
                          </button>
                        ) : (
                          <Link
                            to={`/checkout/${plan.id}`}
                            className="w-full text-center py-3 font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors block"
                          >
                            Subscribe Now
                          </Link>
                        )
                      ) : (
                        <Link
                          to="/signup"
                          className="w-full text-center py-3 font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors block"
                        >
                          Get Started
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="mt-12 text-center">
              <p className="text-slate-400">
                No pricing plans available at the moment.
              </p>
            </div>
          )}

          <div className="mt-12 text-center text-sm text-slate-400">
            <p>
              Join thousands of learners building their tech careers with
              Upskill. Start free—upgrade anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Pricing;
