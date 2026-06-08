import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext({ connected: false, stats: null, notifications: [], requestStats: () => {}, clearNotifications: () => {} });

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function SocketProvider({ children }) {
    const socketRef = useRef(null);
    const [connected, setConnected]       = useState(false);
    const [stats, setStats]               = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socketRef.current = socket;

        socket.on('connect',    () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));

        socket.on('stats:update', (data) => setStats(data));

        socket.on('notification', (notif) => {
            setNotifications(prev => [notif, ...prev].slice(0, 50));
        });

        return () => socket.disconnect();
    }, []);

    const requestStats = () => socketRef.current?.emit('request:stats');

    const clearNotifications = () => setNotifications([]);

    return (
        <SocketContext.Provider value={{ connected, stats, notifications, requestStats, clearNotifications }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
