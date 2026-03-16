import React from 'react';

const FULL = '★';
const EMPTY = '☆';

export function StarDisplay({ rating, max = 5, className = '' }) {
  const r = Math.min(max, Math.max(0, Number(rating) || 0));
  const full = Math.floor(r);
  const hasHalf = r % 1 >= 0.5;
  const empty = max - full - (hasHalf ? 1 : 0);
  return (
    <span className={`inline-flex text-amber-500 ${className}`} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: full }, (_, i) => <span key={`f-${i}`}>{FULL}</span>)}
      {hasHalf && <span className="opacity-80">★</span>}
      {Array.from({ length: empty }, (_, i) => <span key={`e-${i}`} className="text-deep/30">{EMPTY}</span>)}
    </span>
  );
}

export function StarInput({ value, onChange, max = 5, className = '' }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: max }, (_, i) => {
        const v = i + 1;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="text-2xl text-amber-500 hover:scale-110 transition focus:outline-none focus:ring-2 focus:ring-accent/40 rounded"
            aria-label={`${v} stars`}
          >
            {value >= v ? FULL : EMPTY}
          </button>
        );
      })}
    </div>
  );
}
