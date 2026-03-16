import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(() => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    api
      .get('/wishlist')
      .then((res) => setItems(res.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const wishlistIds = useMemo(() => new Set(items.map((p) => p._id)), [items]);

  const isInWishlist = (productId) => wishlistIds.has(productId);

  const addToWishlist = useCallback(
    async (productId) => {
      if (!user) return Promise.reject(new Error('Login required'));
      await api.post(`/wishlist/${productId}`);
      fetchWishlist();
    },
    [user, fetchWishlist]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!user) return;
      await api.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((p) => p._id !== productId));
    },
    [user]
  );

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!user) return Promise.reject(new Error('Login required'));
      if (wishlistIds.has(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [user, wishlistIds, addToWishlist, removeFromWishlist]
  );

  const value = useMemo(
    () => ({
      items,
      wishlistIds,
      loading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      refresh: fetchWishlist
    }),
    [items, wishlistIds, loading, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, fetchWishlist]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
