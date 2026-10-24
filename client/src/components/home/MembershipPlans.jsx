import React, { useState } from 'react';
import { Check, CheckCircle2, Sparkles } from 'lucide-react';

const plans = [
  {
    name: 'Essential',
    description: 'Thoughtful support for your next furniture purchase.',
    benefits: [
      'Delivery coordination for your order',
      'Installation and placement options',
      'Flexible payment and EMI guidance',
    ],
  },
  {
    name: 'Signature',
    description: 'A more personal experience, from selection to setup.',
    featured: true,
    benefits: [
      'Priority delivery scheduling',
      'In-room placement and installation',
      'Member-only furniture pricing',
      'Monthly or annual payment options',
    ],
  },
  {
    name: 'Atelier',
    description: 'Dedicated help for complete rooms and considered homes.',
    benefits: [
      'Dedicated furniture concierge',
      'Priority delivery and white-glove setup',
      'Tailored collection pricing',
      'Personalized installment and EMI guidance',
    ],
  },
];

export default function MembershipPlans() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  return (
    <section className="bg-anulok-linen/70 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-anulok-wood">
            <Sparkles className="h-3.5 w-3.5 text-anulok-amber" />
            Anulok Membership
          </span>
          <h2 className="mt-3 font-serif text-3xl font-normal text-anulok-espresso sm:text-4xl">
            A more considered way to furnish
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">
            Explore delivery, installation, member pricing and flexible payment support.
            Ask us for a tailored quote before choosing a plan.
          </p>

          <div
            className="mx-auto mt-7 inline-flex rounded-full border border-anulok-stone/70 bg-white p-1 shadow-sm"
            role="group"
            aria-label="Choose membership billing period"
          >
            {['monthly', 'annually'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setBillingPeriod(period)}
                aria-pressed={billingPeriod === period}
                className={`rounded-full px-5 py-2 text-xs font-semibold capitalize transition-colors duration-200 motion-reduce:transition-none ${
                  billingPeriod === period
                    ? 'bg-anulok-espresso text-white'
                    : 'text-stone-600 hover:text-anulok-espresso'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <p
            key={billingPeriod}
            className="mt-2 animate-fade-in text-xs text-stone-500 motion-reduce:animate-none"
            aria-live="polite"
          >
            {billingPeriod === 'monthly'
              ? 'Request a quote for monthly membership billing.'
              : 'Request a quote for annual membership billing.'}
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const inquiry = encodeURIComponent(
              `Hello, I would like a ${plan.name} Anulok membership quote with ${billingPeriod} billing. Please share the pricing, delivery and installation benefits, and available installment or EMI options.`
            );

            return (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 motion-reduce:transition-none sm:p-8 ${
                  plan.featured
                    ? 'border-anulok-wood shadow-luxury md:-translate-y-2'
                    : 'border-stone-200/80 hover:-translate-y-1 hover:shadow-luxury'
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-anulok-wood px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="font-serif text-2xl text-anulok-espresso">{plan.name}</h3>
                <p className="mt-2 min-h-10 text-sm leading-relaxed text-stone-600">
                  {plan.description}
                </p>

                <div
                  key={`${plan.name}-${billingPeriod}`}
                  className="my-6 min-h-[76px] animate-fade-in border-y border-stone-100 py-4 motion-reduce:animate-none"
                  aria-live="polite"
                >
                  <p className="font-serif text-xl font-semibold text-anulok-espresso">
                    Request a quote
                  </p>
                  <p className="mt-1 text-xs capitalize text-stone-500">
                    {billingPeriod} billing · no online charge
                  </p>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-stone-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-anulok-wood" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`https://wa.me/919368656212?text=${inquiry}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest transition-colors ${
                    plan.featured
                      ? 'bg-anulok-wood text-white hover:bg-anulok-walnut'
                      : 'bg-anulok-espresso text-white hover:bg-anulok-wood'
                  }`}
                >
                  <Check className="h-4 w-4" />
                  Enquire on WhatsApp
                </a>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-stone-500">
          Delivery and installation benefits depend on location and order. EMI and installment
          availability is subject to the selected provider’s terms and approval.
        </p>
      </div>
    </section>
  );
}
