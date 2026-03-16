import React from 'react';
import { motion } from 'framer-motion';

export default function ProductCardSkeleton() {
  return (
    <motion.div
      className="rounded-2xl bg-white border border-beige/40 overflow-hidden shadow-soft"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.2, repeatType: 'reverse' }}
    >
      <div className="w-full h-56 bg-beige/40 rounded-t-2xl" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-beige/50 rounded w-3/4" />
        <div className="h-4 bg-beige/40 rounded w-full" />
        <div className="h-4 bg-beige/40 rounded w-1/2" />
        <div className="flex justify-between mt-3">
          <div className="h-6 bg-beige/50 rounded w-16" />
          <div className="h-8 bg-beige/40 rounded w-14" />
        </div>
      </div>
    </motion.div>
  );
}
