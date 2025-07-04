import { Server } from 'socket.io';
import admin from '../config/firebase.js';

class SocketManager {
  constructor() {
    this.io = null;
    this.userSocketMap = new Map(); // userId -> socketId mapping
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
      }
    });

    // Authentication middleware for socket connections
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

        // Verify Firebase token
        const decodedToken = await admin.auth().verifyIdToken(token);
        socket.userId = decodedToken.uid;
        socket.userEmail = decodedToken.email;
        
        next();
      } catch (error) {
        console.error('Socket authentication error:', error);
        next(new Error('Authentication failed'));
      }
    });

    this.io.on('connection', (socket) => {
      // Store user-socket mapping
      this.userSocketMap.set(socket.userId, socket.id);

      // Join user to their personal room
      socket.join(`user_${socket.userId}`);

      // Handle notification events
      socket.on('mark_notification_read', (notificationId) => {
        // Emit to all user's connected devices
        this.io.to(`user_${socket.userId}`).emit('notification_read', notificationId);
      });

      socket.on('mark_all_notifications_read', () => {
        // Emit to all user's connected devices
        this.io.to(`user_${socket.userId}`).emit('all_notifications_read');
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.userSocketMap.delete(socket.userId);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  // Send notification to specific user
  sendNotificationToUser(userId, notification) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('new_notification', notification);
    }
  }

  // Send notification to multiple users
  sendNotificationToUsers(userIds, notification) {
    if (this.io) {
      userIds.forEach(userId => {
        this.io.to(`user_${userId}`).emit('new_notification', notification);
      });
    }
  }

  // Send notification with real-time delivery
  async sendNotificationWithRealtime(notification) {
    // Send real-time notification
    this.sendNotificationToUser(notification.recipient, {
      id: notification._id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      category: notification.category,
      actionUrl: notification.actionUrl,
      createdAt: notification.createdAt,
      sender: notification.sender
    });
  }

  // Send bulk notifications with real-time delivery
  async sendBulkNotificationsWithRealtime(notifications) {
    notifications.forEach(notification => {
      this.sendNotificationWithRealtime(notification);
    });
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.userSocketMap.has(userId);
  }
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager;