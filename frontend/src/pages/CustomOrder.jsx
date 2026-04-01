import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CustomOrder() {
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [referenceImage, setReferenceImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => {
    api.get('/custom-orders/user').then((res) => setItems(res.data.items || [])).catch(() => {});
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const uploadImage = async () => {
    if (!imageFile) return;
    const form = new FormData();
    form.append('image', imageFile);
    const res = await api.post('/upload/gallery-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setReferenceImage(res.data.url);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/custom-orders', { description, budget: Number(budget), referenceImage });
      setDescription('');
      setBudget('');
      setReferenceImage('');
      setImageFile(null);
      setMessage('Custom order request submitted.');
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to submit request');
    }
  };

  if (!user) {
    return <div className="page-shell py-12 text-sm text-deep/70">Please login to request a custom order.</div>;
  }

  return (
    <div className="page-shell py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-deep">Custom Crochet Order</h1>
        <p className="mt-1 text-sm text-deep/70">Share your idea and we will craft it for you.</p>
        <form onSubmit={submit} className="card mt-6 grid gap-3 p-5">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your custom product"
            className="rounded-xl border border-beige/70 bg-cream/70 px-4 py-3"
            rows={4}
            required
          />
          <input
            type="number"
            min="0"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget (USD)"
            className="rounded-xl border border-beige/70 bg-cream/70 px-4 py-2.5"
            required
          />
          <div className="flex flex-wrap items-center gap-3">
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <button type="button" className="btn btn-secondary" onClick={uploadImage} disabled={!imageFile}>
              Upload Reference
            </button>
            {referenceImage && <span className="text-xs text-green-700">Image uploaded</span>}
          </div>
          {message && <p className="text-sm text-deep/80">{message}</p>}
          <button className="btn w-fit" type="submit">Submit Request</button>
        </form>

        <div className="mt-8">
          <h2 className="mb-3 text-xl font-semibold text-deep">My Requests</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item._id} className="card flex flex-col gap-2 p-4">
                <p className="text-sm text-deep">{item.description}</p>
                <div className="flex items-center justify-between text-xs text-deep/70">
                  <span>Budget: ${item.budget}</span>
                  <span className="capitalize">{item.status}</span>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-deep/60">No requests yet.</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
