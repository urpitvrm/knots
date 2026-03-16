import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { items: wishlistItems } = useWishlist();

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
        <nav className="flex items-center gap-6">
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          <NavLink to="/wishlist" className={linkClass + ' relative'}>
            Wishlist
            {wishlistItems.length > 0 && (
              <motion.span
                className="absolute -top-2 -right-3 bg-blush text-deep text-xs rounded-full px-1.5 min-w-[1.25rem] text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {wishlistItems.length}
              </motion.span>
            )}
          </NavLink>
          <NavLink to="/cart" className={linkClass + ' relative'}>
            Cart
            {items.length > 0 && (
              <motion.span
                className="absolute -top-2 -right-3 bg-accent text-white text-xs rounded-full px-2 min-w-[1.25rem] text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                {items.length}
              </motion.span>
            )}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/orders" className={linkClass}>My Orders</NavLink>
              <NavLink to="/profile" className={linkClass}>Profile</NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={linkClass}>Admin</NavLink>
              )}
              <motion.button
                className="btn btn-secondary"
                onClick={logout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink to="/signup" className={linkClass}>Sign up</NavLink>
            </>
          )}
        </nav>
      </div>
    </motion.header>
  );
}
