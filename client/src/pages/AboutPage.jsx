import React from 'react';
import { Award, Trees, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import StoreLocation from '../components/common/StoreLocation';

export default function AboutPage() {
  return (
    <div className="bg-anulok-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Story Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
            The Anulok Manifesto
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-normal text-anulok-espresso mt-3 leading-tight">
            Furniture That Inspires Peace & Endures Generations
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed mt-6 font-light">
            Founded with an uncompromising belief that a home should be an oasis of quiet beauty. Anulok crafts sculptural, solid-timber heirlooms using traditional Japanese joinery and Indian master woodcraft.
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="rounded-3xl overflow-hidden shadow-luxury border border-stone-200">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=85"
            alt="Anulok Studio Atelier"
            className="w-full h-[50vh] object-cover"
          />
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-anulok-linen flex items-center justify-center text-anulok-wood mb-5">
              <Trees className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-anulok-espresso mb-2">Sustainable Agro-Forestry</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Every log of Indian Teak and Sheesham is sourced from certified regenerative government plantations. For every tree harvested, five indigenous saplings are nurtured to maturity.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-anulok-linen flex items-center justify-center text-anulok-wood mb-5">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-anulok-espresso mb-2">Generational Woodcrafters</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Our atelier employs over 85 master artisans across Karnataka and Rajasthan. Every curve, chamfered edge, and dovetail joint is hand-inspected with generational pride.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-anulok-linen flex items-center justify-center text-anulok-wood mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-anulok-espresso mb-2">10-Year Craft Guarantee</h3>
            <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
              Unlike fast-furniture designed to degrade within 3 years, Anulok frames are engineered to be passed down through family generations, aging into a richer patina with each decade.
            </p>
          </div>
        </div>

        <StoreLocation dark />
      </div>
    </div>
  );
}
