import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Manage Products' },
  { to: '/admin/orders', label: 'Manage Orders' },
  { to: '/admin/users', label: 'Manage Users' },
  { to: '/admin/coupons', label: 'Coupons' }
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-cream font-body">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4">
          <Link
            to="/"
            className="text-sm text-deep/70 hover:text-accent transition-colors"
          >
            ← Back to shop
          </Link>
        </div>
        <motion.div
          className="flex flex-col md:flex-row gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <aside className="w-full md:w-60 flex-shrink-0">
            <nav className="rounded-2xl border border-beige/60 bg-white shadow-soft p-4 h-fit sticky top-24">
              <ul className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
                {navItems.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to))
                          ? 'bg-accent/15 text-accent'
                          : 'text-deep/70 hover:bg-beige/40 hover:text-deep'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <section className="flex-1 min-w-0">
            {children || <Outlet />}
          </section>
        </motion.div>
      </div>
    </div>
  );
}

