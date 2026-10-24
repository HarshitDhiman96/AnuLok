import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products?.slice(0, 5) || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Search Header */}
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-stone-200 px-6 py-4">
          <Search className="w-5 h-5 text-anulok-wood shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sofas, beds, marble tables, walnut desks..."
            className="w-full text-base sm:text-lg bg-transparent border-none outline-none text-anulok-espresso placeholder:text-stone-400 font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-anulok-espresso px-2 py-1 rounded-md"
          >
            Esc
          </button>
        </form>

        {/* Popular Tags when query is empty */}
        {!query && (
          <div className="p-6">
            <p className="text-xs uppercase font-semibold tracking-wider text-stone-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-anulok-amber" /> Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Sectional Sofa', 'Bouclé Lounge', 'Teak Bed', 'Carrara Dining', 'Travertine Table', 'Walnut Desk'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onClose();
                    navigate(`/shop?search=${encodeURIComponent(tag)}`);
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium bg-anulok-linen text-stone-700 hover:bg-anulok-wood hover:text-white rounded-full transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {query && (
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-sm text-stone-400">Searching inventory...</div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs uppercase font-semibold tracking-wider text-stone-400 px-3 py-1">
                  Products ({results.length})
                </p>
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleSelectProduct(product.id)}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-anulok-cream cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=150&q=80'}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-anulok-espresso group-hover:text-anulok-wood transition-colors truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-stone-500 capitalize">{product.categoryName || product.category} • {product.material}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-anulok-espresso">
                        {formatPrice(product.discountPrice || product.price)}
                      </p>
                      {product.discountPrice && (
                        <p className="text-xs line-through text-stone-400">
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  onClick={handleSubmit}
                  className="w-full mt-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-anulok-wood hover:text-anulok-espresso flex items-center justify-center gap-1.5 transition-colors"
                >
                  View all results for "{query}" <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-stone-500 text-sm">No furniture found matching "{query}"</p>
                <p className="text-stone-400 text-xs mt-1">Try searching for generic terms like "sofa", "bed", or "table".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
