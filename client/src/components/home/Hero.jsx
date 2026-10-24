import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="home-content"
      className="relative flex min-h-[78vh] items-center overflow-hidden bg-anulok-espresso text-white lg:min-h-[86vh]"
    >
      <img
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=90"
        alt="Warm Anulok living room with thoughtfully crafted contemporary furniture"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-anulok-espresso/90 via-anulok-espresso/60 to-anulok-espresso/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-anulok-espresso/70 via-transparent to-anulok-espresso/20" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-anulok-cream backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-anulok-amber" />
            The 2026 Architectural Collection
          </div>

          <h1 className="mb-6 text-balance font-serif text-4xl font-normal leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Furniture that makes your space feel like{' '}
            <span className="italic text-anulok-sand">home.</span>
          </h1>

          <p className="mb-10 max-w-xl text-base font-light leading-relaxed text-stone-200/90 sm:text-lg">
            Thoughtfully designed furniture crafted for comfort, style and everyday living.
            Built by master artisans with authentic solid timber and Italian bouclé.
          </p>

          <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Link
              to="/shop"
              className="flex items-center justify-center gap-2.5 rounded-xl bg-anulok-cream px-8 py-4 text-xs font-semibold uppercase tracking-widest text-anulok-espresso shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white"
            >
              Shop Collection <ArrowRight className="h-4 w-4 text-anulok-wood" />
            </Link>
            <a
              href="#categories"
              className="flex items-center justify-center gap-2.5 rounded-xl border border-white/25 bg-white/10 px-8 py-4 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <Compass className="h-4 w-4 text-anulok-amber" />
              Explore Categories
            </a>
          </div>

          <div className="mt-14 grid max-w-lg grid-cols-3 gap-5 border-t border-white/20 pt-8">
            <div>
              <p className="font-serif text-xl font-bold text-white sm:text-2xl">100%</p>
              <p className="mt-0.5 text-[10px] font-light uppercase tracking-wider text-stone-300 sm:text-xs">
                Solid Hardwood
              </p>
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-white sm:text-2xl">10-Yr</p>
              <p className="mt-0.5 text-[10px] font-light uppercase tracking-wider text-stone-300 sm:text-xs">
                Frame Warranty
              </p>
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-white sm:text-2xl">30-Day</p>
              <p className="mt-0.5 text-[10px] font-light uppercase tracking-wider text-stone-300 sm:text-xs">
                In-Home Trial
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
