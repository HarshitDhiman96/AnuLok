import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate, getStatusColor } from '../utils/formatters';

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.getMyOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-anulok-cream min-h-screen py-24 text-center px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-stone-200">
          <AlertCircle className="w-10 h-10 text-anulok-wood mx-auto mb-3" />
          <h2 className="font-serif text-2xl font-bold text-anulok-espresso">Sign In Required</h2>
          <p className="text-xs text-stone-500 mt-2 mb-6">Please log in to view your order history and tracking statuses.</p>
          <Link to="/login" className="px-6 py-3 bg-anulok-espresso text-white text-xs uppercase font-semibold rounded-xl">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-anulok-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-stone-200 pb-6 mb-8">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-anulok-wood">
            Patron Account
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-anulok-espresso mt-1">
            My Furniture Orders
          </h1>
          <p className="text-xs text-stone-500 mt-1">Track white-glove delivery, assembly status, and download tax invoices.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-white rounded-2xl border border-stone-200 animate-pulse" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-6 bg-anulok-linen/40 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-stone-400 block font-medium">Order Reference</span>
                      <span className="font-mono font-bold text-anulok-espresso text-sm">#{order.id}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Date Placed</span>
                      <span className="font-semibold text-anulok-espresso">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-stone-400 block font-medium">Order Total</span>
                      <span className="font-bold text-anulok-espresso text-sm">{formatPrice(order.total)}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 divide-y divide-stone-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="text-sm font-bold text-anulok-espresso">{item.name}</p>
                          <p className="text-xs text-stone-500">
                            Qty: {item.quantity} {item.colorName ? `• ${item.colorName}` : ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-anulok-espresso">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom link to confirmation */}
                <div className="p-4 bg-anulok-cream border-t border-stone-100 flex justify-end">
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-anulok-wood hover:text-anulok-espresso transition-colors uppercase tracking-wider"
                  >
                    View Tracking & Invoice <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-bold text-anulok-espresso">No Orders Yet</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1 mb-6">
              When you purchase an Anulok creation, its progress will appear here.
            </p>
            <Link
              to="/shop"
              className="px-6 py-2.5 bg-anulok-espresso text-white text-xs uppercase font-semibold rounded-xl hover:bg-anulok-wood transition-colors"
            >
              Start Exploring
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
