import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CraftStory() {
  return (
    <section className="py-24 bg-white border-t border-stone-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Images Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-stone-100 shadow-luxury">
                  <img
                    src="https://images.unsplash.com/photo-1540518614846-7ede433c4efc?auto=format&fit=crop&w=800&q=80"
                    alt="Artisan Joinery Craft"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 bg-anulok-linen rounded-2xl border border-stone-200">
                  <p className="font-serif text-3xl font-bold text-anulok-espresso">40+</p>
                  <p className="text-xs text-stone-600 uppercase tracking-wider font-semibold mt-1">
                    Years of Master Joinery Experience
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-6 bg-anulok-espresso text-white rounded-2xl">
                  <p className="font-serif text-3xl font-bold text-anulok-sand">100%</p>
                  <p className="text-xs text-stone-300 uppercase tracking-wider font-light mt-1">
                    Non-Toxic Organic Oils & Natural Waxes
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-stone-100 shadow-luxury">
                  <img
                    src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
                    alt="Teak Grain Texture"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:pl-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
              The Anulok Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-anulok-espresso mt-3 leading-tight">
              Rooted in Nature. Shaped by Human Hands.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-6">
              We reject mass-produced MDF and plastic laminates. Every Anulok piece begins with sustainably harvested timber—aged solid Teak, vibrant Sheesham, and European White Oak—seasoned naturally under the sun.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-4">
              Our carpenters utilize traditional interlocking mortise-and-tenon joints that withstand climatic variations for decades, finished by hand with linseed oil and carnauba wax to breathe warmth into your sanctuary.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 text-xs font-semibold text-anulok-espresso">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-anulok-wood shrink-0" />
                <span>Zero Fast-Furniture Veneers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-anulok-wood shrink-0" />
                <span>Kiln-Dried Moisture Stabilized</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-anulok-wood shrink-0" />
                <span>Heavy-Gauge German Hardware</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-anulok-wood shrink-0" />
                <span>Ethical Sustainable Plantations</span>
              </div>
            </div>

            <div className="mt-10">
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-anulok-wood hover:text-anulok-espresso transition-colors group"
              >
                <span>Read our craft manifesto</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
