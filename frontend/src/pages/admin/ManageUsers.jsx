import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import UsersTable from '../../components/admin/UsersTable';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    api
      .get('/admin/users')
      .then((res) => setUsers(res.data.items))
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <p className="text-sm text-deep/70">View all registered customers and admins.</p>
      </div>
      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="text-sm text-deep/70">Loading...</div>
      ) : (
        <UsersTable users={users} />
      )}
    </AdminLayout>
  );
}
