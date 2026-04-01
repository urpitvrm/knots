import React, { useEffect, useMemo, useRef, useState } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export default function ChatBox({
  currentUser,
  targetUserId,
  sendReceiverId,
  title,
  subtitle,
  className = ''
}) {
  const { socket, isUserOnline } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  const normalizedTargetId = useMemo(() => String(targetUserId || ''), [targetUserId]);
  const normalizedReceiverId = useMemo(() => {
    if (sendReceiverId === undefined) return normalizedTargetId;
    return String(sendReceiverId || '');
  }, [sendReceiverId, normalizedTargetId]);
  const isTargetOnline = normalizedTargetId ? isUserOnline(normalizedTargetId) : false;

  useEffect(() => {
    if (!currentUser?._id || !normalizedTargetId) return;
    setLoading(true);
    setError('');
    api
      .get(`/chat/${normalizedTargetId}`)
      .then((res) => setMessages(res.data.items || []))
      .catch(() => setError('Failed to load messages'))
      .finally(() => setLoading(false));
  }, [currentUser?._id, normalizedTargetId]);

  useEffect(() => {
    if (!socket || !currentUser?._id) return undefined;

    socket.emit('join_room', { roomId: String(currentUser._id) });
    if (normalizedTargetId) {
      socket.emit('join_room', { roomId: normalizedTargetId });
    }

    const onReceiveMessage = (incoming) => {
      const senderId = incoming?.senderId?._id || incoming?.senderId;
      const receiverId = incoming?.receiverId?._id || incoming?.receiverId;
      const ids = [String(senderId), String(receiverId)];
      if (ids.includes(normalizedTargetId) || ids.includes(String(currentUser._id))) {
        setMessages((prev) => {
          if (prev.some((item) => item._id === incoming._id)) return prev;
          return [...prev, incoming];
        });
      }
    };

    socket.on('receive_message', onReceiveMessage);
    return () => socket.off('receive_message', onReceiveMessage);
  }, [socket, currentUser?._id, normalizedTargetId]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text) => {
    if (!socket) return;
    socket.emit('send_message', { receiverId: normalizedReceiverId, message: text });
  };

  return (
    <div className={`flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-beige/60 bg-white shadow-soft ${className}`}>
      <div className="border-b border-beige/60 bg-cream px-3 py-2.5 sm:px-4 sm:py-3">
        <h3 className="font-display text-base text-deep sm:text-lg">{title}</h3>
        <p className="truncate text-xs text-deep/70">
          {subtitle}
          {normalizedTargetId && (
            <span className={`ml-2 font-medium ${isTargetOnline ? 'text-green-600' : 'text-deep/50'}`}>
              {isTargetOnline ? 'Online' : 'Offline'}
            </span>
          )}
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-cream/50 p-3 sm:p-4">
        {loading && <p className="text-sm text-deep/60">Loading chat...</p>}
        {!loading && error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && messages.length === 0 && <p className="text-sm text-deep/60">No messages yet.</p>}
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} currentUserId={currentUser?._id} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} disabled={!socket || loading || !!error} />
    </div>
  );
}
