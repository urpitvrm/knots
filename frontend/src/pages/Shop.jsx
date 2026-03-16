import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import PageHeading from '../components/ui/PageHeading';
import EmptyState from '../components/ui/EmptyState';
import ProductCardSkeleton from '../components/ui/ProductCardSkeleton';

export default function Shop() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const [items, setItems] = useState([]);
  const [q, setQ] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || '');
  const [minPrice, setMinPrice] = useState(params.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(params.get('maxPrice') || '');
  const [minRating, setMinRating] = useState(params.get('minRating') || '');
  const [inStock, setInStock] = useState(params.get('inStock') === 'true');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    const params = {
      search: q || undefined,
      category: category || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      minRating: minRating || undefined,
      inStock: inStock ? 'true' : undefined,
      limit: 50
    };
    api
      .get('/products', { params })
      .then((res) => setItems(res.data.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <PageHeading title="Shop" subtitle="Handmade crochet pieces for every mood." />
      <motion.div
        className="card p-4 mb-6 border border-beige/40"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <input
            placeholder="Search..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1 min-w-[140px] rounded-xl border border-beige/80 bg-cream px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-beige/80 bg-cream px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            step="1"
            className="w-24 rounded-xl border border-beige/80 bg-cream px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <input
            type="number"
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            step="1"
            className="w-24 rounded-xl border border-beige/80 bg-cream px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="rounded-xl border border-beige/80 bg-cream px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="">Any rating</option>
            <option value="4">4+ stars</option>
            <option value="3">3+ stars</option>
          </select>
          <label className="flex items-center gap-2 text-deep/80 cursor-pointer">
            <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="rounded border-beige/80" />
            In stock only
          </label>
          <button className="btn px-5 py-2.5" onClick={fetchProducts}>Apply</button>
        </div>
      </motion.div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No products match your filters." actionLabel="Clear filters" actionTo="/shop" />
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
        >
          {items.map((p) => (
            <motion.div key={p._id} variants={{ initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
