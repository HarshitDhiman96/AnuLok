import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/formatters';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeFromCart, subtotal, total, deliveryCharge } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const freeDeliveryThreshold = 25000;
  const amountNeededForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleCheckout = () => {
    closeDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200 animate-slide-up">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-anulok-cream">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-anulok-wood" />
              <h2 className="font-serif text-xl font-bold tracking-tight text-anulok-espresso">Your Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-anulok-wood/10 text-anulok-wood">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeDrawer}
              className="p-2 text-stone-400 hover:text-anulok-espresso transition-colors rounded-full hover:bg-stone-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {items.length > 0 && (
            <div className="px-6 py-3 bg-anulok-linen/70 border-b border-stone-200 text-xs">
              {amountNeededForFree > 0 ? (
                <p className="text-stone-700 font-medium">
                  Add <span className="font-bold text-anulok-wood">{formatPrice(amountNeededForFree)}</span> more for <span className="font-semibold">Free White-Glove In-Home Delivery</span>
                </p>
              ) : (
                <p className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> You've unlocked Free White-Glove In-Home Delivery!
                </p>
              )}
              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-anulok-wood h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-anulok-linen flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-stone-400" />
                </div>
                <h3 className="font-serif text-lg font-bold text-anulok-espresso mb-1">Your cart is empty</h3>
                <p className="text-stone-500 text-sm max-w-xs mb-6">
                  Explore our handcrafted collection of solid wood, bouclé, and stone furniture.
                </p>
                <button
                  onClick={() => {
                    closeDrawer();
                    navigate('/shop');
                  }}
                  className="px-6 py-2.5 bg-anulok-espresso text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-anulok-wood transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.cartItemId} className="flex gap-4 pb-4 border-b border-stone-100 last:border-none">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={closeDrawer}
                        className="text-sm font-semibold text-anulok-espresso hover:text-anulok-wood transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.colorName && (
                      <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                          style={{ backgroundColor: item.colorHex || '#8C6239' }}
                        />
                        {item.colorName}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1.5 text-stone-600 hover:text-anulok-espresso hover:bg-stone-200/60 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-anulok-espresso">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1.5 text-stone-600 hover:text-anulok-espresso hover:bg-stone-200/60 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-anulok-espresso">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-anulok-cream space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-anulok-espresso">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Estimate</span>
                  <span className={deliveryCharge === 0 ? "font-semibold text-emerald-700" : "font-semibold text-stone-700"}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">Taxes & applied coupons calculated at checkout</p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/cart"
                  onClick={closeDrawer}
                  className="w-full py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-stone-600 hover:text-anulok-espresso transition-colors"
                >
                  View Full Cart & Apply Coupons
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
