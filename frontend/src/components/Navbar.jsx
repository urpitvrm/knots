import React, { useMemo, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [open, setOpen] = useState(false);

  const links = useMemo(() => {
    const base = [
      { to: '/shop', label: 'Shop' },
      { to: '/gallery', label: 'Gallery' },
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
      { to: '/wishlist', label: `Wishlist${wishlistItems.length ? ` (${wishlistItems.length})` : ''}` },
      { to: '/cart', label: `Cart${items.length ? ` (${items.length})` : ''}` }
    ];

    if (user) {
      base.push(
        { to: '/orders', label: 'My Orders' },
        { to: '/custom-order', label: 'Custom Order' },
        { to: '/profile', label: 'Profile' }
      );
      if (user.role === 'admin') base.push({ to: '/admin', label: 'Admin' });
    } else {
      base.push({ to: '/login', label: 'Login' }, { to: '/signup', label: 'Sign up' });
    }
    return base;
  }, [items.length, user, wishlistItems.length]);

  const linkClass = ({ isActive }) =>
    `transition-colors ${isActive ? 'text-accent font-medium' : 'text-deep/80 hover:text-accent'}`;

  return (
    <motion.header
      className="bg-cream/95 backdrop-blur-sm sticky top-0 z-50 border-b border-beige/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl text-deep hover:opacity-90 transition">
          <span className="text-deep">Cozy</span>
          <span className="text-accent">Loops</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-5">
          {user && <NotificationBell />}
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          {user && (
            <motion.button
              className="btn btn-secondary"
              onClick={logout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          )}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="rounded-lg border border-beige bg-white px-3 py-2 text-sm font-medium text-deep lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <div className="border-t border-beige/60 bg-cream">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 lg:hidden">
            {user && (
              <div className="mb-2">
                <NotificationBell />
              </div>
            )}
            {links.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkClass({ isActive })} rounded-lg px-3 py-2 hover:bg-beige/40`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {user && (
              <motion.button
                className="mt-1 rounded-lg border border-beige bg-white px-3 py-2 text-left text-sm text-deep"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                whileTap={{ scale: 0.98 }}
              >
                Logout
              </motion.button>
            )}
          </nav>
        </div>
      )}
    </motion.header>
  );
}
