import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Headphones, House, Info, Menu, ShoppingCart, Store, UserRound, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { OPENING_SCROLL_DISTANCE } from '../home/OpeningExperience';

const links = [
  { label: 'Home', path: '/', Icon: House },
  { label: 'Shop', path: '/shop', Icon: Store },
  { label: 'Support', path: '/contact', Icon: Headphones },
  { label: 'Cart', path: '/cart', Icon: ShoppingCart },
  { label: 'About Us', path: '/about', Icon: Info },
  { label: 'Profile', path: '/account', Icon: UserRound },
];

export default function FloatingNavbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const updateVisibility = () => {
      const revealAt = location.pathname === '/' ? OPENING_SCROLL_DISTANCE : 320;
      setIsVisible(window.scrollY >= revealAt);
    };
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div
      className={`fixed inset-x-0 bottom-5 z-50 flex justify-center px-3 pb-[env(safe-area-inset-bottom)] transition-all duration-300 ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-5 opacity-0'
      }`}
    >
      <nav
        aria-label="Quick navigation"
        className="relative flex items-stretch overflow-visible rounded-xl border border-white/70 bg-white/95 shadow-[0_12px_36px_rgba(31,29,27,0.18)] backdrop-blur-xl"
      >
        {menuOpen && (
          <div className="absolute bottom-full left-0 mb-3 min-w-48 overflow-hidden rounded-xl border border-anulok-stone/60 bg-anulok-cream p-2 shadow-xl">
            {[
              { label: 'Explore categories', path: '/#categories' },
              { label: 'Our story', path: '/about' },
              { label: 'My orders', path: '/my-orders' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block rounded-lg px-4 py-3 text-sm text-anulok-espresso transition-colors hover:bg-anulok-sand"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close quick menu' : 'Open quick menu'}
          aria-expanded={menuOpen}
          className="flex w-12 shrink-0 items-center justify-center rounded-l-xl bg-anulok-espresso text-white transition-colors hover:bg-anulok-wood sm:w-16"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {links.map(({ label, path, Icon }) => {
              const isActive = location.pathname === path || (path === '/account' && location.pathname.startsWith('/account'));
          return (
            <Link
              key={label}
              to={path}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-w-[52px] flex-col items-center justify-center gap-1 px-1.5 py-2 text-anulok-espresso transition-colors hover:bg-anulok-linen sm:min-w-[84px] sm:px-4 ${
                isActive ? 'text-anulok-wood' : ''
                } ${label === 'Profile' ? 'min-w-[64px] rounded-r-xl sm:min-w-[84px]' : ''}`}
            >
              <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
              <span className="text-[10px] font-medium leading-none sm:text-xs">{label}</span>
              {label === 'Cart' && cartCount > 0 && (
                <span className="absolute right-2 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-anulok-wood px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
