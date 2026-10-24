import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const categoriesData = [
  {
    id: "sofas",
    name: "Sofas & Lounges",
    slug: "sofas",
    description: "Deep-seated sectionals and curved bouclé sofas crafted for restful moments.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    itemCount: "8 Models"
  },
  {
    id: "beds",
    name: "Beds & Mattresses",
    slug: "beds",
    description: "Solid Sheesham and Oak frames engineered for timeless sleep sanctuary.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    itemCount: "6 Models"
  },
  {
    id: "dining",
    name: "Dining Tables",
    slug: "dining",
    description: "Monolithic solid wood and honed marble surfaces for gathering.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
    itemCount: "6 Models"
  },
  {
    id: "chairs",
    name: "Accent Chairs",
    slug: "chairs",
    description: "Sculptural seating that effortlessly anchors any room with grace.",
    image: "https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80",
    itemCount: "7 Models"
  },
  {
    id: "wardrobes",
    name: "Wardrobes & Storage",
    slug: "wardrobes",
    description: "Minimalist modular armoires with fluted timber panels and brass hardware.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    itemCount: "4 Models"
  },
  {
    id: "coffee-tables",
    name: "Coffee Tables",
    slug: "coffee-tables",
    description: "Low-profile organic and geometric centerpieces in travertine and walnut.",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
    itemCount: "5 Models"
  },
  {
    id: "tv-units",
    name: "TV & Media Units",
    slug: "tv-units",
    description: "Sleek low-slung entertainment consoles with seamless cable management.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    itemCount: "4 Models"
  },
  {
    id: "office",
    name: "Office Furniture",
    slug: "office",
    description: "Ergonomic walnut desks and executive seating designed for deep focus.",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    itemCount: "4 Models"
  }
];

export default function FeaturedCategories() {
  return (
    <section id="categories" className="py-20 bg-anulok-linen/50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
              Curated Living Spaces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-anulok-espresso mt-2">
              Featured Categories
            </h2>
          </div>
          <p className="text-sm text-stone-500 max-w-md mt-3 md:mt-0 leading-relaxed">
            Every category reflects our obsession with tactile materials, proportion, and quiet functional luxury.
          </p>
        </div>

        {/* Grid of 8 Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesData.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-500 border border-stone-200/80 hover:border-anulok-wood/40 flex flex-col justify-between"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-anulok-espresso px-2 py-0.5 rounded-full">
                  {category.itemCount}
                </span>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-anulok-espresso group-hover:text-anulok-wood transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-anulok-wood group-hover:text-anulok-espresso transition-colors">
                  <span>Explore</span>
                  <div className="w-7 h-7 rounded-full bg-anulok-cream flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
