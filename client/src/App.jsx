import React, { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import FloatingNavbar from './components/common/FloatingNavbar';
import CartDrawer from './components/cart/CartDrawer';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AccountPage from './pages/AccountPage';
import AdminPortalPage from './pages/admin/AdminPortalPage';

function RouteScrollManager() {
  const location = useLocation();

  useLayoutEffect(() => {
    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) {
        target.scrollIntoView({ block: 'start' });
        return;
      }
    }

    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousScrollBehavior;
  }, [location.key, location.pathname, location.search, location.hash]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-anulok-cream">
      <RouteScrollManager />
      {/* Show Navbar, CartDrawer, and Footer only on customer-facing routes */}
      {!isAdminRoute && !isHomePage && <Navbar />}
      {!isAdminRoute && <CartDrawer />}
      {!isAdminRoute && <FloatingNavbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/signin" element={<AuthPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/admin/*" element={<AdminPortalPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}
