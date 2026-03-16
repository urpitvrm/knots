import React from 'react';

export default function DashboardCards({ stats }) {
  const cards = [
    { label: 'Total Products', value: stats?.products ?? 0 },
    { label: 'Total Orders', value: stats?.orders ?? 0 },
    { label: 'Total Users', value: stats?.users ?? 0 },
    {
      label: 'Revenue',
      value: stats?.revenue != null ? `$${stats.revenue.toFixed(2)}` : '$0.00'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="card p-5 bg-cream border border-beige/60 rounded-2xl shadow-soft hover:-translate-y-0.5 hover:shadow-lg transition"
        >
          <div className="text-xs uppercase tracking-wide text-deep/60 mb-2">{c.label}</div>
          <div className="text-2xl font-semibold text-deep">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

