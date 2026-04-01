import React from 'react';

function formatTime(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, currentUserId }) {
  const senderId = message?.senderId?._id || message?.senderId;
  const isOwn = String(senderId) === String(currentUserId);

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[90%] rounded-2xl px-3 py-2 shadow-soft sm:max-w-[80%] ${
          isOwn ? 'bg-accent text-white rounded-br-md' : 'bg-beige/70 text-deep rounded-bl-md'
        }`}
      >
        <p className="text-sm leading-relaxed break-words">{message.message}</p>
        <p className={`mt-1 text-[11px] ${isOwn ? 'text-white/80' : 'text-deep/60'}`}>{formatTime(message.createdAt)}</p>
      </div>
    </div>
  );
}
