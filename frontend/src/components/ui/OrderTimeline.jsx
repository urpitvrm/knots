import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { key: 'pending', label: 'Pending' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' }
];

export default function OrderTimeline({ status }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);
  const effectiveIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="flex items-center justify-between gap-1 py-2">
      {STEPS.map((step, i) => {
        const isCompleted = i < effectiveIndex || status === step.key;
        const isCurrent = status === step.key;
        return (
          <React.Fragment key={step.key}>
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition ${
                  isCompleted
                    ? 'bg-accent border-accent text-white'
                    : isCurrent
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-beige/60 text-deep/50 bg-cream'
                }`}
              >
                {isCompleted && i < effectiveIndex ? '✓' : i + 1}
              </div>
              <span
                className={`mt-1 text-xs hidden sm:block ${
                  isCurrent ? 'text-accent font-medium' : 'text-deep/70'
                }`}
              >
                {step.label}
              </span>
            </motion.div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 rounded transition ${
                  i < effectiveIndex ? 'bg-accent' : 'bg-beige/40'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
