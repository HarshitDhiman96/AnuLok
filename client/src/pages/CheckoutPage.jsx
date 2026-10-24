import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Lock,
  MapPin,
  LocateFixed
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { formatPrice } from '../utils/formatters';

export default function CheckoutPage() {
  const { items, subtotal, couponDiscount, deliveryCharge, tax, total, appliedCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    specialInstructions: ''
  });

  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Online Payment');
  const [onlineType, setOnlineType] = useState('upi'); // upi, card, netbanking
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="bg-anulok-cream min-h-screen py-24 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-anulok-espresso">Your Cart is Empty</h2>
        <p className="text-stone-500 text-sm mt-2 mb-6">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="px-6 py-3 bg-anulok-espresso text-white text-xs uppercase font-semibold rounded-xl">
          Browse Furniture
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'address' && value.trim()) setDeliveryLocation(null);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast('Location is not available in this browser. Please enter your address.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setDeliveryLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy
        });
        setFormData((current) => ({ ...current, address: '' }));
        setIsLocating(false);
        addToast('Delivery location added to your order.');
      },
      (error) => {
        setIsLocating(false);
        const message = error.code === error.PERMISSION_DENIED
          ? 'Location permission was denied. Enter your delivery address instead.'
          : 'Could not get your location. Please enter your delivery address.';
        addToast(message, 'error');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || (!formData.address.trim() && !deliveryLocation)) {
      addToast('Please complete your name and phone, then enter a delivery address or share your current location.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email || '',
          phone: formData.phone,
          address: formData.address.trim(),
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          ...(deliveryLocation ? { location: deliveryLocation } : {}),
          specialInstructions: formData.specialInstructions
        },
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          colorName: item.colorName
        })),
        subtotal,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code || null,
        deliveryCharge,
        tax,
        total,
        paymentMethod: paymentMethod === 'Online Payment' ? `Online Payment (${onlineType.toUpperCase()})` : 'Cash on Delivery'
      };

      const res = await api.createOrder(orderPayload);
      clearCart();
      addToast('Order placed successfully! Redirecting to confirmation...');
      navigate(`/order-confirmation/${res.order.id}`);
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-anulok-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-anulok-wood transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Cart
          </Link>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Customer & Delivery Info + Payment (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Customer Information Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-anulok-espresso text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-anulok-espresso">Shipping & Placement Details</h2>
                  <p className="text-xs text-stone-500">Where should our white-glove logistics team deliver your furniture?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="priya@example.com"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Delivery Address
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter street, building, apartment and landmark, or use your current location below"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2 text-xs outline-none focus:border-anulok-wood"
                  />
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isLocating}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-anulok-wood/30 px-4 py-2.5 text-xs font-semibold text-anulok-wood transition-colors hover:bg-anulok-linen disabled:opacity-50"
                    >
                      <LocateFixed className="h-4 w-4" />
                      {isLocating ? 'Getting location...' : 'Use my current location'}
                    </button>
                    {deliveryLocation && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-anulok-sage">
                        <MapPin className="h-4 w-4" /> Current location attached
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-stone-500">
                    Share location only if you choose. Your browser will ask for permission.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required={!deliveryLocation}
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required={!deliveryLocation}
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required={!deliveryLocation}
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="560038"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1.5">
                    Special In-Home Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    placeholder="e.g. 3rd Floor, elevator available"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-anulok-espresso text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-anulok-espresso">Payment Method</h2>
                  <p className="text-xs text-stone-500">Select how you would like to settle your order.</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Online Payment Option */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Online Payment'
                      ? 'border-anulok-wood bg-anulok-cream ring-2 ring-anulok-wood/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online Payment"
                        checked={paymentMethod === 'Online Payment'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-anulok-wood focus:ring-anulok-wood"
                      />
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-anulok-wood" />
                        <span className="font-bold text-sm text-anulok-espresso">Online Payment (UPI, Credit/Debit Card, NetBanking)</span>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  </div>

                  {paymentMethod === 'Online Payment' && (
                    <div className="mt-4 pt-3 border-t border-stone-200/60 pl-7 space-y-3">
                      <div className="flex gap-2">
                        {['upi', 'card', 'netbanking'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setOnlineType(type)}
                            className={`px-3 py-1.5 text-xs rounded-lg uppercase tracking-wider font-semibold transition-colors ${
                              onlineType === type
                                ? 'bg-anulok-espresso text-white'
                                : 'bg-white border border-stone-300 text-stone-600'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      {onlineType === 'upi' && (
                        <div className="text-xs text-stone-500">
                          Supports GPay, PhonePe, Paytm, and BHIM UPI with instant confirmation.
                        </div>
                      )}
                      {onlineType === 'card' && (
                        <div className="text-xs text-stone-500">
                          Supports Visa, Mastercard, RuPay & American Express with 3D Secure OTP.
                        </div>
                      )}
                      {onlineType === 'netbanking' && (
                        <div className="text-xs text-stone-500">
                          Supports HDFC, ICICI, SBI, Axis, Kotak and 40+ major Indian banks.
                        </div>
                      )}
                    </div>
                  )}
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-anulok-wood bg-anulok-cream ring-2 ring-anulok-wood/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-anulok-wood focus:ring-anulok-wood"
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-stone-600" />
                      <div>
                        <span className="font-bold text-sm text-anulok-espresso">Cash on Delivery (COD)</span>
                        <p className="text-xs text-stone-500">Pay when furniture is delivered and assembled in your home.</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary: Items & Totals (4 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6 sticky top-28">
              <h3 className="font-serif text-xl font-bold text-anulok-espresso">Order Summary ({items.length})</h3>

              {/* Items List Snapshot */}
              <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.cartItemId} className="py-3 flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-anulok-espresso truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-500">Qty: {item.quantity} {item.colorName ? `• ${item.colorName}` : ''}</p>
                    </div>
                    <span className="text-xs font-bold text-anulok-espresso">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="pt-4 border-t border-stone-200 space-y-2.5 text-xs text-stone-600">
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

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className={deliveryCharge === 0 ? "text-emerald-700 font-semibold" : "font-semibold text-anulok-espresso"}>
                    {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-anulok-espresso">{formatPrice(tax)}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-sm font-bold text-anulok-espresso">
                  <span className="uppercase tracking-wider">Total</span>
                  <span className="text-xl font-serif text-anulok-espresso">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? (
                  'Confirming Order...'
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-anulok-amber" /> Place Order ({formatPrice(total)})
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>30-Day Money-Back In-Home Guarantee</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
