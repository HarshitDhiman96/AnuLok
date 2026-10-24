import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Search, RotateCcw, ChevronDown, Check } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { api } from '../services/api';
import { formatPrice } from '../utils/formatters';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState(150000);
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Sync state if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategoryFilter(cat);
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Load Categories & Products from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts()
        ]);
        setCategories(catRes.categories || []);
        setProducts(prodRes.products || []);
      } catch (err) {
        console.error('Failed to load shop data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter(p => p.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q)) ||
        (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Price
    result = result.filter(p => (p.discountPrice || p.price) <= priceRange);

    // Material
    if (selectedMaterial !== 'all') {
      result = result.filter(p => p.material?.toLowerCase().includes(selectedMaterial.toLowerCase()));
    }

    // Color
    if (selectedColor !== 'all') {
      result = result.filter(p => p.colors && p.colors.some(c => c.name.toLowerCase().includes(selectedColor.toLowerCase())));
    }

    // Rating
    if (minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= minRating);
    }

    // In Stock Only
    if (inStockOnly) {
      result = result.filter(p => (p.stock || 0) > 0);
    }

    // Discount Only
    if (discountOnly) {
      result = result.filter(p => (p.discountPercentage || 0) > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating_desc':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount_desc':
        result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [
    products, categoryFilter, searchQuery, priceRange, selectedMaterial,
    selectedColor, minRating, inStockOnly, discountOnly, sortBy
  ]);

  const handleResetFilters = () => {
    setCategoryFilter('all');
    setSearchQuery('');
    setPriceRange(150000);
    setSelectedMaterial('all');
    setSelectedColor('all');
    setMinRating(0);
    setInStockOnly(false);
    setDiscountOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const materials = ['all', 'Teak', 'Walnut', 'Oak', 'Sheesham', 'Bouclé', 'Leather', 'Marble', 'Travertine'];
  const colors = [
    { label: 'All Colors', value: 'all' },
    { label: 'Cream / Oat', value: 'cream', hex: '#F5F3EF' },
    { label: 'Teak / Oak', value: 'teak', hex: '#8C6239' },
    { label: 'Walnut / Dark', value: 'walnut', hex: '#4A3324' },
    { label: 'Amber / Cognac', value: 'amber', hex: '#B86B35' },
    { label: 'Black / Charcoal', value: 'black', hex: '#242322' }
  ];

  return (
    <div className="bg-anulok-cream min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Shop Page Banner */}
        <div className="mb-10 text-center sm:text-left border-b border-stone-200/80 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
              The Complete Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-anulok-espresso mt-2">
              Architectural Living
            </h1>
            <p className="text-sm text-stone-500 mt-2 max-w-xl">
              Filter through our catalog of sustainable solid hardwoods, organic bouclés, and hand-cut natural stones.
            </p>
          </div>

          <div className="flex items-center gap-3 self-center sm:self-auto">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-anulok-espresso shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-anulok-wood" /> Filters
            </button>

            {/* Sorting Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-stone-300 text-anulok-espresso text-xs font-semibold py-2.5 pl-4 pr-10 rounded-xl cursor-pointer shadow-xs focus:outline-none focus:border-anulok-wood"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
                <option value="discount_desc">Biggest Discount</option>
                <option value="newest">Newest Arrivals</option>
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-8 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs h-fit sticky top-28">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2 font-serif text-lg font-bold text-anulok-espresso">
                <SlidersHorizontal className="w-4 h-4 text-anulok-wood" /> Filter Collection
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] uppercase tracking-wider text-stone-400 hover:text-anulok-wood font-semibold flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Search within shop */}
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. sofa, bed, marble..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-anulok-cream border border-stone-300 rounded-lg outline-none focus:border-anulok-wood"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">Category</label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    categoryFilter === 'all'
                      ? 'bg-anulok-espresso text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      categoryFilter === cat.slug
                        ? 'bg-anulok-espresso text-white font-semibold'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase font-bold tracking-wider text-stone-600">Max Price</label>
                <span className="text-xs font-bold text-anulok-espresso">{formatPrice(priceRange)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-anulok-wood cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>₹10,000</span>
                <span>₹1,50,000+</span>
              </div>
            </div>

            {/* Material */}
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">Material</label>
              <div className="flex flex-wrap gap-1.5">
                {materials.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`px-3 py-1 text-xs rounded-lg border transition-colors ${
                      selectedMaterial === mat
                        ? 'bg-anulok-wood text-white border-anulok-wood font-medium'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {mat === 'all' ? 'All Materials' : mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">Color Palette</label>
              <div className="space-y-1.5">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      selectedColor === c.value ? 'bg-anulok-cream font-bold text-anulok-espresso' : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {c.hex && (
                        <span className="w-3.5 h-3.5 rounded-full border border-stone-300" style={{ backgroundColor: c.hex }} />
                      )}
                      <span>{c.label}</span>
                    </div>
                    {selectedColor === c.value && <Check className="w-3.5 h-3.5 text-anulok-wood" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="text-xs uppercase font-bold tracking-wider text-stone-600 block mb-2">Minimum Rating</label>
              <div className="flex gap-2">
                {[4, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    onClick={() => setMinRating(minRating === r ? 0 : r)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border text-center transition-colors font-medium ${
                      minRating === r
                        ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    ★ {r}+
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes: In Stock & On Sale */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-anulok-wood focus:ring-anulok-wood"
                />
                <span>In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={discountOnly}
                  onChange={(e) => setDiscountOnly(e.target.checked)}
                  className="rounded text-anulok-wood focus:ring-anulok-wood"
                />
                <span>Discounts & Sales Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {/* Active Filters Summary Bar */}
            <div className="flex items-center justify-between mb-6 bg-white px-4 py-3 rounded-xl border border-stone-200/80">
              <p className="text-xs text-stone-500">
                Showing <strong className="text-anulok-espresso">{filteredProducts.length}</strong> of {products.length} pieces
              </p>
              {(categoryFilter !== 'all' || searchQuery || selectedMaterial !== 'all' || selectedColor !== 'all' || minRating > 0 || inStockOnly || discountOnly) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-anulok-wood hover:underline font-semibold"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 rounded-2xl bg-stone-200/60 animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                <h3 className="font-serif text-xl font-bold text-anulok-espresso mb-2">No matching furniture found</h3>
                <p className="text-sm text-stone-500 max-w-sm mx-auto mb-6">
                  We couldn't find any items matching your selected criteria. Try resetting your filters or adjusting your search term.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-anulok-espresso text-white text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-anulok-wood transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-fade-in">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                  <h3 className="font-serif text-xl font-bold text-anulok-espresso">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-stone-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile categories */}
                <div className="mb-6">
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`p-2 text-xs rounded-lg border text-center ${
                        categoryFilter === 'all' ? 'bg-anulok-espresso text-white font-bold' : 'border-stone-200'
                      }`}
                    >
                      All
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setCategoryFilter(c.slug)}
                        className={`p-2 text-xs rounded-lg border text-center truncate ${
                          categoryFilter === c.slug ? 'bg-anulok-espresso text-white font-bold' : 'border-stone-200'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile price */}
                <div className="mb-6">
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-2">
                    Max Price: {formatPrice(priceRange)}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="150000"
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-anulok-wood"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-stone-200 space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-anulok-espresso text-white font-semibold text-xs uppercase tracking-wider rounded-xl"
                >
                  Show {filteredProducts.length} Results
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="w-full py-2 text-center text-xs text-stone-500 font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
