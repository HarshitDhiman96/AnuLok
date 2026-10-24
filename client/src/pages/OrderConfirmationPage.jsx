import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, CreditCard, Printer, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';
import BrandLogo from '../components/common/BrandLogo';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.getOrder(orderId);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-anulok-cream min-h-screen py-24 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-stone-200 rounded-full mx-auto mb-4" />
          <div className="h-6 w-48 bg-stone-200 rounded mx-auto mb-2" />
          <div className="h-4 w-32 bg-stone-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-anulok-cream min-h-screen py-24 text-center px-4">
        <h2 className="font-serif text-2xl font-bold text-anulok-espresso">Order Not Found</h2>
        <p className="text-stone-500 text-sm mt-2 mb-6">We could not locate this order reference.</p>
        <Link to="/" className="px-6 py-2.5 bg-anulok-espresso text-white text-xs uppercase font-semibold rounded-xl">
          Return to Home
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Confirmed', desc: 'Order received & verified' },
    { label: 'Processing', desc: 'Handcrafted in atelier' },
    { label: 'Shipped', desc: 'In transit with white-glove team' },
    { label: 'Delivered', desc: 'Assembled in your room' }
  ];

  const currentStepIndex = steps.findIndex(s => s.label.toLowerCase() === (order.orderStatus || 'confirmed').toLowerCase());
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="bg-anulok-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Celebration Header */}
        <div className="text-center mb-10 flex flex-col items-center">
          <BrandLogo className="mb-6" />
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-anulok-espresso mt-1">
            Thank You, {order.customer?.name}
          </h1>
          <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">
            Your furniture order <strong className="text-anulok-espresso font-mono">#{order.id}</strong> has been logged in our master register.
          </p>
        </div>

        {/* Order Status Stepper */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs mb-8">
          <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500 mb-6">
            Fulfillment Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex flex-col items-center text-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                    idx <= activeIndex
                      ? 'bg-anulok-wood text-white shadow-sm ring-4 ring-anulok-wood/20'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {idx + 1}
                </div>
                <p className="text-xs font-bold text-anulok-espresso">{step.label}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden mb-8">
          {/* Card Top Info */}
          <div className="p-6 sm:p-8 bg-anulok-linen/50 border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block font-medium">Order Reference</span>
              <span className="font-mono font-bold text-anulok-espresso text-sm">#{order.id}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Date Placed</span>
              <span className="font-semibold text-anulok-espresso">{formatDate(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Payment Status</span>
              <span className="font-semibold text-emerald-700">{order.paymentStatus}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Current Status</span>
              <span className={`inline-block font-semibold px-2 py-0.5 rounded border text-[11px] ${getStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 sm:p-8 divide-y divide-stone-100">
            <h4 className="text-xs uppercase tracking-widest font-bold text-stone-500 mb-4">
              Ordered Creations ({order.items?.length})
            </h4>
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-xl bg-stone-100 border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-anulok-espresso truncate">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    Quantity: {item.quantity} {item.colorName ? `• ${item.colorName}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-anulok-espresso">{formatPrice(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Payment Information */}
          <div className="p-6 sm:p-8 bg-anulok-cream border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            <div>
              <h5 className="font-serif text-sm font-bold text-anulok-espresso mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-anulok-wood" /> Delivery Address
              </h5>
              <p className="text-stone-700 font-semibold">{order.customer?.name}</p>
              <p className="text-stone-600 mt-0.5">{order.customer?.address}</p>
              <p className="text-stone-600">{order.customer?.city}, {order.customer?.state} - {order.customer?.pincode}</p>
              <p className="text-stone-600 mt-1">Phone: {order.customer?.phone}</p>
            </div>

            <div>
              <h5 className="font-serif text-sm font-bold text-anulok-espresso mb-2 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-anulok-wood" /> Financial Receipt
              </h5>
              <div className="space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({order.couponCode || 'Promo'})</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>White-Glove Delivery</span>
                  <span>{order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-anulok-espresso text-sm">
                  <span>Total Amount Paid</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-stone-300 hover:border-stone-400 text-stone-700 font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-stone-500" /> Print Order Invoice
          </button>

          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-anulok-espresso hover:bg-anulok-wood text-white font-semibold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
          >
            Continue Exploring <ArrowRight className="w-4 h-4 text-anulok-amber" />
          </Link>
        </div>
      </div>
    </div>
  );
}
