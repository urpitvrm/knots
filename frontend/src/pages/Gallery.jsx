import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Gallery() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const load = () => {
    api.get('/gallery').then((res) => setItems(res.data.items || [])).catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const upload = async () => {
    if (!imageFile) return;
    const form = new FormData();
    form.append('image', imageFile);
    const res = await api.post('/upload/gallery-image', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    setImageUrl(res.data.url);
  };

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/gallery', { image: imageUrl, caption });
    setCaption('');
    setImageFile(null);
    setImageUrl('');
    load();
  };

  const like = async (id) => {
    if (!user) return;
    await api.post(`/gallery/${id}/like`);
    load();
  };

  return (
    <div className="page-shell py-10">
      <h1 className="font-display text-3xl text-deep">Community Gallery</h1>
      {user && (
        <form onSubmit={submit} className="card mt-5 grid gap-3 p-4">
          <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" className="rounded-xl border border-beige/70 px-3 py-2.5" />
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            <button type="button" className="btn btn-secondary" onClick={upload} disabled={!imageFile}>Upload</button>
            <button type="submit" className="btn" disabled={!imageUrl}>Post</button>
          </div>
        </form>
      )}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="card overflow-hidden">
            <img src={item.image} alt="" className="h-56 w-full object-cover" />
            <div className="p-3">
              <p className="text-sm text-deep">{item.caption}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-deep/70">
                <span>By {item.userId?.name || 'User'}</span>
                <button type="button" onClick={() => like(item._id)} className="rounded-lg bg-beige/50 px-2 py-1">
                  Like ({item.likes?.length || 0})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
