import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', discountPercentage: '', expiryDate: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = () => {
    api.get('/coupons').then((res) => setCoupons(res.data.coupons || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      await api.post('/coupons', {
        code: form.code.trim(),
        discountPercentage: Number(form.discountPercentage),
        expiryDate: form.expiryDate
      });
      setForm({ code: '', discountPercentage: '', expiryDate: '' });
      setMessage('Coupon created.');
      fetchCoupons();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const removeCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    await api.delete(`/coupons/${id}`);
    fetchCoupons();
  };

  return (
    <AdminLayout>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-deep font-display">Manage Coupons</h1>
          <p className="text-sm text-deep/70">Create discount codes for checkout.</p>
        </div>

        <Card className="p-6 mb-6 border border-beige/40">
          <h2 className="font-semibold text-deep mb-4">Create coupon</h2>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-3 items-end">
            <Input
              placeholder="Code (e.g. SAVE10)"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              required
            />
            <Input
              type="number"
              placeholder="Discount %"
              min="1"
              max="100"
              value={form.discountPercentage}
              onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
              required
            />
            <Input
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
              required
            />
            <Button type="submit" loading={submitting} disabled={submitting}>
              Create
            </Button>
          </form>
          {message && <p className={`mt-2 text-sm ${message.includes('Failed') ? 'text-red-600' : 'text-green-700'}`}>{message}</p>}
        </Card>

        <h2 className="font-semibold text-deep mb-3">Existing coupons</h2>
        {loading ? (
          <p className="text-deep/60">Loading...</p>
        ) : coupons.length === 0 ? (
          <p className="text-deep/60">No coupons yet.</p>
        ) : (
          <ul className="space-y-2">
            {coupons.map((c) => (
              <li key={c._id}>
                <Card className="p-4 border border-beige/40 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-mono font-semibold text-deep">{c.code}</span>
                    <span className="text-deep/70 ml-2">{c.discountPercentage}% off</span>
                    <span className="text-deep/50 text-sm ml-2">Expires {new Date(c.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCoupon(c._id)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </AdminLayout>
  );
}
