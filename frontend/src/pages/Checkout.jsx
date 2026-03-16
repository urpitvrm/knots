import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Checkout() {
  const { items, total } = useCart();
  const { user } = useAuth();
  const [shipping, setShipping] = useState({
    fullName: user?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const discountAmount = appliedCoupon
    ? (total * appliedCoupon.discountPercentage) / 100
    : 0;
  const totalAfterDiscount = total - discountAmount;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const res = await api.get('/coupons/validate', { params: { code: couponCode.trim() } });
      setAppliedCoupon(res.data.coupon);
    } catch {
      setCouponError('Invalid or expired coupon');
    }
  };

  const placeOrder = async () => {
    setError('');
    setLoading(true);
    try {
      const products = items.map(({ product, quantity }) => ({ product: product._id, quantity }));
      const baseUrl = window.location.origin;
      const res = await api.post('/payments/create-checkout-session', {
        products,
        shippingAddress: shipping,
        successUrl: `${baseUrl}/checkout/success`,
        cancelUrl: `${baseUrl}/checkout`,
        couponCode: appliedCoupon ? appliedCoupon.code : couponCode.trim() || undefined
      });
      window.location.href = res.data.url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start payment');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-3xl font-semibold mb-6 text-deep font-display">Checkout</h1>
        {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border border-beige/40">
            <h2 className="font-semibold text-deep mb-4">Shipping address</h2>
            <div className="grid gap-3">
              {Object.keys(shipping).map((k) => (
                <Input
                  key={k}
                  placeholder={k}
                  value={shipping[k]}
                  onChange={(e) => setShipping({ ...shipping, [k]: e.target.value })}
                />
              ))}
            </div>
          </Card>
          <Card className="p-6 h-fit border border-beige/40">
            <div className="flex gap-2 mb-3">
              <input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                className="flex-1 rounded-xl border border-beige/80 bg-cream px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                disabled={!!appliedCoupon}
              />
              <Button type="button" variant="secondary" onClick={applyCoupon} disabled={!!appliedCoupon || !couponCode.trim()}>
                Apply
              </Button>
            </div>
            {couponError && <p className="text-red-600 text-sm mb-2">{couponError}</p>}
            {appliedCoupon && <p className="text-green-700 text-sm mb-2">{appliedCoupon.code} applied ({appliedCoupon.discountPercentage}% off)</p>}
            <div className="flex items-center justify-between mb-1">
              <span className="text-deep/80">Subtotal</span>
              <span className="font-medium text-deep">${total.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex items-center justify-between mb-1 text-green-700">
                <span>Discount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-beige/60">
              <span className="text-deep/80 font-medium">Total</span>
              <span className="font-semibold text-deep">${totalAfterDiscount.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-4" disabled={loading} onClick={placeOrder} loading={loading}>
              {loading ? 'Redirecting to Stripe...' : 'Pay with card'}
            </Button>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
