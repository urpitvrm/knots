import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import { getImageUrl } from '../../utils/imageUrl';

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    materials: '',
    timeToMake: '',
    story: '',
    images: []
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  const uploadImages = async () => {
    if (!imageFiles.length) return;
    const data = new FormData();
    imageFiles.forEach((file) => data.append('images', file));
    const res = await api.post('/upload/product-images', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const urls = res.data.urls || [];
    setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
    setImageFiles([]);
  };

  const removeImageAt = (index) => {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/products', {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock)
      });
      setMessage('Product created!');
      setForm({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: 0,
        materials: '',
        timeToMake: '',
        story: '',
        images: []
      });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create');
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
      {message && <div className="mb-4">{message}</div>}
      <form onSubmit={onSubmit} className="card p-6 grid gap-3">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-xl px-4 py-3"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded-xl px-4 py-3"
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded-xl px-4 py-3"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border rounded-xl px-4 py-3"
        >
          <option value="">Choose category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border rounded-xl px-4 py-3"
        />
        <input
          placeholder="Materials (e.g. Cotton yarn, wooden beads)"
          value={form.materials}
          onChange={(e) => setForm({ ...form, materials: e.target.value })}
          className="border rounded-xl px-4 py-3"
        />
        <input
          placeholder="Time to make (e.g. 2-3 days)"
          value={form.timeToMake}
          onChange={(e) => setForm({ ...form, timeToMake: e.target.value })}
          className="border rounded-xl px-4 py-3"
        />
        <textarea
          placeholder="Story"
          value={form.story}
          onChange={(e) => setForm({ ...form, story: e.target.value })}
          className="border rounded-xl px-4 py-3"
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-600">Product images (select multiple, then upload)</span>
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
            />
            <button type="button" className="btn btn-secondary" onClick={uploadImages} disabled={!imageFiles.length}>
              Upload to gallery
            </button>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {form.images.map((url, idx) => (
            <div key={`${url}-${idx}`} className="relative group">
              <img src={getImageUrl(url)} alt="" className="w-20 h-20 rounded-xl object-cover" />
              <button
                type="button"
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white text-xs opacity-90 hover:opacity-100"
                onClick={() => removeImageAt(idx)}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button className="btn w-fit">Create</button>
      </form>
    </AdminLayout>
  );
}
