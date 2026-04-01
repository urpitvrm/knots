import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

export default function ManageBundles() {
  const [products, setProducts] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [form, setForm] = useState({ name: '', products: [], discountPercentage: 10, active: true });
  const [error, setError] = useState('');

  const load = () => {
    api.get('/bundles').then((res) => setBundles(res.data.items || [])).catch(() => {});
  };

  useEffect(() => {
    api.get('/products', { params: { limit: 100 } }).then((res) => setProducts(res.data.items || []));
    load();
  }, []);

  const createBundle = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/bundles', form);
      setForm({ name: '', products: [], discountPercentage: 10, active: true });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bundle');
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl text-deep">Bundle Deals</h1>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <form onSubmit={createBundle} className="card mt-4 grid gap-3 p-4">
        <input
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="rounded-xl border border-beige/70 px-4 py-2.5"
          placeholder="Bundle name"
        />
        <select
          multiple
          value={form.products}
          onChange={(e) => setForm((prev) => ({ ...prev, products: Array.from(e.target.selectedOptions).map((o) => o.value) }))}
          className="min-h-40 rounded-xl border border-beige/70 px-3 py-2"
        >
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          max="90"
          value={form.discountPercentage}
          onChange={(e) => setForm((prev) => ({ ...prev, discountPercentage: Number(e.target.value) }))}
          className="rounded-xl border border-beige/70 px-4 py-2.5"
          placeholder="Discount %"
        />
        <button className="btn w-fit" type="submit">Create Bundle</button>
      </form>
      <div className="mt-5 space-y-3">
        {bundles.map((bundle) => (
          <div key={bundle._id} className="card p-4">
            <p className="font-medium text-deep">{bundle.name}</p>
            <p className="text-xs text-deep/70">{bundle.discountPercentage}% off</p>
            <p className="text-xs text-deep/70">{(bundle.products || []).map((p) => p.name).join(', ')}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
