import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!token || !user) {
      setSocket(null);
      setOnlineUsers([]);
      return undefined;
    }

    const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    const client = io(socketUrl, {
      auth: { token },
      transports: ['websocket']
    });

    client.on('online_users', (users) => {
      setOnlineUsers(users || []);
    });

    setSocket(client);

    return () => {
      client.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    };
  }, [token, user]);

  const value = useMemo(
    () => ({
      socket,
      onlineUsers,
      isUserOnline: (userId) => onlineUsers.includes(String(userId))
    }),
    [onlineUsers, socket]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  return useContext(SocketContext);
}
