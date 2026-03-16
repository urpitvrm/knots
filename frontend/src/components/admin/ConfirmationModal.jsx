import React from 'react';

export default function ConfirmationModal({ open, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="card w-full max-w-sm p-6 bg-cream shadow-soft rounded-2xl">
        {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
        {message && <p className="text-sm text-deep/80 mb-4">{message}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-xl border border-beige/80 text-deep/80 hover:bg-beige/40 transition"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 transition"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

