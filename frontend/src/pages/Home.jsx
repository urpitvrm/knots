import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NewsletterForm from '../components/NewsletterForm';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/products', { params: { limit: 8, sort: 'createdAt:desc' } })
      .then((res) => setItems(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-cream">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl mb-4">
              Handmade Crochet, <span className="text-accent">Made with Love</span>
            </h1>
            <p className="text-deep/70 mb-6">
              Discover cozy bags, delicate flowers, and adorable plushies crafted with care.
            </p>
            <div className="flex gap-4">
              <Link className="btn" to="/shop">
                Shop Now
              </Link>
              <Link className="btn btn-secondary" to="/about">
                Learn More
              </Link>
            </div>
          </motion.div>
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format"
            alt="Crochet"
            className="rounded-2xl shadow-soft"
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured</h2>
          <Link to="/shop" className="text-accent">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.06 } } }}
          >
            {items.map((p) => (
              <motion.div key={p._id} variants={{ initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <section className="bg-beige/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Bags', 'Flowers', 'Plushies'].map((c) => (
              <Link to={`/shop?category=${c}`} key={c} className="card p-6">
                <h3 className="text-xl font-semibold">{c}</h3>
                <p className="text-deep/70">Explore handmade {c.toLowerCase()}.</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">What customers say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Amelia', text: 'Beautiful craftsmanship and quick shipping!' },
            { name: 'Sofia', text: 'The plushie is even cuter in person.' },
            { name: 'Liam', text: 'Quality bag with a cozy vibe.' }
          ].map((t) => (
            <div key={t.name} className="card p-6">
              <p className="italic">“{t.text}”</p>
              <p className="mt-3 font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-beige/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6 text-deep">Stay in the loop</h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
