import React from 'react';
import { motion } from 'framer-motion';

export default function PageHeading({ title, subtitle, action }) {
  return (
    <motion.div
      className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <h1 className="text-3xl font-semibold text-deep font-display">{title}</h1>
        {subtitle && <p className="mt-1 text-deep/70">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </motion.div>
  );
}
