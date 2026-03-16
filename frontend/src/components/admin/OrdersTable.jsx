import React from 'react';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersTable({ orders, onChangeStatus }) {
  if (!orders.length) {
    return <div className="text-sm text-deep/70">No orders yet.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-beige/60 bg-cream shadow-soft">
      <table className="min-w-full text-sm">
        <thead className="bg-beige/40 text-deep/70">
          <tr>
            <th className="px-4 py-3 text-left">Order ID</th>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-t border-beige/40 hover:bg-beige/20">
              <td className="px-4 py-3 font-mono text-xs">#{o._id.slice(-6)}</td>
              <td className="px-4 py-3 text-deep/80">{o.user?.name || 'Guest'}</td>
              <td className="px-4 py-3 text-right text-deep/90">${o.totalPrice.toFixed(2)}</td>
              <td className="px-4 py-3">
                <select
                  value={o.orderStatus}
                  onChange={(e) => onChangeStatus(o._id, e.target.value)}
                  className="border border-beige/80 rounded-xl px-3 py-1.5 bg-white text-xs"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-deep/70">
                {o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

