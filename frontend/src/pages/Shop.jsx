import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import PageHeading from '../components/ui/PageHeading';
import EmptyState from '../components/ui/EmptyState';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';

function readSearchParams(search) {
  const p = new URLSearchParams(search);
  return {
    q: p.get('search') || '',
    category: p.get('category') || '',
    minPrice: p.get('minPrice') || '',
    maxPrice: p.get('maxPrice') || '',
    minRating: p.get('minRating') || '',
    inStock: p.get('inStock') === 'true'
  };
}

function toApiParams(fields) {
  return {
    search: fields.q || undefined,
    category: fields.category || undefined,
    minPrice: fields.minPrice || undefined,
    maxPrice: fields.maxPrice || undefined,
    minRating: fields.minRating || undefined,
    inStock: fields.inStock ? 'true' : undefined,
    limit: 50
  };
}

export default function Shop() {
  const { search } = useLocation();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [inStock, setInStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    const fields = readSearchParams(search);
    setQ(fields.q);
    setCategory(fields.category);
    setMinPrice(fields.minPrice);
    setMaxPrice(fields.maxPrice);
    setMinRating(fields.minRating);
    setInStock(fields.inStock);
    setLoading(true);
    api
      .get('/products', { params: toApiParams(fields) })
      .then((res) => setItems(res.data.items))
      .finally(() => setLoading(false));
  }, [search]);

  const applyFilters = useCallback(() => {
    setLoading(true);
    api
      .get('/products', {
        params: toApiParams({ q, category, minPrice, maxPrice, minRating, inStock })
      })
      .then((res) => setItems(res.data.items))
      .finally(() => setLoading(false));
  }, [q, category, minPrice, maxPrice, minRating, inStock]);

  return (
    <div className="page-shell py-10 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <PageHeading title="Shop" subtitle="Handmade crochet pieces for every mood." />
        <motion.div
          className="card p-4 sm:p-5 mb-8 border border-beige/60 shadow-soft"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:flex-wrap lg:items-end">
            <div className="flex-1 min-w-[min(100%,12rem)]">
              <label htmlFor="shop-search" className="sr-only">
                Search products
              </label>
              <input
                id="shop-search"
                placeholder="Search products…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-xl border border-beige/80 bg-cream/80 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:flex-initial lg:flex-wrap">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Category"
                className="w-full sm:w-auto min-w-[10rem] rounded-xl border border-beige/80 bg-cream/80 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                min="0"
                step="1"
                className="w-full sm:w-24 rounded-xl border border-beige/80 bg-cream/80 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                min="0"
                step="1"
                className="w-full sm:w-24 rounded-xl border border-beige/80 bg-cream/80 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                aria-label="Minimum rating"
                className="w-full sm:w-auto min-w-[9rem] rounded-xl border border-beige/80 bg-cream/80 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              >
                <option value="">Any rating</option>
                <option value="4">4+ stars</option>
                <option value="3">3+ stars</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-deep/80 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded border-beige/80 text-accent focus:ring-accent/40"
                />
                In stock only
              </label>
              <button type="button" className="btn px-5 py-2.5 w-full sm:w-auto" onClick={applyFilters}>
                Apply filters
              </button>
            </div>
          </div>
        </motion.div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState title="No products match your filters." actionLabel="Clear filters" actionTo="/shop" />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: { transition: { staggerChildren: 0.05 } }
            }}
          >
            {items.map((p) => (
              <motion.div
                key={p._id}
                variants={{ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
