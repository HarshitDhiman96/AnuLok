import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import { api } from '../../services/api';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.getProducts({ featured: true });
        setProducts(res.products || []);
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const filterTabs = [
    { label: 'All Featured', value: 'all' },
    { label: 'Living Room', value: 'sofas' },
    { label: 'Dining', value: 'dining' },
    { label: 'Bedroom', value: 'beds' },
    { label: 'Lounge Chairs', value: 'chairs' }
  ];

  const displayedProducts = activeTab === 'all'
    ? products
    : products.filter(p => p.category === activeTab);

  return (
    <section id="categories" className="scroll-mt-8 bg-anulok-cream py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood mb-2">
            <Sparkles className="w-3.5 h-3.5 text-anulok-amber" />
            Signature Masterpieces
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-anulok-espresso">
            Featured Creations
          </h2>
          <p className="text-sm text-stone-500 mt-3 leading-relaxed">
            Sculpted with organic geometry and architectural clarity. Each piece is individually numbered and finished by hand.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {filterTabs.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab.value
                    ? 'bg-anulok-espresso text-white shadow-md'
                    : 'bg-white text-stone-600 hover:bg-stone-200/60 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 rounded-2xl bg-stone-200/60 animate-pulse" />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-stone-500 text-sm">No products found in this category.</p>
          </div>
        )}

        {/* View All Products CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View All Products <ArrowRight className="w-4 h-4 text-anulok-amber" />
          </Link>
        </div>
      </div>
    </section>
  );
}
