import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatBox from './ChatBox';

export default function ChatWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const shouldRender = useMemo(() => {
    if (!user || user.role === 'admin') return false;
    return !location.pathname.startsWith('/admin');
  }, [location.pathname, user]);

  if (!shouldRender) return null;

  return (
    <div className="fixed bottom-3 right-3 z-50 sm:bottom-5 sm:right-5">
      {open && (
        <div className="mb-2 h-[70vh] w-[calc(100vw-1.5rem)] sm:mb-3 sm:h-[460px] sm:w-[min(92vw,360px)]">
          <ChatBox
            currentUser={user}
            targetUserId={user._id}
            sendReceiverId=""
            title="Chat with Admin"
            subtitle="We usually reply quickly"
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full bg-accent px-4 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:bg-accent/90 sm:px-5 sm:py-3 sm:text-sm"
      >
        {open ? 'Close Chat' : 'Need help? Chat'}
      </button>
    </div>
  );
}
