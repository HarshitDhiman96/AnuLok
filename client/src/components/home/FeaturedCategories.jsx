import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../../services/api';

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    api.getCategories()
      .then(({ categories: rows = [] }) => {
        if (active) setCategories(rows.filter(category => category.featured));
      })
      .catch(error => console.error('Failed to load featured categories', error));
    return () => { active = false; };
  }, []);

  if (!categories.length) return null;

  return (
    <section id="categories" className="scroll-mt-20 bg-anulok-linen/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-anulok-wood">Curated Living Spaces</span>
          <h2 className="mt-2 font-serif text-3xl font-normal text-anulok-espresso sm:text-4xl">Featured Categories</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(category => (
            <Link key={category.id} to={`/shop?category=${category.slug}`} className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs transition hover:border-anulok-wood/40 hover:shadow-luxury">
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img src={category.image} alt={category.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-anulok-espresso">{category.itemCount || 0} Models</span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-bold text-anulok-espresso group-hover:text-anulok-wood">{category.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">{category.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3 text-xs font-semibold uppercase tracking-wider text-anulok-wood">
                  <span>Explore</span><ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
