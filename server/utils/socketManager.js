import { Server } from 'socket.io';
import admin from '../config/firebase.js';

class SocketManager {
  constructor() {
    this.io = null;
    this.userSocketMap = new Map();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true
      }
    });

    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication token required'));
        }

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
      this.userSocketMap.set(socket.userId, socket.id);

      socket.join(`user_${socket.userId}`);

      socket.on('mark_notification_read', (notificationId) => {
        this.io.to(`user_${socket.userId}`).emit('notification_read', notificationId);
      });

      socket.on('mark_all_notifications_read', () => {
        this.io.to(`user_${socket.userId}`).emit('all_notifications_read');
      });

      socket.on('disconnect', () => {
        this.userSocketMap.delete(socket.userId);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });
  }

  sendNotificationToUser(userId, notification) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('new_notification', notification);
    }
  }

  sendNotificationToUsers(userIds, notification) {
    if (this.io) {
      userIds.forEach(userId => {
        this.io.to(`user_${userId}`).emit('new_notification', notification);
      });
    }
  }

  async sendNotificationWithRealtime(notification) {
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

  async sendBulkNotificationsWithRealtime(notifications) {
    notifications.forEach(notification => {
      this.sendNotificationWithRealtime(notification);
    });
  }

  isUserOnline(userId) {
    return this.userSocketMap.has(userId);
  }
}


const socketManager = new SocketManager();

export default socketManager;