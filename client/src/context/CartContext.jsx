import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('anulok_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('anulok_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToast } = useToast();

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('anulok_cart', JSON.stringify(items));
  }, [items]);

  // Save coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('anulok_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('anulok_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1, selectedColor = null) => {
    const colorHex = selectedColor?.hex || (product.colors && product.colors[0]?.hex) || null;
    const colorName = selectedColor?.name || (product.colors && product.colors[0]?.name) || null;
    const cartItemId = `${product.id}-${colorName || 'default'}`;

    setItems(prevItems => {
      const existing = prevItems.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prevItems.map(item =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const itemPrice = product.discountPrice || product.price;
        return [
          ...prevItems,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: itemPrice,
            originalPrice: product.price,
            discountPercentage: product.discountPercentage || 0,
            image: (product.images && product.images[0]) || '',
            material: product.material,
            category: product.category,
            categoryName: product.categoryName,
            colorName,
            colorHex,
            quantity: Math.max(1, quantity),
            stock: product.stock
          }
        ];
      }
    });

    addToast(`"${product.name}" added to your cart.`);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId) => {
    const item = items.find(i => i.cartItemId === cartItemId);
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
    if (item) {
      addToast(`Removed "${item.name}" from cart.`, 'info');
    }
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Calculations
  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  // Recalculate coupon discount dynamically whenever subtotal changes
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || subtotal === 0) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      let discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maximumDiscount && discount > appliedCoupon.maximumDiscount) {
        discount = appliedCoupon.maximumDiscount;
      }
      return discount;
    } else {
      return Math.min(appliedCoupon.discountValue, subtotal);
    }
  }, [appliedCoupon, subtotal]);

  // Delivery Charges: Free delivery above ₹25,000, otherwise ₹999
  const deliveryCharge = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 25000 ? 0 : 999;
  }, [subtotal]);

  // 18% GST on taxable value (subtotal - discount)
  const tax = useMemo(() => {
    const taxableValue = Math.max(0, subtotal - couponDiscount);
    return Math.round(taxableValue * 0.18);
  }, [subtotal, couponDiscount]);

  // Total amount
  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - couponDiscount + deliveryCharge + tax);
  }, [subtotal, couponDiscount, deliveryCharge, tax]);

  // Apply Coupon via API validation
  const applyCoupon = async (code) => {
    if (!code || !code.trim()) {
      addToast('Please enter a coupon code.', 'error');
      return { success: false, message: 'Please enter a coupon code.' };
    }

    try {
      const res = await api.validateCoupon(code.trim(), subtotal);
      if (res.valid) {
        setAppliedCoupon(res.coupon);
        addToast(res.message || 'Coupon applied successfully!');
        return { success: true, message: res.message };
      } else {
        addToast(res.message || 'Invalid or expired coupon.', 'error');
        return { success: false, message: res.message };
      }
    } catch (err) {
      addToast(err.message || 'Invalid or expired coupon.', 'error');
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        couponDiscount,
        deliveryCharge,
        tax,
        total,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
