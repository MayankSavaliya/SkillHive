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
        origin: "http://localhost:5173",
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
      console.log(`User connected: ${socket.userId}`);
      
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

      // Handle typing indicators for messages
      socket.on('typing_start', (data) => {
        socket.to(`user_${data.recipientId}`).emit('user_typing', {
          userId: socket.userId,
          conversationId: data.conversationId
        });
      });

      socket.on('typing_stop', (data) => {
        socket.to(`user_${data.recipientId}`).emit('user_stopped_typing', {
          userId: socket.userId,
          conversationId: data.conversationId
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        this.userSocketMap.delete(socket.userId);
      });

      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    });

    console.log('Socket.io server initialized');
  }

  // Send notification to specific user
  sendNotificationToUser(userId, notification) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('new_notification', notification);
      console.log(`Notification sent to user ${userId}`);
    }
  }

  // Send notification to multiple users
  sendNotificationToUsers(userIds, notification) {
    if (this.io) {
      userIds.forEach(userId => {
        this.io.to(`user_${userId}`).emit('new_notification', notification);
      });
      console.log(`Notification sent to ${userIds.length} users`);
    }
  }

  // Send real-time message
  sendMessageToUser(userId, message) {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('new_message', message);
      console.log(`Message sent to user ${userId}`);
    }
  }

  // Broadcast announcement to all connected users
  broadcastAnnouncement(announcement) {
    if (this.io) {
      this.io.emit('announcement', announcement);
      console.log('Announcement broadcasted to all users');
    }
  }

  // Send course update to enrolled students
  sendCourseUpdateToStudents(studentIds, update) {
    if (this.io) {
      studentIds.forEach(studentId => {
        this.io.to(`user_${studentId}`).emit('course_update', update);
      });
      console.log(`Course update sent to ${studentIds.length} students`);
    }
  }

  // Send system maintenance notification
  sendMaintenanceNotification(notification) {
    if (this.io) {
      this.io.emit('system_maintenance', notification);
      console.log('Maintenance notification sent to all users');
    }
  }

  // Get online users count
  getOnlineUsersCount() {
    return this.userSocketMap.size;
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.userSocketMap.has(userId);
  }

  // Get all online users
  getOnlineUsers() {
    return Array.from(this.userSocketMap.keys());
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
}

// Create singleton instance
const socketManager = new SocketManager();

export default socketManager; 