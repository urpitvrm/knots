import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function EmptyState({ title, message, actionLabel, actionTo }) {
  return (
    <motion.div
      className="text-center py-12 px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="text-deep/70 text-lg">{title}</p>
      {message && <p className="mt-2 text-deep/60">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn mt-6 inline-block">
          {actionLabel}
        </Link>
      )}
    </motion.div>
  );
}
