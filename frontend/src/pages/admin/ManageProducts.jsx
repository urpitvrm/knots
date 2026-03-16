import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import ProductsTable from '../../components/admin/ProductsTable';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);

  const refresh = () => {
    setLoading(true);
    setError('');
    api
      .get('/products', {
        params: {
          search: search || undefined,
          category: categoryFilter || undefined,
          limit: 100,
          sort: 'createdAt:desc'
        }
      })
      .then((res) => setItems(res.data.items))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteConfirm = async () => {
    if (!pendingDelete) return;
    try {
      await api.delete(`/products/${pendingDelete._id}`);
      setPendingDelete(null);
      refresh();
    } catch {
      setError('Failed to delete product');
      setPendingDelete(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    refresh();
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Manage Products</h1>
          <p className="text-sm text-deep/70">Search, filter, create and edit products.</p>
        </div>
        <Link to="/admin/products/add" className="btn">
          Add Product
        </Link>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="card mb-4 p-4 flex flex-col md:flex-row gap-3 md:items-center"
      >
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-2 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border rounded-xl px-4 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-secondary text-sm px-4 py-2">
          Apply
        </button>
      </form>

      {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
      {loading ? (
        <div className="text-sm text-deep/70">Loading...</div>
      ) : (
        <ProductsTable items={items} onDelete={(p) => setPendingDelete(p)} />
      )}

      <ConfirmationModal
        open={!!pendingDelete}
        title="Delete product"
        message={
          pendingDelete
            ? `Are you sure you want to delete “${pendingDelete.name}”? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDelete(null)}
      />
    </AdminLayout>
  );
}
