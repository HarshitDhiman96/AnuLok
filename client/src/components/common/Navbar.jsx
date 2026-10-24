import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
  LogOut,
  Package
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import SearchModal from './SearchModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  const { cartCount, openDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Categories', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200/80 py-3.5'
            : 'bg-anulok-cream/90 backdrop-blur-xs border-b border-stone-200/40 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Hamburger & Desktop Links */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-anulok-espresso hover:text-anulok-wood transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <BrandLogo />
            </div>

            {/* Middle: Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-xs uppercase tracking-[0.16em] font-medium transition-all duration-200 hover:text-anulok-wood relative py-1 ${
                      isActive ? 'text-anulok-wood font-semibold' : 'text-anulok-espresso'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-anulok-wood rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart, User) */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-anulok-espresso hover:text-anulok-wood hover:bg-stone-200/50 rounded-full transition-colors"
                aria-label="Search furniture"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                to="/shop?view=wishlist"
                className="relative p-2.5 text-anulok-espresso hover:text-anulok-wood hover:bg-stone-200/50 rounded-full transition-colors hidden sm:inline-flex"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-anulok-amber rounded-full px-1 shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Icon with Live Count Badge */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative p-2.5 text-anulok-espresso hover:text-anulok-wood hover:bg-stone-200/50 rounded-full transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-anulok-wood rounded-full px-1 shadow-xs animate-scale">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User / Login Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-2 text-anulok-espresso hover:text-anulok-wood hover:bg-stone-200/50 rounded-full transition-colors"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5" />
                  {user && (
                    <ChevronDown className="w-3.5 h-3.5 text-stone-500 hidden sm:inline-block" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-slide-up">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs text-stone-400 font-medium">Signed in as</p>
                          <p className="text-sm font-semibold text-anulok-espresso truncate">{user.name}</p>
                          <p className="text-xs text-stone-500 truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                              Store Admin
                            </span>
                          )}
                        </div>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-anulok-espresso hover:bg-anulok-cream hover:text-anulok-wood font-medium"
                          >
                            <ShieldAlert className="w-4 h-4 text-anulok-amber" /> Admin Dashboard
                          </Link>
                        )}

                        <Link
                          to="/my-orders"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-anulok-espresso hover:bg-anulok-cream hover:text-anulok-wood font-medium"
                        >
                          <Package className="w-4 h-4 text-stone-500" /> My Orders
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 text-left font-medium border-t border-stone-100 mt-1"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-xs text-stone-500">
                          Experience handcrafted luxury living.
                        </div>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-sm text-anulok-espresso hover:bg-anulok-cream font-medium"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="block px-4 py-2 text-sm text-anulok-wood hover:bg-anulok-cream font-medium"
                        >
                          Create Account
                        </Link>
                        <div className="border-t border-stone-100 my-1 pt-1">
                          <Link
                            to="/login?role=admin"
                            className="flex items-center gap-1.5 px-4 py-1.5 text-xs text-stone-500 hover:text-anulok-wood"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-anulok-amber" /> Admin Portal
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-6 space-y-4 animate-slide-up shadow-xl">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold uppercase tracking-wider text-anulok-espresso hover:text-anulok-wood py-2 border-b border-stone-100"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/shop?view=wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider text-anulok-espresso hover:text-anulok-wood py-2 flex items-center justify-between border-b border-stone-100"
              >
                <span>Wishlist</span>
                <span className="text-xs bg-stone-200 px-2 py-0.5 rounded-full">{wishlistCount}</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-2 rounded-lg"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
