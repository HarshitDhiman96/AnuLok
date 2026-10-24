import React from 'react';
import Hero from '../components/home/Hero';
import StoreExperience from '../components/home/StoreExperience';
import OpeningExperience from '../components/home/OpeningExperience';
import FeaturedProducts from '../components/home/FeaturedProducts';
import MembershipPlans from '../components/home/MembershipPlans';
import CraftStory from '../components/home/CraftStory';
import StoreLocation from '../components/common/StoreLocation';
import { Star, Quote } from 'lucide-react';

export default function HomePage() {
  const testimonials = [
    {
      quote: "The Aura curved bouclé sofa completely transformed our penthouse living room. The texture, weight of the timber frame, and posture ergonomics are on par with Milanese design houses at a fraction of the cost.",
      author: "Aditi Rao & Vikram Sengupta",
      role: "Architect & Interior Stylist",
      location: "Bengaluru",
      rating: 5
    },
    {
      quote: "White-glove delivery in Mumbai was flawless. The Kyoto Teak bed arrived in four beautifully packed crates and was assembled within 25 minutes. No squeaks, solid as a rock, and the teak grain smells divine.",
      author: "Dr. Kunal Singhania",
      role: "Verified Collector",
      location: "Mumbai",
      rating: 5
    },
    {
      quote: "Finding authentic solid wood without veneer laminates is rare in India today. Anulok's dining table has become the emotional heart of our family home. The honed Carrara marble is breathtaking.",
      author: "Radhika Kulkarni",
      role: "Creative Director",
      location: "New Delhi",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <OpeningExperience />
      <Hero />
      <StoreExperience />
      <FeaturedProducts />
      <MembershipPlans />
      <CraftStory />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <StoreLocation />
      </div>

      {/* Testimonials */}
      <section className="py-24 bg-anulok-linen/60 border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
              In Loving Homes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-anulok-espresso mt-2">
              Words From Our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-xs border border-stone-200/70 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-amber-500 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-anulok-wood/20 mb-3" />
                  <p className="text-stone-600 text-sm leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>
                <div className="border-t border-stone-100 pt-4">
                  <p className="text-sm font-bold text-anulok-espresso">{t.author}</p>
                  <p className="text-xs text-stone-500">{t.role} • {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
