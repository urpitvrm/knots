import React from 'react';
import { motion } from 'framer-motion';

export default function OrderCardSkeleton() {
  return (
    <motion.div
      className="rounded-2xl border border-beige/40 bg-white p-4 shadow-soft"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.2, repeatType: 'reverse' }}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 bg-beige/50 rounded w-28" />
          <div className="h-4 bg-beige/40 rounded w-24" />
        </div>
        <div className="h-6 bg-beige/50 rounded w-16" />
      </div>
      <div className="mt-4 pt-4 border-t border-beige/40 flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-8 bg-beige/30 rounded-full" />
        ))}
      </div>
    </motion.div>
  );
}
