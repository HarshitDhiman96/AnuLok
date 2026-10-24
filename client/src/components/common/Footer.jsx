import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useToast } from '../../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    addToast('Thank you for subscribing to Anulok Private Atelier.');
    setEmail('');
  };

  return (
    <footer className="bg-anulok-espresso text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-stone-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-anulok-amber">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide uppercase">100% Solid Timber</h4>
              <p className="text-xs text-stone-400 mt-1">Ethically sourced Teak, Sheesham & American Walnut seasoned for longevity.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-anulok-amber">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide uppercase">White-Glove Placement</h4>
              <p className="text-xs text-stone-400 mt-1">Complimentary in-room assembly & packaging removal on orders above ₹25,000.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-anulok-amber">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide uppercase">30-Day In-Home Trial</h4>
              <p className="text-xs text-stone-400 mt-1">Live with your pieces in your space. 100% stress-free return guarantee.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-anulok-amber">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold tracking-wide uppercase">10-Year Warranty</h4>
              <p className="text-xs text-stone-400 mt-1">Comprehensive structural and craftsmanship coverage for lasting peace of mind.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo light={true} />
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Anulok creates contemplative, architectural furniture designed for peaceful living. Handcrafted by master artisans with natural stone, solid timber, and Italian textiles.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1.5">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-anulok-amber" />
                <a
                  href="https://share.google/wZOokd3joE7B9cXmH"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  Dhiman Wood Works — Dehradun, Uttarakhand
                </a>
              </p>
              <p className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-anulok-amber" />
                <span className="flex flex-col gap-1">
                  <a href="tel:+919410540096" className="break-words hover:text-white">Calling - 9410540096</a>
                  <a href="https://wa.me/919368656212" target="_blank" rel="noreferrer" className="break-words hover:text-white">WhatsApp - 9368656212</a>
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-anulok-amber" />
                <a href="mailto:dhimanwoodworks91@gmail.com" className="break-all hover:text-white">dhimanwoodworks91@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">Categories</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/shop?category=sofas" className="hover:text-white transition-colors">Sofas & Lounges</Link></li>
              <li><Link to="/shop?category=beds" className="hover:text-white transition-colors">Beds & Mattresses</Link></li>
              <li><Link to="/shop?category=dining" className="hover:text-white transition-colors">Dining Tables</Link></li>
              <li><Link to="/shop?category=chairs" className="hover:text-white transition-colors">Accent Chairs</Link></li>
              <li><Link to="/shop?category=wardrobes" className="hover:text-white transition-colors">Wardrobes & Storage</Link></li>
              <li><Link to="/shop?category=coffee-tables" className="hover:text-white transition-colors">Coffee & Side Tables</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold mb-4">The Atelier</h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/about" className="hover:text-white transition-colors">Our Philosophy</Link></li>
              <li><Link to="/about#artisans" className="hover:text-white transition-colors">Master Woodcrafters</Link></li>
              <li><Link to="/about#sustainability" className="hover:text-white transition-colors">Sustainable Forestry</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Showroom Appointments</Link></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/login?role=admin" className="hover:text-amber-400 transition-colors">Staff Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-xs uppercase tracking-widest text-white font-semibold mb-3">Newsletter</h5>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Receive private collection previews, interior styling editorials, and invitations to showroom exhibitions.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-stone-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-anulok-amber transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-anulok-wood hover:bg-anulok-amber text-white text-xs font-semibold rounded transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-stone-500">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <p>© {new Date().getFullYear()} Anulok Living Private Limited. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-end">
          <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
          <span className="hover:text-stone-400 cursor-pointer">Warranty Certificate</span>
          <span className="hover:text-stone-400 cursor-pointer">Care Guides</span>
        </div>
      </div>
    </footer>
  );
}
