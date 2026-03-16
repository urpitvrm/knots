import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import OrdersTable from '../../components/admin/OrdersTable';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = () => {
    setLoading(true);
    setError('');
    api
      .get('/orders/admin')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      refresh();
    } catch {
      setError('Failed to update order status');
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Manage Orders</h1>
        <p className="text-sm text-deep/70">Review orders and update their status.</p>
      </div>
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="text-sm text-deep/70">Loading...</div>
      ) : (
        <OrdersTable orders={orders} onChangeStatus={updateStatus} />
      )}
    </AdminLayout>
  );
}
