import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NewsletterForm from '../components/NewsletterForm';
import { staggerItem } from '../utils/motion';
import { useAuth } from '../context/AuthContext';

const MotionLink = motion(Link);

const heroStagger = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.12, delayChildren: 0.06 }
  }
};

const heroLines = [
  'Handmade Crochet,',
  { accent: 'Made with Love' }
];

const floatSpring = { type: 'spring', stiffness: 40, damping: 12 };

function HomeAnimatedBackdrop({ softLoop }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-cream" />
      <motion.div
        className="absolute inset-0 opacity-[0.85]"
        initial={false}
        animate={
          softLoop
            ? {
                backgroundPosition: ['0% 0%', '100% 50%', '50% 100%', '0% 0%'],
                opacity: [0.75, 0.95, 0.8, 0.75]
              }
            : {}
        }
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `
            radial-gradient(ellipse 90% 70% at 15% 25%, rgba(238,201,210,0.45), transparent 55%),
            radial-gradient(ellipse 80% 60% at 85% 15%, rgba(233,167,176,0.35), transparent 50%),
            radial-gradient(ellipse 70% 80% at 75% 85%, rgba(201,216,197,0.5), transparent 55%),
            radial-gradient(ellipse 60% 50% at 10% 90%, rgba(234,223,214,0.55), transparent 45%)
          `,
          backgroundSize: '140% 140%'
        }}
      />
      <motion.div
        className="absolute inset-0 mix-blend-soft-light opacity-40"
        animate={
          softLoop
            ? { rotate: [0, 360] }
            : {}
        }
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        style={{
          background:
            'conic-gradient(from 90deg at 50% 50%, transparent, rgba(233,167,176,0.12), transparent, rgba(201,216,197,0.15), transparent)'
        }}
      />
      <motion.div
        className="absolute -top-[20%] -right-[10%] h-[55vmin] w-[55vmin] rounded-full bg-accent/20 blur-3xl"
        animate={
          softLoop
            ? { x: [0, -30, 20, 0], y: [0, 40, -15, 0], scale: [1, 1.08, 1.02, 1] }
            : {}
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-[15%] -left-[15%] h-[50vmin] w-[50vmin] rounded-full bg-sage/30 blur-3xl"
        animate={
          softLoop
            ? { x: [0, 35, -20, 0], y: [0, -30, 25, 0], scale: [1, 1.06, 1, 1] }
            : {}
        }
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[40%] top-[30%] h-[35vmin] w-[35vmin] rounded-full bg-blush/25 blur-3xl"
        animate={
          softLoop
            ? { x: [0, -40, 25, 0], y: [0, 35, -20, 0] }
            : {}
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    api
      .get('/products', { params: { limit: 8, sort: 'createdAt:desc' } })
      .then((res) => setItems(res.data.items))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get('/products/recent/user').then((res) => setRecentItems(res.data.items || [])).catch(() => {});
  }, [user]);

  const softLoop = !prefersReducedMotion;

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden">
      <HomeAnimatedBackdrop softLoop={softLoop} />
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <motion.div
            variants={heroStagger}
            initial="initial"
            animate="animate"
            className="space-y-2"
          >
            <motion.div variants={staggerItem} className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-blush/20 px-3 py-1 text-xs font-medium text-deep/80">
              <motion.span
                className="h-2 w-2 rounded-full bg-accent"
                animate={softLoop ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
              New drops weekly
            </motion.div>
            <div className="font-display text-4xl md:text-5xl lg:text-[3.25rem] leading-tight text-deep">
              {heroLines.map((line, i) =>
                typeof line === 'string' ? (
                  <motion.h1 key={line} variants={staggerItem} className="block">
                    {line}
                  </motion.h1>
                ) : (
                  <motion.h1 key={line.accent} variants={staggerItem} className="block text-accent">
                    {line.accent}
                  </motion.h1>
                )
              )}
            </div>
            <motion.p variants={staggerItem} className="text-deep/70 max-w-md pt-2 text-base md:text-lg">
              Discover cozy bags, delicate flowers, and adorable plushies crafted with care.
            </motion.p>
            <motion.div variants={staggerItem} className="flex flex-wrap gap-3 pt-4">
              <MotionLink
                className="btn"
                to="/shop"
                whileHover={{ scale: 1.04, boxShadow: '0 12px 28px rgba(55,65,81,0.18)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                Shop Now
              </MotionLink>
              <MotionLink
                className="btn btn-secondary"
                to="/about"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                Learn More
              </MotionLink>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -1 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.15 }}
            className="relative mx-auto w-full max-w-md md:max-w-none"
          >
            <div className="relative h-72 sm:h-80 md:h-[22rem] rounded-3xl border border-beige/70 bg-gradient-to-br from-blush/25 via-cream to-sage/30 shadow-soft overflow-hidden">
              <motion.div
                className="absolute inset-0 opacity-[0.35]"
                style={{ originX: 0.5, originY: 0.5 }}
                animate={softLoop ? { rotate: 360 } : {}}
                transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute inset-[-40%] bg-[conic-gradient(from_180deg,transparent,rgba(233,167,176,0.25),transparent,rgba(201,216,197,0.3),transparent)]" />
              </motion.div>

              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-white/40"
                  style={{
                    width: `${45 + i * 18}%`,
                    height: `${45 + i * 18}%`,
                    left: '50%',
                    top: '50%',
                    marginLeft: `-${22.5 + i * 9}%`,
                    marginTop: `-${22.5 + i * 9}%`
                  }}
                  animate={
                    softLoop
                      ? { rotate: i % 2 === 0 ? [0, 8, 0] : [0, -8, 0], scale: [1, 1.02, 1] }
                      : {}
                  }
                  transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                />
              ))}

              <motion.div
                className="absolute -top-8 -right-4 h-36 w-36 rounded-full bg-accent/30 blur-2xl"
                animate={softLoop ? { x: [0, 12, 0], y: [0, 18, 0] } : {}}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-sage/45 blur-2xl"
                animate={softLoop ? { x: [0, -16, 0], y: [0, -12, 0] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute top-1/4 left-6 h-16 w-16 rounded-full bg-blush/50 blur-xl"
                animate={softLoop ? { y: [0, 20, 0], opacity: [0.5, 0.85, 0.5] } : {}}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />

              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-accent/60"
                  style={{
                    left: `${15 + (i * 14) % 70}%`,
                    top: `${20 + (i * 11) % 55}%`
                  }}
                  animate={softLoop ? { y: [0, -6, 0], opacity: [0.4, 1, 0.4] } : {}}
                  transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                />
              ))}

              <svg
                className="pointer-events-none absolute right-4 top-8 h-24 w-24 text-accent/40 md:h-28 md:w-28"
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden
              >
                <motion.path
                  d="M50 10 C30 10 15 28 15 48 C15 72 35 88 50 88 C65 88 85 72 85 48 C85 28 70 22 50 28 C38 32 28 42 28 55 C28 68 40 78 52 75"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: 'easeInOut', delay: 0.5 }}
                />
              </svg>

              <motion.div
                className="absolute left-1/2 top-1/2 w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/70 bg-white/75 p-5 shadow-soft backdrop-blur-md md:p-7"
                animate={softLoop ? { y: [0, -10, 0] } : {}}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              >
                <motion.div
                  className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/20 via-transparent to-sage/25 opacity-0"
                  animate={softLoop ? { opacity: [0, 0.5, 0] } : {}}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <div className="relative">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">CozyLoops Collection</p>
                  <h3 className="mt-2 font-display text-xl text-deep md:text-2xl">Soft, handmade, timeless.</h3>
                  <p className="mt-2 text-sm text-deep/65">
                    Crafted pieces that bring warmth to everyday moments.
                  </p>
                  <motion.div
                    className="mt-4 flex gap-2"
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.15, delayChildren: 0.8 } } }}
                  >
                    {['Bags', 'Plush', 'Bloom'].map((tag) => (
                      <motion.span
                        key={tag}
                        variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                        className="rounded-full bg-beige/80 px-3 py-1 text-xs font-medium text-deep/80"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        className="relative z-10 max-w-6xl mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={floatSpring}
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            className="text-2xl font-semibold font-display text-deep"
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            Featured
          </motion.h2>
          <MotionLink
            to="/shop"
            className="text-accent font-medium"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            View all →
          </MotionLink>
        </div>
        {loading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-40px' }}
            variants={{
              initial: {},
              animate: { transition: { staggerChildren: 0.08 } }
            }}
          >
            {items.map((p) => (
              <motion.div
                key={p._id}
                variants={{ initial: { opacity: 0, y: 22, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 } }}
                transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {recentItems.length > 0 && (
        <section className="relative z-10 max-w-6xl mx-auto px-4 pb-8">
          <h2 className="mb-5 text-2xl font-semibold font-display text-deep">Recently Viewed</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recentItems.slice(0, 4).map((p) => (
              <ProductCard key={`recent-${p._id}`} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="relative z-10 overflow-hidden bg-beige/25 backdrop-blur-[2px]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.h2
            className="text-2xl font-semibold mb-6 font-display text-deep"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={floatSpring}
          >
            Categories
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.12 } }
            }}
          >
            {['Bags', 'Flowers', 'Plushies'].map((c) => (
              <motion.div
                key={c}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
              >
                <Link
                  to={`/shop?category=${c}`}
                  className="card p-6 block h-full hover:border-accent/30 transition-colors"
                >
                  <h3 className="text-xl font-semibold">{c}</h3>
                  <p className="text-deep/70">Explore handmade {c.toLowerCase()}.</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        <motion.h2
          className="text-2xl font-semibold mb-6 font-display text-deep"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          What customers say
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.15 } }
          }}
        >
          {[
            { name: 'Amelia', text: 'Beautiful craftsmanship and quick shipping!' },
            { name: 'Sofia', text: 'The plushie is even cuter in person.' },
            { name: 'Liam', text: 'Quality bag with a cozy vibe.' }
          ].map((t) => (
            <motion.div
              key={t.name}
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
              className="card p-6"
            >
              <p className="italic">“{t.text}”</p>
              <p className="mt-3 font-semibold">{t.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section
        className="relative z-10 bg-beige/25 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-6 text-deep font-display">Stay in the loop</h2>
          <NewsletterForm />
        </div>
      </motion.section>
    </div>
  );
}
