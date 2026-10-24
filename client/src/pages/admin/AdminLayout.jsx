import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingBag,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../../components/common/BrandLogo';

export default function AdminLayout({ children, activeTab, setActiveTab }) {
  const { user, isAdmin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Route Protection Check
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-anulok-cream flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-stone-200 text-center shadow-luxury">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-anulok-espresso">Access Restricted</h2>
          <p className="text-xs text-stone-500 mt-2 mb-6">
            You must be logged in as an authorized store administrator to access the Anulok Control Center.
          </p>
          <div className="space-y-2">
            <Link
              to="/login?role=admin"
              className="block w-full py-3 bg-anulok-espresso text-white text-xs uppercase tracking-wider font-semibold rounded-xl hover:bg-anulok-wood transition-colors"
            >
              Sign In as Administrator
            </Link>
            <Link
              to="/"
              className="block w-full py-2.5 text-xs text-stone-500 hover:text-anulok-espresso font-semibold"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'coupons', label: 'Discounts & Coupons', icon: Tag },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col bg-anulok-espresso text-white shrink-0 border-r border-stone-800">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <BrandLogo light={true} compact={true} />
        </div>

        {/* Admin Tag */}
        <div className="px-6 py-3 bg-white/5 border-b border-stone-800 flex items-center gap-2 text-xs text-stone-300">
          <ShieldCheck className="w-4 h-4 text-anulok-amber" />
          <span>Admin Atelier Hub</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-anulok-wood text-white shadow-md'
                    : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" /> View Storefront
            </span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-anulok-espresso text-white p-4 flex items-center justify-between border-b border-stone-800">
          <BrandLogo light={true} compact={true} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-stone-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {sidebarOpen && (
          <div className="lg:hidden bg-anulok-espresso text-white p-4 border-b border-stone-800 space-y-2 animate-slide-up">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider ${
                    isActive ? 'bg-anulok-wood text-white' : 'text-stone-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-stone-800 flex justify-between">
              <Link to="/" className="text-xs text-stone-400 hover:text-white">View Storefront</Link>
              <button onClick={() => logout()} className="text-xs text-rose-400">Sign Out</button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
