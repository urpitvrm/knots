import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, ...props }) {
  const base =
    'rounded-2xl bg-white shadow-soft border border-beige/40 overflow-hidden';
  const cls = `${base} ${hover ? 'transition hover:shadow-lg hover:-translate-y-0.5' : ''} ${className}`.trim();

  const Comp = motion.div;
  return (
    <Comp
      className={cls}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </Comp>
  );
}
