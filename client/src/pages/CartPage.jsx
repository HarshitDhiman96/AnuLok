import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  CheckCircle2,
  X,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    couponDiscount,
    deliveryCharge,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput.trim());
    setIsApplying(false);
    setCouponInput('');
  };

  if (items.length === 0) {
    return (
      <div className="bg-anulok-cream min-h-screen py-24 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-anulok-linen rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-stone-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-anulok-espresso">Your Cart is Empty</h1>
          <p className="text-stone-500 text-sm mt-3 mb-8 leading-relaxed">
            Your sanctuary is waiting. Explore our collection of handcrafted solid wood, bouclé, and stone pieces.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
          >
            Explore Furniture Collection <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-anulok-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-stone-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
              Shopping Sanctuary
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-anulok-espresso mt-1">
              Your Shopping Cart ({items.length})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-stone-400 hover:text-rose-600 transition-colors font-medium self-start sm:self-auto"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items Table / List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="divide-y divide-stone-100">
                {items.map((item) => (
                  <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    {/* Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.id}`}
                        className="font-serif text-lg font-bold text-anulok-espresso hover:text-anulok-wood transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-stone-500 mt-1 capitalize">
                        {item.categoryName || item.category} • {item.material}
                      </p>

                      {item.colorName && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-stone-600">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                            style={{ backgroundColor: item.colorHex || '#8C6239' }}
                          />
                          <span>Finish: {item.colorName}</span>
                        </div>
                      )}

                      <div className="mt-2 text-xs font-semibold text-stone-700">
                        Unit Price: {formatPrice(item.price)}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center border border-stone-300 rounded-xl bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-2 text-stone-500 hover:text-anulok-espresso transition-colors rounded-l-xl"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-anulok-espresso">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-2 text-stone-500 hover:text-anulok-espresso transition-colors rounded-r-xl"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="text-right sm:min-w-[120px] flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                      <p className="text-base font-bold text-anulok-espresso">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1.5 text-xs flex items-center gap-1 mt-1"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="sm:hidden">Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Shopping */}
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-anulok-wood hover:text-anulok-espresso transition-colors"
              >
                ← Continue Browsing Collections
              </Link>
            </div>
          </div>

          {/* Cart Summary & Coupon Sidebar */}
          <div className="space-y-6">
            {/* Coupon Box */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-bold text-anulok-espresso flex items-center gap-2">
                <Tag className="w-4 h-4 text-anulok-wood" /> Apply Promo / Coupon Code
              </h3>

              {appliedCoupon ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-800">{appliedCoupon.code}</span>
                      <p className="text-[11px] text-emerald-700">
                        {appliedCoupon.discountType === 'percentage'
                          ? `${appliedCoupon.discountValue}% OFF (Saving ${formatPrice(couponDiscount)})`
                          : `Flat ${formatPrice(appliedCoupon.discountValue)} OFF`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-emerald-600 hover:text-emerald-800"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. WOOD10)"
                    className="flex-1 uppercase font-mono bg-anulok-cream border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-5 py-2.5 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}

              {/* Sample Coupons Suggestion */}
              {!appliedCoupon && (
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">Available Coupons:</p>
                  <div className="space-y-1.5 text-xs">
                    <div
                      onClick={() => setCouponInput('WOOD10')}
                      className="cursor-pointer p-2 rounded-lg bg-anulok-linen/70 hover:bg-anulok-linen flex items-center justify-between transition-colors"
                    >
                      <span className="font-mono font-bold text-anulok-wood">WOOD10</span>
                      <span className="text-stone-600">10% OFF (Min ₹10,000)</span>
                    </div>
                    <div
                      onClick={() => setCouponInput('ANULOK20')}
                      className="cursor-pointer p-2 rounded-lg bg-anulok-linen/70 hover:bg-anulok-linen flex items-center justify-between transition-colors"
                    >
                      <span className="font-mono font-bold text-anulok-wood">ANULOK20</span>
                      <span className="text-stone-600">20% OFF (Min ₹25,000)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Calculation */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-5">
              <h3 className="font-serif text-xl font-bold text-anulok-espresso">Order Summary</h3>

              <div className="space-y-3 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-anulok-espresso">{formatPrice(subtotal)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(couponDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    Delivery Charges
                    {deliveryCharge === 0 && (
                      <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-anulok-espresso">
                    {deliveryCharge === 0 ? '₹0' : formatPrice(deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated GST (18%)</span>
                  <span className="font-semibold text-anulok-espresso">{formatPrice(tax)}</span>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-between items-baseline text-base sm:text-lg font-bold text-anulok-espresso">
                  <span>Total Amount</span>
                  <span className="text-2xl text-anulok-espresso font-serif">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl mt-4"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4 text-anulok-amber" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-stone-400 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SSL Encrypted & Safe Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
