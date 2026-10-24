import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Star, ShoppingBag, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/formatters';

export default function QuickViewModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-anulok-espresso shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Images */}
          <div className="bg-anulok-linen p-6 flex flex-col justify-between">
            <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-inner">
              <img
                src={product.images?.[selectedImg] || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImg === idx ? 'border-anulok-wood ring-2 ring-anulok-wood/20' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-anulok-wood font-semibold">
                  {product.categoryName || product.category}
                </span>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-1.5 rounded-full transition-colors ${
                    wishlisted ? 'text-rose-600 bg-rose-50' : 'text-stone-400 hover:text-rose-600 hover:bg-stone-50'
                  }`}
                  title={wishlisted ? "In Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h3 className="font-serif text-2xl font-bold text-anulok-espresso mt-1 leading-snug">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? 'fill-current' : 'opacity-30'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-700">{product.rating || 4.9}</span>
                <span className="text-xs text-stone-400">({product.reviewCount || 24} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-bold text-anulok-espresso">
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-sm line-through text-stone-400">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs font-bold text-anulok-amber bg-amber-50 px-2 py-0.5 rounded">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-stone-600 mt-3 line-clamp-3 leading-relaxed">
                {product.description}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-1.5">
                    Finish / Fabric: <span className="text-anulok-espresso font-bold">{selectedColor?.name}</span>
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${
                          selectedColor?.name === c.name ? 'border-anulok-wood ring-2 ring-anulok-wood/20 scale-110' : 'border-stone-300'
                        }`}
                        title={c.name}
                      >
                        <span className="block w-full h-full rounded-full" style={{ backgroundColor: c.hex }} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dimensions */}
              <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-1">
                <p><strong className="text-stone-800">Dimensions:</strong> {product.dimensions}</p>
                <p><strong className="text-stone-800">Material:</strong> {product.material}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-stone-200 space-y-3">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-stone-500 hover:text-anulok-espresso font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-stone-500 hover:text-anulok-espresso font-bold text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="w-full py-2 text-center text-xs font-semibold uppercase tracking-wider text-anulok-wood hover:text-anulok-espresso flex items-center justify-center gap-1.5 transition-colors"
              >
                View Full Product Specs & Reviews <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
