import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-deep text-white hover:opacity-90',
  secondary: 'bg-sage text-deep hover:bg-sage/90',
  outline: 'border-2 border-deep/30 text-deep hover:bg-beige/40',
  ghost: 'text-deep/80 hover:bg-beige/30'
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-2.5 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  const cls = `${base} ${variants[variant] || variants.primary} ${className}`.trim();

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      className={cls}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </motion.button>
  );
}
