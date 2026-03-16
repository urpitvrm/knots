import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const inWishlist = isInWishlist(product._id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWishlist(product._id).catch(() => {});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="card overflow-hidden relative"
    >
      <button
        type="button"
        onClick={handleHeartClick}
        className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center transition hover:bg-accent/20"
        aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${inWishlist ? 'text-accent fill-accent' : 'text-deep/60'}`}
          viewBox="0 0 20 20"
          fill={inWishlist ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </button>
      <Link to={`/product/${product._id}`}>
        <img
          src={getImageUrl(product.images?.[0]) || 'https://via.placeholder.com/600x600?text=CozyLoops'}
          alt={product.name}
          className="w-full h-56 object-cover"
        />
      </Link>
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-deep/70 text-sm line-clamp-2">{product.description}</p>
        {product.averageRating > 0 && (
          <div className="flex items-center gap-1 mt-1 text-amber-500">
            <span className="text-sm">★</span>
            <span className="text-sm text-deep/70">{product.averageRating.toFixed(1)}</span>
            {product.reviewCount > 0 && (
              <span className="text-xs text-deep/50">({product.reviewCount})</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="font-bold">${product.price.toFixed(2)}</span>
          <Link to={`/product/${product._id}`} className="btn btn-secondary text-sm">
            View
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
