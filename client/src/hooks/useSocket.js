import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
  addNotification,
  markAsRead,
  markAllAsRead,
  setConnectionStatus,
  setUnreadCount
} from '../features/notificationSlice';

const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { isConnected } = useSelector((state) => state.notification);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!token || !user) {
      return;
    }

    // Initialize socket connection
    socketRef.current = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:8080', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      dispatch(setConnectionStatus(true));
    });

    socket.on('disconnect', () => {
      dispatch(setConnectionStatus(false));
    });

    socket.on('connect_error', (error) => {
      dispatch(setConnectionStatus(false));
    });

    // Notification events
    socket.on('new_notification', (notification) => {
      dispatch(addNotification(notification));
    });

    socket.on('notification_read', (notificationId) => {
      dispatch(markAsRead(notificationId));
    });

    socket.on('all_notifications_read', () => {
      dispatch(markAllAsRead());
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      dispatch(setConnectionStatus(false));
    };
  }, [token, user, dispatch]);

  // Socket utility methods
  const socketMethods = {
    // Mark notification as read (emit to server)
    markNotificationRead: (notificationId) => {
      if (socketRef.current) {
        socketRef.current.emit('mark_notification_read', notificationId);
      }
    },

    // Mark all notifications as read (emit to server)
    markAllNotificationsRead: () => {
      if (socketRef.current) {
        socketRef.current.emit('mark_all_notifications_read');
      }
    },

    // Check if socket is connected
    isConnected: () => {
      return socketRef.current?.connected || false;
    },

    // Get socket instance (for advanced usage)
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