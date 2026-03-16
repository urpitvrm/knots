import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import { StarDisplay, StarInput } from '../components/ui/StarRating';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data.item));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    api.get(`/products/${id}/reviews`).then((res) => {
      setReviews(res.data.reviews || []);
      setAverageRating(res.data.averageRating ?? 0);
      setReviewCount(res.data.reviewCount ?? 0);
    }).catch(() => {});
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: reviewRating, text: reviewText });
      const res = await api.get(`/products/${id}/reviews`);
      setReviews(res.data.reviews || []);
      setAverageRating(res.data.averageRating ?? 0);
      setReviewCount(res.data.reviewCount ?? 0);
      setReviewText('');
      setReviewRating(5);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 flex justify-center min-h-[40vh] items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <img
            src={getImageUrl(product.images?.[0]) || 'https://via.placeholder.com/600x600?text=CozyLoops'}
            alt={product.name}
            className="rounded-2xl shadow-soft w-full object-cover"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-semibold text-deep font-display">{product.name}</h1>
          {averageRating > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarDisplay rating={averageRating} />
              <span className="text-deep/70 text-sm">{averageRating.toFixed(1)} ({reviewCount} reviews)</span>
            </div>
          )}
          <p className="text-deep/70 mt-2 leading-relaxed">{product.description}</p>
          <div className="mt-4 text-2xl font-bold text-deep">${product.price.toFixed(2)}</div>
          {product.stock <= 0 && <p className="mt-2 text-red-600 text-sm">Out of stock</p>}
          <div className="mt-6 flex items-center gap-4">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="border border-beige/80 rounded-xl px-4 py-2 w-24 bg-cream focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <Button onClick={() => addToCart(product, qty)} disabled={product.stock <= 0}>Add to Cart</Button>
          </div>
        </motion.div>
      </div>

      <motion.section className="mt-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <h2 className="text-xl font-semibold text-deep mb-4">Reviews</h2>
        {user && (
          <Card className="p-6 mb-6 border border-beige/40">
            <form onSubmit={submitReview} className="grid gap-3">
              <div>
                <label className="block text-sm text-deep/70 mb-1">Your rating</label>
                <StarInput value={reviewRating} onChange={setReviewRating} />
              </div>
              <textarea
                placeholder="Your review (optional)"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-beige/80 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              {reviewError && <p className="text-red-600 text-sm">{reviewError}</p>}
              <Button type="submit" loading={reviewSubmitting} disabled={reviewSubmitting}>Submit review</Button>
            </form>
          </Card>
        )}
        {reviews.length === 0 ? (
          <p className="text-deep/60">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r._id}>
                <Card className="p-4 border border-beige/40">
                  <div className="flex items-center justify-between">
                    <StarDisplay rating={r.rating} />
                    <span className="text-sm text-deep/70">{r.user?.name || 'Guest'}</span>
                  </div>
                  {r.text && <p className="mt-2 text-deep/80">{r.text}</p>}
                  <p className="mt-1 text-xs text-deep/50">{new Date(r.createdAt).toLocaleDateString()}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </motion.section>
    </div>
  );
}
