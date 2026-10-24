import React, { useState, useEffect } from 'react';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Tag,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { formatPrice } from '../../utils/formatters';

export default function AdminDashboard({ onNavigateTab }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-stone-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-stone-200" />
          ))}
        </div>
      </div>
    );
  }

  const { summary, lowStockProducts, categoryDistribution, trend, bestSellers } = stats || {};

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatPrice(summary?.totalRevenue || 0),
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Lifetime gross receipts'
    },
    {
      label: 'Total Orders',
      value: summary?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      desc: 'Processed customer orders'
    },
    {
      label: 'Total Products',
      value: summary?.totalProducts || 0,
      icon: Package,
      color: 'bg-stone-50 text-stone-700 border-stone-200',
      desc: 'Active catalog pieces'
    },
    {
      label: 'Registered Customers',
      value: summary?.totalCustomers || 0,
      icon: Users,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      desc: 'Verified customer accounts'
    },
    {
      label: 'Low Stock Alert',
      value: summary?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
      desc: 'Pieces with ≤ 5 units remaining'
    },
    {
      label: 'Active Discounts',
      value: summary?.activeDiscountsCount || 0,
      icon: Tag,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      desc: 'Live promotional coupons'
    },
  ];

  // Max revenue for trend chart scaling
  const maxTrendRevenue = Math.max(...(trend?.map(t => t.revenue) || [10000]), 10000);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-anulok-espresso">Store Overview</h1>
        <p className="text-xs text-stone-500 mt-1">Real-time performance, inventory alerts, and commercial velocity.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">{kpi.label}</p>
                <h3 className="font-serif text-3xl font-bold text-anulok-espresso mt-1">{kpi.value}</h3>
                <p className="text-[11px] text-stone-400 mt-1">{kpi.desc}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue & Orders Trend (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-anulok-espresso flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-anulok-wood" /> Revenue & Order Trend
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">Past 7 days performance</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-anulok-cream text-anulok-wood rounded-lg border border-stone-200">
              Live Feed
            </span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="pt-4">
            <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 border-b border-stone-200 pb-3">
              {trend?.map((item) => {
                const heightPercent = Math.max(12, Math.round((item.revenue / maxTrendRevenue) * 100));
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-anulok-espresso text-white px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap mb-1">
                      {formatPrice(item.revenue)} ({item.orders} orders)
                    </div>
                    {/* Bar */}
                    <div
                      className="w-full bg-stone-200 group-hover:bg-anulok-wood rounded-t-xl transition-all duration-300 relative"
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute top-1 left-0 right-0 text-center text-[10px] font-bold text-stone-600 group-hover:text-white">
                        {item.orders > 0 ? item.orders : ''}
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-500 whitespace-nowrap">
                      {item.day.split(',')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sales by Category (1 col) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-anulok-espresso flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-anulok-wood" /> Category Share
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">Revenue breakdown by furniture line</p>
          </div>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {categoryDistribution?.map((cat) => {
              const totalCatSales = categoryDistribution.reduce((sum, c) => sum + c.sales, 0) || 1;
              const percent = Math.round((cat.sales / totalCatSales) * 100);
              return (
                <div key={cat.slug} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-anulok-espresso">{cat.name}</span>
                    <span className="text-stone-500">{formatPrice(cat.sales)} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-anulok-wood h-full rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tables Row: Best Sellers & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Sellers */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif text-lg font-bold text-anulok-espresso">Best-Selling Creations</h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-semibold text-anulok-wood hover:underline flex items-center gap-1"
            >
              Manage Products <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {bestSellers?.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-xl border border-stone-200 shrink-0"
                  />
                  <div>
                    <p className="text-xs font-bold text-anulok-espresso truncate max-w-xs">{p.name}</p>
                    <p className="text-[11px] text-stone-500">{p.category} • {formatPrice(p.price)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full">
                    {p.unitsSold} units sold
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif text-lg font-bold text-anulok-espresso flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Low Stock Inventory Alerts
            </h3>
            <span className="text-xs text-rose-600 font-semibold">{lowStockProducts?.length} alerts</span>
          </div>

          {lowStockProducts?.length > 0 ? (
            <div className="divide-y divide-stone-100">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded-xl border border-stone-200 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-anulok-espresso truncate max-w-xs">{p.name}</p>
                      <p className="text-[11px] text-stone-500">SKU: {p.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
                      Only {p.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-8 text-center">All inventory is comfortably stocked.</p>
          )}
        </div>
      </div>
    </div>
  );
}
