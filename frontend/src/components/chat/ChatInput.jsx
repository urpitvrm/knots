import React, { useState } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-t border-beige/60 bg-white p-2 sm:p-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 rounded-xl border border-beige px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        disabled={disabled}
      />
      <button
        type="submit"
        className="rounded-xl bg-accent px-3 py-2 text-xs font-medium text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
        disabled={disabled || !value.trim()}
      >
        Send
      </button>
    </form>
  );
}
