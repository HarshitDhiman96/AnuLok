import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useToast } from './ToastContext';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('anulok_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { addToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const syncedUserId = useRef(null);
  const saveQueue = useRef(Promise.resolve());

  useEffect(() => {
    localStorage.setItem('anulok_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    syncedUserId.current = null;
    if (!user) return undefined;

    const syncWishlist = async () => {
      try {
        const { products: storedProducts = [] } = await api.getWishlist();
        if (!active) return;
        const hasSyncedAccount = Boolean(localStorage.getItem('anulok_wishlist_owner'));
        const guestProducts = hasSyncedAccount
          ? []
          : JSON.parse(localStorage.getItem('anulok_wishlist') || '[]');
        const merged = [...new Map([...storedProducts, ...guestProducts].map(product => [product.id, product])).values()];
        await api.saveWishlist(merged.map(product => product.id));
        if (!active) return;
        setWishlist(merged);
        localStorage.setItem('anulok_wishlist_owner', user.id);
        syncedUserId.current = user.id;
      } catch (error) {
        if (active) addToast(error.message || 'Could not sync your wishlist with your account.', 'error');
      }
    };

    syncWishlist();
    return () => { active = false; };
  }, [user?.id, authLoading]);

  useEffect(() => {
    if (!user || syncedUserId.current !== user.id) return;
    const productIds = wishlist.map(product => product.id);
    saveQueue.current = saveQueue.current
      .catch(() => {})
      .then(() => syncedUserId.current === user.id ? api.saveWishlist(productIds) : null)
      .catch(error => addToast(error.message || 'Could not save your wishlist.', 'error'));
  }, [wishlist, user?.id]);

  const toggleWishlist = (product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      addToast(`Removed "${product.name}" from your wishlist.`, 'info');
    } else {
      setWishlist(prev => [...prev, product]);
      addToast(`Added "${product.name}" to your wishlist.`);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistCount: wishlist.length, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
