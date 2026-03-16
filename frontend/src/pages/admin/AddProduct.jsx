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
    images: []
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  const uploadImage = async () => {
    if (!imageFile) return;
    const data = new FormData();
    data.append('image', imageFile);
    const res = await api.post('/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setForm((f) => ({ ...f, images: [...f.images, res.data.url] }));
    setImageFile(null);
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
      setForm({ name: '', description: '', price: '', category: '', stock: 0, images: [] });
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

        <div className="flex items-center gap-3">
          <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
          <button type="button" className="btn btn-secondary" onClick={uploadImage}>
            Upload image
          </button>
        </div>
        <div className="flex gap-3">
          {form.images.map((url) => (
            <img key={url} src={getImageUrl(url)} alt="" className="w-20 h-20 rounded-xl object-cover" />
          ))}
        </div>

        <button className="btn w-fit">Create</button>
      </form>
    </AdminLayout>
  );
}
