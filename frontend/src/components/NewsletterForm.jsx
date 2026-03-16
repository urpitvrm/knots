import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setStatus('');
    try {
      await api.post('/newsletter/subscribe', { email: email.trim() });
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="card p-6 flex flex-col md:flex-row gap-4 items-center border border-beige/60"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 w-full rounded-xl border border-beige/80 bg-cream px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/40"
        required
        disabled={loading}
      />
      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'success' && <p className="text-green-700 text-sm w-full md:w-auto">Thanks for subscribing!</p>}
      {status === 'error' && <p className="text-red-600 text-sm w-full md:w-auto">Something went wrong. Try again.</p>}
    </motion.form>
  );
}
