import React, { useState, useEffect } from 'react';
import { Search, Eye, MapPin, CheckCircle2, ChevronDown, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatPrice, formatDate, getStatusColor } from '../../utils/formatters';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { addToast } = useToast();

  const statuses = [
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAllOrders();
      setOrders(res.orders || []);
    } catch {
      addToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast(`Order #${orderId} status changed to ${newStatus}.`);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filtered = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.orderStatus?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-anulok-espresso">Order Management</h1>
        <p className="text-xs text-stone-500 mt-1">Monitor white-glove fulfillment, adjust customer delivery states, and verify payment settlements.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, email..."
            className="w-full pl-9 pr-4 py-2 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 bg-anulok-cream border border-stone-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-anulok-wood"
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-anulok-linen/70 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status & Action</th>
                <th className="py-3.5 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">Loading orders...</td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-anulok-espresso text-sm">
                      #{order.id}
                    </td>

                    <td className="py-4 px-4">
                      <p className="font-bold text-anulok-espresso">{order.customer?.name}</p>
                      <p className="text-[11px] text-stone-400">{order.customer?.phone}</p>
                    </td>

                    <td className="py-4 px-4 text-stone-500">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="py-4 px-4 font-bold text-anulok-espresso">
                      {formatPrice(order.total)}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-medium text-stone-700 block">{order.paymentMethod}</span>
                      <span className={`text-[10px] font-bold ${order.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-800'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="relative inline-block">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`appearance-none text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg border cursor-pointer ${getStatusColor(order.orderStatus)}`}
                        >
                          {statuses.map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none opacity-60" />
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-anulok-wood hover:bg-stone-100 transition-colors"
                        title="View order details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up">
            <div className="p-6 bg-anulok-linen/60 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-anulok-espresso">
                  Order #{selectedOrder.id}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">Placed on {formatDate(selectedOrder.createdAt)}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Customer Details */}
              <div className="p-4 bg-anulok-cream rounded-2xl border border-stone-200 text-xs">
                <h4 className="font-serif font-bold text-sm text-anulok-espresso mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-anulok-wood" /> Delivery Address
                </h4>
                <p className="font-bold text-anulok-espresso">{selectedOrder.customer?.name}</p>
                <p className="text-stone-600 mt-0.5">{selectedOrder.customer?.address}</p>
                <p className="text-stone-600">{selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}</p>
                <p className="text-stone-600 mt-1">Phone: {selectedOrder.customer?.phone} | Email: {selectedOrder.customer?.email}</p>
                {selectedOrder.customer?.specialInstructions && (
                  <p className="text-amber-800 bg-amber-50 p-2 rounded-lg mt-2 font-medium">
                    Note: {selectedOrder.customer.specialInstructions}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="divide-y divide-stone-100">
                <h4 className="text-xs uppercase font-bold text-stone-500 mb-3">Order Items ({selectedOrder.items?.length})</h4>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-stone-200" />
                      <div>
                        <p className="text-xs font-bold text-anulok-espresso">{item.name}</p>
                        <p className="text-[11px] text-stone-500">Qty: {item.quantity} {item.colorName ? `• ${item.colorName}` : ''}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-anulok-espresso">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({selectedOrder.couponCode})</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : formatPrice(selectedOrder.deliveryCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span>{formatPrice(selectedOrder.tax)}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-anulok-espresso">
                  <span>Total Amount</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Status Update Quick Bar */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-stone-700 block">Update Order Status:</span>
                  <span className="text-[11px] text-stone-400">Current: {selectedOrder.orderStatus}</span>
                </div>
                <div className="flex gap-2">
                  {statuses.map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`px-2.5 py-1 text-[11px] rounded-lg font-semibold transition-colors ${
                        selectedOrder.orderStatus === st
                          ? 'bg-anulok-wood text-white'
                          : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
