import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

export default function ManageCustomOrders() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/custom-orders/admin').then((res) => setItems(res.data.items || [])).catch(() => setError('Failed to load custom orders'));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/custom-orders/${id}/status`, { status });
      load();
    } catch {
      setError('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl text-deep">Manage Custom Orders</h1>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item._id} className="card p-4">
            <p className="text-sm font-medium text-deep">{item.userId?.name} ({item.userId?.email})</p>
            <p className="mt-2 text-sm text-deep/80">{item.description}</p>
            <p className="mt-1 text-xs text-deep/70">Budget: ${item.budget}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateStatus(item._id, status)}
                  className={`rounded-lg px-3 py-1.5 text-xs ${item.status === status ? 'bg-accent text-white' : 'bg-beige/50 text-deep'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
