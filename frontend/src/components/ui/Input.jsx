import React from 'react';

export default function Input({
  label,
  error,
  className = '',
  ...props
}) {
  const inputCls =
    'w-full rounded-xl border border-beige/80 bg-cream px-4 py-3 text-deep placeholder:text-deep/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition';
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-deep/80 mb-1.5">{label}</label>
      )}
      <input className={inputCls} {...props} />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
