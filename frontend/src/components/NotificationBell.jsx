import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { items, unreadCount, markAllRead } = useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-xl border border-beige/70 bg-white px-3 py-2 text-sm text-deep"
        aria-label="Notifications"
      >
        Bell
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-accent px-1.5 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-beige/70 bg-white p-3 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-deep">Notifications</p>
            <button
              type="button"
              onClick={markAllRead}
              className="text-xs text-accent hover:underline"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-xs text-deep/60">No notifications yet.</p>
            ) : (
              items.map((n) => (
                <div key={n._id} className={`rounded-xl border p-2 ${n.read ? 'border-beige/60' : 'border-accent/30 bg-accent/5'}`}>
                  <p className="text-sm font-medium text-deep">{n.title}</p>
                  <p className="text-xs text-deep/70">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
