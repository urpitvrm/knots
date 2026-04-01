import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
    api.get('/notifications/me').then((res) => setItems(res.data.items || [])).catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return undefined;

    const onNotification = (notification) => {
      setItems((prev) => [notification, ...prev].slice(0, 50));
    };

    const onAdminNotification = (payload) => {
      setItems((prev) => [
        {
          _id: `admin-${Date.now()}`,
          title: payload.title || 'New update',
          message: payload.message || '',
          type: payload.type || 'info',
          read: false,
          createdAt: new Date().toISOString()
        },
        ...prev
      ].slice(0, 50));
    };

    socket.on('notification', onNotification);
    socket.on('notification:admin', onAdminNotification);
    socket.on('new_message', (msg) => {
      setItems((prev) => [
        {
          _id: `msg-${msg._id}`,
          title: 'New chat message',
          message: msg.message,
          type: 'new_message',
          read: false,
          createdAt: msg.createdAt
        },
        ...prev
      ].slice(0, 50));
    });

    return () => {
      socket.off('notification', onNotification);
      socket.off('notification:admin', onAdminNotification);
      socket.off('new_message');
    };
  }, [socket, user]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const markAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await api.put('/notifications/me/read-all');
    } catch {
      // noop
    }
  };

  const value = useMemo(
    () => ({ items, unreadCount, markAllRead }),
    [items, unreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  return useContext(NotificationContext);
}
