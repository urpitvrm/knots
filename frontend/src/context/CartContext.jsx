import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const LS_KEY = 'cozyloops_cart';

function parseGuestCart() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(() => {
    if (!user) {
      const guest = parseGuestCart();
      setItems(guest);
      return;
    }
    setLoading(true);
    api
      .get('/cart')
      .then((res) => setItems(res.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) {
      setItems(parseGuestCart());
      return;
    }
    const guest = parseGuestCart();
    if (guest.length > 0) {
      setLoading(true);
      api
        .post('/cart/merge', {
          items: guest.map((i) => ({ productId: i.product._id, quantity: i.quantity }))
        })
        .then((res) => {
          setItems(res.data.items || []);
          localStorage.removeItem(LS_KEY);
        })
        .catch(() => fetchCart())
        .finally(() => setLoading(false));
    } else {
      fetchCart();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (user) {
        setLoading(true);
        api
          .post('/cart', { productId: product._id, quantity })
          .then((res) => setItems(res.data.items || []))
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        const guest = parseGuestCart();
        const existing = guest.find((p) => p.product._id === product._id);
        let next;
        if (existing) {
          next = guest.map((p) =>
            p.product._id === product._id ? { ...p, quantity: p.quantity + quantity } : p
          );
        } else {
          next = [...guest, { product, quantity }];
        }
        setItems(next);
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      }
    },
    [user]
  );

  const updateQty = useCallback(
    (productId, quantity) => {
      if (user) {
        api
          .put('/cart', { productId, quantity })
          .then((res) => setItems(res.data.items || []))
          .catch(() => {});
      } else {
        const guest = parseGuestCart();
        const next = guest.map((p) => (p.product._id === productId ? { ...p, quantity } : p));
        setItems(next);
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      }
    },
    [user]
  );

  const removeFromCart = useCallback(
    (productId) => {
      if (user) {
        api
          .delete(`/cart/${productId}`)
          .then((res) => setItems(res.data.items || []))
          .catch(() => {});
      } else {
        const guest = parseGuestCart().filter((p) => p.product._id !== productId);
        setItems(guest);
        localStorage.setItem(LS_KEY, JSON.stringify(guest));
      }
    },
    [user]
  );

  const clearCart = useCallback(() => {
    if (user) {
      api
        .delete('/cart/clear')
        .then(() => setItems([]))
        .catch(() => {});
    } else {
      setItems([]);
      localStorage.removeItem(LS_KEY);
    }
  }, [user]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + (i.product?.price ?? 0) * (i.quantity ?? 0), 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart,
      total,
      loading,
      refreshCart: fetchCart
    }),
    [items, addToCart, updateQty, removeFromCart, clearCart, total, loading, fetchCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
