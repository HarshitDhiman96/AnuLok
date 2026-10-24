import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatters';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const [form, setForm] = useState({
    code: '',
    name: '',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrder: 10000,
    maximumDiscount: 5000,
    expiryDate: '2028-12-31',
    usageLimit: 500,
    isActive: true
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.getCoupons();
      setCoupons(res.coupons || []);
    } catch {
      addToast('Failed to load coupons', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleOpenAdd = () => {
    setForm({
      code: '',
      name: '',
      discountType: 'percentage',
      discountValue: 10,
      minimumOrder: 10000,
      maximumDiscount: 5000,
      expiryDate: '2028-12-31',
      usageLimit: 500,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (coupon) => {
    try {
      await api.updateCoupon(coupon.id, { isActive: !coupon.isActive });
      addToast(`Coupon "${coupon.code}" is now ${!coupon.isActive ? 'Active' : 'Disabled'}.`);
      loadCoupons();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.deleteCoupon(id);
      addToast(`Coupon "${code}" deleted.`);
      loadCoupons();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) return;
    setSaving(true);
    try {
      await api.createCoupon({
        ...form,
        discountValue: Number(form.discountValue),
        minimumOrder: Number(form.minimumOrder) || 0,
        maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : null,
        usageLimit: Number(form.usageLimit) || 1000
      });
      addToast(`Coupon "${form.code.toUpperCase()}" created.`);
      setIsModalOpen(false);
      loadCoupons();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-anulok-espresso">Discounts & Coupons</h1>
          <p className="text-xs text-stone-500 mt-1">Configure promotional incentives, caps, and minimum purchase thresholds.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-anulok-espresso hover:bg-anulok-wood text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4 text-anulok-amber" /> Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-anulok-linen/70 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Code & Campaign</th>
                <th className="py-3.5 px-4">Discount</th>
                <th className="py-3.5 px-4">Thresholds</th>
                <th className="py-3.5 px-4">Redemptions</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">Loading coupons...</td>
                </tr>
              ) : coupons.map((c) => (
                <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-sm text-anulok-espresso bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                      {c.code}
                    </span>
                    <p className="text-stone-500 text-[11px] mt-1">{c.name}</p>
                  </td>

                  <td className="py-4 px-4 font-semibold text-anulok-wood">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Flat ${formatPrice(c.discountValue)} OFF`}
                  </td>

                  <td className="py-4 px-4 text-stone-600 space-y-0.5">
                    <p>Min Order: {formatPrice(c.minimumOrder)}</p>
                    {c.maximumDiscount && <p className="text-stone-400 text-[10px]">Max Cap: {formatPrice(c.maximumDiscount)}</p>}
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-mono text-stone-700">{c.usageCount || 0}</span>
                    <span className="text-stone-400"> / {c.usageLimit}</span>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        c.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {c.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{c.isActive ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up">
            <div className="p-6 bg-anulok-linen/60 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-anulok-espresso">Create New Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. LUXURY15"
                    className="w-full font-mono uppercase bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Campaign Title</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Spring Architectural Sale"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-anulok-wood"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    placeholder="10"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={form.minimumOrder}
                    onChange={(e) => setForm({ ...form, minimumOrder: e.target.value })}
                    placeholder="10000"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={form.maximumDiscount}
                    onChange={(e) => setForm({ ...form, maximumDiscount: e.target.value })}
                    placeholder="5000"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                    placeholder="500"
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2.5 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase font-bold text-stone-600 block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="w-full bg-anulok-cream border border-stone-300 rounded-xl px-4 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-anulok-espresso hover:bg-anulok-wood text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
