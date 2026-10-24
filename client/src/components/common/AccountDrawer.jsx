import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  User,
  Package,
  KeyRound,
  MapPin,
  ShoppingCart,
  Headphones,
  LogOut,
  LogIn,
  ChevronRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatPrice, formatDate, getStatusColor } from '../../utils/formatters';
import BrandLogo from './BrandLogo';

export default function AccountDrawer({ isOpen, onClose }) {
  const { user, logout, changePassword, updateProfile } = useAuth();
  const { items, cartCount, subtotal, openDrawer: openCartDrawer } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Active section tab: 'overview' | 'orders' | 'security' | 'address' | 'help'
  const [activeTab, setActiveTab] = useState('overview');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Address Editing State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [savingAddress, setSavingAddress] = useState(false);

  // Fetch orders when drawer opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setLoadingOrders(true);
      api.getMyOrders()
        .then((res) => setOrders(res.orders || []))
        .catch((err) => console.warn('Could not load orders in AccountDrawer', err))
        .finally(() => setLoadingOrders(false));
      setAddressInput(user.address || '');
    }
  }, [isOpen, user]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      addToast('Please enter your current password.', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      addToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setActiveTab('overview');
    } catch {
      // Error handled by AuthContext toast
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle address update
  const handleSaveAddress = async () => {
    if (!addressInput.trim()) {
      addToast('Please enter your address.', 'error');
      return;
    }
    setSavingAddress(true);
    try {
      await updateProfile({ address: addressInput.trim() });
      setIsEditingAddress(false);
    } catch {
      // Error handled by toast
    } finally {
      setSavingAddress(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-anulok-espresso/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-stone-200 animate-slide-left">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-100 bg-gradient-to-b from-anulok-linen/40 to-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-anulok-sand border border-anulok-wood/20 flex items-center justify-center text-anulok-wood font-serif font-bold text-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-anulok-wood" />}
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-anulok-espresso leading-tight">
                  {user ? user.name : 'Atelier Patron Account'}
                </h2>
                <p className="text-[11px] text-stone-500 font-medium">
                  {user ? (user.role === 'admin' ? 'Atelier Administrator' : 'Anulok Private Patron') : 'Sign in to access your profile'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Account Panel"
              className="p-2 text-stone-400 hover:text-anulok-espresso hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Pill Switcher */}
          {user && (
            <div className="px-4 py-2 bg-stone-50 border-b border-stone-200/80 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-anulok-espresso text-white'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-anulok-espresso text-white'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                Orders {orders.length > 0 && <span className="text-[10px] px-1.5 py-0.2 bg-anulok-amber text-anulok-espresso rounded-full font-bold">{orders.length}</span>}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                  activeTab === 'security'
                    ? 'bg-anulok-espresso text-white'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('address')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                  activeTab === 'address'
                    ? 'bg-anulok-espresso text-white'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                Address
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('help')}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors ${
                  activeTab === 'help'
                    ? 'bg-anulok-espresso text-white'
                    : 'text-stone-600 hover:bg-stone-200/60'
                }`}
              >
                Help
              </button>
            </div>
          )}

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {!user ? (
              /* GUEST VIEW */
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-anulok-sand/40 to-anulok-cream border border-anulok-wood/20 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center mx-auto text-anulok-wood">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-anulok-espresso">
                    Welcome to Anulok
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Sign in to track your white-glove furniture deliveries, manage saved addresses, and receive tailored interior styling advice.
                  </p>
                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      to="/login"
                      onClick={onClose}
                      className="w-full py-3 bg-anulok-espresso hover:bg-anulok-wood text-white text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <LogIn className="w-4 h-4" /> Sign In to Account
                    </Link>
                    <Link
                      to="/login?mode=register"
                      onClick={onClose}
                      className="w-full py-2.5 bg-white hover:bg-stone-50 text-anulok-espresso text-xs font-semibold rounded-xl border border-stone-200 transition-colors"
                    >
                      Create an Account
                    </Link>
                  </div>
                </div>

                {/* Quick Shortcuts for Guests */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block px-1">
                    Quick Navigation
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openCartDrawer();
                    }}
                    className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center justify-between text-left transition-colors border border-stone-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-anulok-wood shadow-xs">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-anulok-espresso block">Cart & Bag</span>
                        <span className="text-[11px] text-stone-500">{cartCount} items in bag ({formatPrice(subtotal)})</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>

                  <Link
                    to="/my-orders"
                    onClick={onClose}
                    className="p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center justify-between transition-colors border border-stone-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-anulok-wood shadow-xs">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-anulok-espresso block">Track Your Order</span>
                        <span className="text-[11px] text-stone-500">Lookup status via order ID</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>

                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center justify-between transition-colors border border-stone-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-anulok-wood shadow-xs">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-anulok-espresso block">Concierge & Help Desk</span>
                        <span className="text-[11px] text-stone-500">Live support, white-glove queries</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>
                </div>
              </div>
            ) : (
              /* LOGGED IN VIEW */
              <>
                {/* 1. OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-5 animate-fade-in">
                    {/* Patron Details Card */}
                    <div className="p-5 rounded-3xl bg-anulok-cream border border-stone-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-anulok-wood">
                          Profile Details
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active Patron
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Email</span>
                          <span className="font-semibold text-anulok-espresso truncate block">{user.email || '—'}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Phone</span>
                          <span className="font-semibold text-anulok-espresso block">{user.phone || '—'}</span>
                        </div>
                        {user.age && (
                          <div>
                            <span className="text-stone-400 block text-[10px] uppercase">Age</span>
                            <span className="font-semibold text-anulok-espresso">{user.age} yrs</span>
                          </div>
                        )}
                        {user.gender && (
                          <div>
                            <span className="text-stone-400 block text-[10px] uppercase">Gender</span>
                            <span className="font-semibold text-anulok-espresso capitalize">{user.gender}</span>
                          </div>
                        )}
                      </div>

                      {user.address && (
                        <div className="pt-2 border-t border-stone-200/60 text-xs">
                          <span className="text-stone-400 block text-[10px] uppercase">Saved Delivery Address</span>
                          <span className="text-stone-700 text-xs leading-relaxed block mt-0.5">{user.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Metric Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-anulok-wood/40 transition-colors text-left shadow-xs group"
                      >
                        <Package className="w-5 h-5 text-anulok-wood mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-serif font-bold text-anulok-espresso block">
                          {orders.length}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">Orders Placed</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openCartDrawer();
                        }}
                        className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-anulok-wood/40 transition-colors text-left shadow-xs group"
                      >
                        <ShoppingCart className="w-5 h-5 text-anulok-wood mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-serif font-bold text-anulok-espresso block">
                          {cartCount}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">Cart Items ({formatPrice(subtotal)})</span>
                      </button>
                    </div>

                    {/* Quick Menu Options */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block px-1">
                        Account Controls
                      </span>

                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center justify-between text-left transition-colors border border-stone-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-anulok-wood shadow-xs">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-anulok-espresso block">Order History</span>
                            <span className="text-[11px] text-stone-500">Track shipments & deliveries</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center justify-between text-left transition-colors border border-stone-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-anulok-wood shadow-xs">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-anulok-espresso block">Change Password</span>
                            <span className="text-[11px] text-stone-500">Update account credentials</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('address')}
                        className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center justify-between text-left transition-colors border border-stone-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-anulok-wood shadow-xs">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-anulok-espresso block">Delivery Address</span>
                            <span className="text-[11px] text-stone-500">Edit saved shipping address</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab('help')}
                        className="w-full p-3.5 bg-stone-50 hover:bg-stone-100 rounded-2xl flex items-center justify-between text-left transition-colors border border-stone-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-anulok-wood shadow-xs">
                            <Headphones className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-anulok-espresso block">Contact & Concierge</span>
                            <span className="text-[11px] text-stone-500">Customer care & assembly queries</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-stone-400" />
                      </button>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={onClose}
                          className="p-3.5 bg-amber-50 hover:bg-amber-100/80 rounded-2xl flex items-center justify-between transition-colors border border-amber-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-900 flex items-center justify-center text-amber-100 shadow-xs">
                              <ShieldCheck className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-amber-950 block">Atelier Admin Panel</span>
                              <span className="text-[11px] text-amber-700">Manage products, orders & coupons</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-amber-700" />
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-sm font-bold text-anulok-espresso">
                        Order History ({orders.length})
                      </h3>
                      <Link
                        to="/my-orders"
                        onClick={onClose}
                        className="text-xs text-anulok-wood font-semibold hover:underline flex items-center gap-1"
                      >
                        View Full Screen <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>

                    {loadingOrders ? (
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="h-28 bg-stone-100 rounded-2xl animate-pulse" />
                        ))}
                      </div>
                    ) : orders.length > 0 ? (
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-2.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-bold text-anulok-espresso">#{order.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusColor(order.orderStatus)}`}>
                                {order.orderStatus}
                              </span>
                            </div>

                            <div className="text-xs text-stone-500 flex items-center justify-between">
                              <span>{formatDate(order.createdAt)}</span>
                              <span className="font-bold text-anulok-espresso">{formatPrice(order.total)}</span>
                            </div>

                            {order.items && order.items.length > 0 && (
                              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-600 truncate">
                                {order.items.map((it) => `${it.name} (x${it.quantity})`).join(', ')}
                              </div>
                            )}

                            <Link
                              to={`/order-confirmation/${order.id}`}
                              onClick={onClose}
                              className="block text-center py-2 bg-anulok-cream hover:bg-stone-200/60 rounded-xl text-xs font-semibold text-anulok-espresso transition-colors"
                            >
                              View Invoice & Delivery Tracking
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 bg-anulok-cream rounded-3xl p-6">
                        <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                        <h4 className="font-serif font-bold text-anulok-espresso text-sm">No Orders Yet</h4>
                        <p className="text-xs text-stone-500 mt-1 mb-4">
                          Your bespoke furniture orders will appear here once placed.
                        </p>
                        <Link
                          to="/shop"
                          onClick={onClose}
                          className="px-5 py-2.5 bg-anulok-espresso text-white text-xs font-semibold rounded-xl inline-block"
                        >
                          Explore Collections
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SECURITY / CHANGE PASSWORD TAB */}
                {activeTab === 'security' && (
                  <form onSubmit={handleChangePassword} className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-anulok-espresso">
                        Change Password
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Update your account password to keep your atelier patron profile secure.
                      </p>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood"
                        />
                        <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                        New Password (min 6 characters) *
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-9 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood"
                        />
                        <KeyRound className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                        >
                          {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] uppercase font-bold tracking-wider text-stone-600 block mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-4 py-2.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood"
                        />
                        <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingPassword}
                      className="w-full py-3 bg-anulok-espresso hover:bg-anulok-wood text-white text-xs uppercase tracking-wider font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
                    >
                      {savingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                )}

                {/* 4. ADDRESS TAB */}
                {activeTab === 'address' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-anulok-espresso">
                        Delivery Address
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Your preferred address for white-glove in-home delivery and assembly.
                      </p>
                    </div>

                    {isEditingAddress ? (
                      <div className="space-y-3">
                        <textarea
                          rows={4}
                          value={addressInput}
                          onChange={(e) => setAddressInput(e.target.value)}
                          placeholder="Enter complete street, building, city, state, and pincode..."
                          className="w-full p-3.5 bg-anulok-cream border border-stone-300 rounded-xl text-xs outline-none focus:border-anulok-wood leading-relaxed"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={savingAddress}
                            onClick={handleSaveAddress}
                            className="flex-1 py-2.5 bg-anulok-espresso hover:bg-anulok-wood text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                          >
                            {savingAddress ? 'Saving...' : 'Save Address'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingAddress(false);
                              setAddressInput(user.address || '');
                            }}
                            className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-anulok-cream border border-stone-200 space-y-3">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-anulok-wood shrink-0 mt-0.5" />
                          <p className="text-xs text-stone-800 leading-relaxed font-medium">
                            {user.address || 'No address saved yet.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingAddress(true)}
                          className="w-full py-2 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-anulok-wood transition-colors"
                        >
                          Edit Delivery Address
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 5. CONTACT & HELP TAB */}
                {activeTab === 'help' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="font-serif text-sm font-bold text-anulok-espresso">
                        Anulok Concierge & Help
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        We are at your service for orders, custom timber specifications, and aftercare.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-anulok-cream border border-stone-200 space-y-3 text-xs">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-anulok-wood" />
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Concierge Helpline</span>
                          <a href="tel:+919368656212" className="font-semibold text-anulok-espresso hover:underline">
                            +91 93686 56212
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-stone-200/60">
                        <Mail className="w-4 h-4 text-anulok-wood" />
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Email Support</span>
                          <a href="mailto:support@anulok.com" className="font-semibold text-anulok-espresso hover:underline">
                            support@anulok.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-stone-200/60">
                        <Clock className="w-4 h-4 text-anulok-wood" />
                        <div>
                          <span className="text-stone-400 block text-[10px] uppercase">Atelier Hours</span>
                          <span className="font-semibold text-anulok-espresso">
                            Mon – Sat: 9:00 AM – 9:00 PM IST
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <a
                        href="https://wa.me/919368656212?text=Hello%20Anulok%20Concierge,%20I%20have%20an%20inquiry%20regarding%20my%20account."
                        target="_blank"
                        rel="noreferrer"
                        className="w-full p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-4 h-4" /> Message Concierge on WhatsApp
                      </a>

                      <Link
                        to="/contact"
                        onClick={onClose}
                        className="w-full p-3 bg-white hover:bg-stone-50 border border-stone-200 text-anulok-espresso rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Visit Full Support Page
                      </Link>
                    </div>

                    {/* Warranty & Returns Highlight */}
                    <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-[11px] text-stone-600 space-y-1">
                      <p className="font-semibold text-anulok-espresso">10-Year Structural Frame Warranty</p>
                      <p>All solid teak, oak, and birch frames come with complete white-glove warranty coverage and complimentary in-home inspection.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {user && (
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                Logged in as <strong className="text-stone-600">{user.name.split(' ')[0]}</strong>
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-rose-200/60"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
