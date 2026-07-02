import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const newSocket = io('http://localhost:5000', { auth: { token } });
    setSocket(newSocket);

    newSocket.on('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    newSocket.on('appointment-update', (data) => {
      setNotifications(prev => [{ type: 'appointment', ...data }, ...prev]);
    });

    return () => newSocket.close();
  }, []);

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, markNotificationRead }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
