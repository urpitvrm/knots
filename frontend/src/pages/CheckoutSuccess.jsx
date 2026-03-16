import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('Processing your payment...');
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('Missing payment session.');
      setStatus('');
      return;
    }

    api
      .get('/payments/confirm', { params: { session_id: sessionId } })
      .then(() => {
        clearCart();
        setStatus('Payment successful! Redirecting to your orders...');
        setTimeout(() => navigate('/orders'), 1500);
      })
      .catch(() => {
        setError('Unable to confirm payment. If you were charged, please contact support.');
        setStatus('');
      });
  }, [searchParams, clearCart, navigate]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold mb-4 text-deep font-display">Checkout</h1>
        {status && <p className="text-deep/80 mb-2">{status}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </motion.div>
    </div>
  );
}

