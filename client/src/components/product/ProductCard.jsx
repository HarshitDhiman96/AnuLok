import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatters';
import QuickViewModal from '../common/QuickViewModal';

export default function ProductCard({ product }) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const wishlisted = isInWishlist(product.id);
  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
  const secondaryImage = product.images?.[1] || primaryImage;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1800);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-anulok-wood/40 transition-all duration-300 hover:shadow-luxury flex flex-col justify-between">
        {/* Product Image Area */}
        <div className="relative aspect-[4/3] sm:aspect-square bg-anulok-linen overflow-hidden">
          <Link to={`/product/${product.id}`} className="block w-full h-full">
            {/* Primary & Hover Image */}
            <img
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {product.images?.length > 1 && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternate`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </Link>

          {/* Discount Badge */}
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 left-3 bg-anulok-amber text-white text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              {product.discountPercentage}% OFF
            </div>
          )}

          {/* Top Right Floating Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs ${
                wishlisted
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/90 text-stone-600 hover:text-rose-600 hover:bg-white'
              }`}
              title={wishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              aria-label="Wishlist button"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleQuickView}
              className="w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-anulok-wood flex items-center justify-center backdrop-blur-md transition-all shadow-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              title="Quick View"
              aria-label="Quick View button"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details Area */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
              <span className="uppercase tracking-wider font-medium text-anulok-wood">
                {product.categoryName || product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating || 4.9}</span>
              </div>
            </div>

            {/* Title */}
            <Link
              to={`/product/${product.id}`}
              className="block font-serif text-lg font-bold text-anulok-espresso hover:text-anulok-wood transition-colors line-clamp-1 leading-snug mb-1"
            >
              {product.name}
            </Link>

            {/* Short Description */}
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-3">
              {product.description}
            </p>
          </div>

          <div>
            {/* Pricing Section */}
            <div className="flex items-baseline gap-2 pt-2 border-t border-stone-100 mb-4">
              <span className="text-lg font-bold text-anulok-espresso">
                {formatPrice(product.discountPrice || product.price)}
              </span>
              {product.discountPrice && (
                <span className="text-xs line-through text-stone-400">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                product.stock === 0
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : isAddedRecently
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-anulok-espresso hover:bg-anulok-wood text-white shadow-sm hover:shadow-md'
              }`}
            >
              {isAddedRecently ? (
                <>
                  <Check className="w-4 h-4" /> Added to Cart
                </>
              ) : product.stock === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
