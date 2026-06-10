import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext({
    connected: false,
    stats: null,
    notifications: [],
    liveActivity: [],
    requestStats: () => {},
    clearNotifications: () => {},
    clearActivity: () => {},
});

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function SocketProvider({ children }) {
    const socketRef = useRef(null);
    const [connected, setConnected]         = useState(false);
    const [stats, setStats]                 = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [liveActivity, setLiveActivity]   = useState([]);

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

        // Real-time activity feed: entity + text emitted by mutation routes
        socket.on('activity:new', (item) => {
            setLiveActivity(prev => [{ ...item, id: Date.now() }, ...prev].slice(0, 20));
        });

        return () => socket.disconnect();
    }, []);

    const requestStats      = () => socketRef.current?.emit('request:stats');
    const clearNotifications = () => setNotifications([]);
    const clearActivity      = () => setLiveActivity([]);

    return (
        <SocketContext.Provider value={{
            connected,
            stats,
            notifications,
            liveActivity,
            requestStats,
            clearNotifications,
            clearActivity,
        }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    return useContext(SocketContext);
}
