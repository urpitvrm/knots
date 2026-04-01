import React from 'react';
import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import PageHeading from '../components/ui/PageHeading';
import EmptyState from '../components/ui/EmptyState';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { user } = useAuth();
  const { items, loading, removeFromWishlist } = useWishlist();

  if (!user) {
    return (
      <div className="page-shell py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <PageHeading title="Wishlist" subtitle="Log in to save your favorite items." />
          <EmptyState
            title="You need to be logged in to view your wishlist."
            actionLabel="Log in"
            actionTo="/login"
          />
        </motion.div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="page-shell py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <PageHeading title="Wishlist" />
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-shell py-10 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <PageHeading title="Wishlist" subtitle="Items you love, saved for later." />
          <EmptyState
            title="Your wishlist is empty."
            message="Add items from the shop with the heart icon."
            actionLabel="Browse shop"
            actionTo="/shop"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-shell py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <PageHeading title="Wishlist" subtitle={`${items.length} item(s) saved.`} />
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="initial"
          animate="animate"
          variants={{
            initial: {},
            animate: { transition: { staggerChildren: 0.05 } }
          }}
        >
          {items.map((product) => (
            <motion.div
              key={product._id}
              variants={{ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className="relative"
            >
              <button
                type="button"
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-beige/60 bg-white/95 shadow-soft text-accent transition hover:border-accent hover:bg-accent hover:text-white"
                aria-label="Remove from wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
