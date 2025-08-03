import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  addNotification,
  markAsRead,
  markAllAsRead,
  setConnectionStatus,
} from '../features/notificationSlice';

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { isConnected } = useSelector((state) => state.notification);

  useEffect(() => {
    if (!token || !user) {
      return; 
    }

    socketRef.current = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:8080', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      dispatch(setConnectionStatus(true));
    });

    socket.on('disconnect', () => {
      dispatch(setConnectionStatus(false));
    });

    socket.on('connect_error', (error) => {
      dispatch(setConnectionStatus(false));
    });

    socket.on('new_notification', (notification) => {
      dispatch(addNotification(notification));
    });

    socket.on('notification_read', (notificationId) => {
      dispatch(markAsRead(notificationId));
    });

    socket.on('all_notifications_read', () => {
      dispatch(markAllAsRead());
    });

    return () => {
      socket.disconnect();
      dispatch(setConnectionStatus(false));
    };
  }, [token, user, dispatch]);

  const socketMethods = {
    markNotificationRead: (notificationId) => {
      if (socketRef.current) {
        socketRef.current.emit('mark_notification_read', notificationId);
      }
    },

    markAllNotificationsRead: () => {
      if (socketRef.current) {
        socketRef.current.emit('mark_all_notifications_read');
      }
    },

    isConnected: () => {
      return socketRef.current?.connected || false;
    },

    getSocket: () => {
      return socketRef.current;
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    ...socketMethods
  };
};

export default useSocket; 