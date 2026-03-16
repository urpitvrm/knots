import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';

export default function ProductsTable({ items, onDelete }) {
  if (!items.length) {
    return <div className="text-sm text-deep/70">No products found.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-beige/60 bg-cream shadow-soft">
      <table className="min-w-full text-sm">
        <thead className="bg-beige/40 text-deep/70">
          <tr>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Category</th>
            <th className="px-4 py-3 text-right">Price</th>
            <th className="px-4 py-3 text-right">Stock</th>
            <th className="px-4 py-3 text-left">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p._id} className="border-t border-beige/40 hover:bg-beige/20">
              <td className="px-4 py-3">
                <img
                  src={getImageUrl(p.images?.[0]) || 'https://via.placeholder.com/80'}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              </td>
              <td className="px-4 py-3 font-medium text-deep">{p.name}</td>
              <td className="px-4 py-3 text-deep/80">{p.category?.name || '—'}</td>
              <td className="px-4 py-3 text-right text-deep/90">${p.price.toFixed(2)}</td>
              <td className="px-4 py-3 text-right">{p.stock}</td>
              <td className="px-4 py-3 text-deep/70">
                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/admin/products/${p._id}/edit`}
                    className="px-3 py-1.5 rounded-xl border border-beige/80 text-xs hover:bg-beige/40 transition"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(p)}
                    className="px-3 py-1.5 rounded-xl text-xs text-red-600 hover:bg-red-50 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

