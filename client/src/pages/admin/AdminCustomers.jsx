import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/formatters';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await api.getAdminCustomers();
        setCustomers(res.customers || []);
      } catch (err) {
        console.error('Failed to load customers', err);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-anulok-espresso">Customer Directory</h1>
        <p className="text-xs text-stone-500 mt-1">Patron portfolio, purchasing velocity, and order totals.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or phone..."
            className="w-full pl-9 pr-4 py-2 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-anulok-linen/70 text-stone-600 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Total Spending</th>
                <th className="py-3.5 px-6">Registered On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">Loading customer records...</td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-anulok-espresso text-anulok-cream flex items-center justify-center font-bold text-xs uppercase">
                        {c.name?.slice(0, 2) || 'PT'}
                      </div>
                      <div>
                        <p className="font-bold text-anulok-espresso text-sm">{c.name}</p>
                        <p className="text-[11px] text-stone-400 font-mono">ID: {c.id}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-stone-600 space-y-0.5">
                      <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-stone-400" /> {c.email}</p>
                      {c.phone && <p className="flex items-center gap-1.5 text-[11px] text-stone-400"><Phone className="w-3 h-3" /> {c.phone}</p>}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-bold text-anulok-espresso text-sm">{c.ordersCount}</span>
                      <span className="text-stone-400 text-xs"> orders</span>
                    </td>

                    <td className="py-4 px-4 font-bold text-anulok-wood text-sm">
                      {formatPrice(c.totalSpend)}
                    </td>

                    <td className="py-4 px-6 text-stone-500">
                      {formatDate(c.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-500">No customers match your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
