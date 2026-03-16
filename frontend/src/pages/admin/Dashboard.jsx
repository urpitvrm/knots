import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import DashboardCards from '../../components/admin/DashboardCards';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/admin/stats')
      .then((res) => setStats(res.data.stats))
      .catch(() => setError('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1 text-deep font-display">Admin Dashboard</h1>
          <p className="text-sm text-deep/70">Overview of CozyLoops activity.</p>
        </div>
        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}
        {loading && <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>}
        {stats && !loading && (
          <>
            <DashboardCards stats={stats} />
            {stats.lowStockCount > 0 && (
              <motion.div
                className="mt-8 p-4 rounded-2xl border border-amber-200 bg-amber-50/80"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-deep mb-2">Low stock alerts</h2>
                <p className="text-sm text-deep/70 mb-3">Products with 5 or fewer units in stock.</p>
                <ul className="space-y-1.5">
                  {(stats.lowStockProducts || []).map((p) => (
                    <li key={p._id} className="flex justify-between text-sm">
                      <span className="text-deep/90">{p.name}</span>
                      <span className="font-medium text-amber-700">{p.stock} left</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
}
