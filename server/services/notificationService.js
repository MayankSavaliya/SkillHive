import { Notification } from '../models/notification.model.js';
import socketManager from '../utils/socketManager.js';

class NotificationService {

  async createNotification({ recipientId, senderId = null, title, message, data = null, actionUrl = null, expiresAt = null }) {
    try {
      const notification = new Notification({
        recipient: recipientId,
        sender: senderId,
        title,
        message,
        data,
        actionUrl,
        expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
      });

      const savedNotification = await notification.save();
      
      await savedNotification.populate('sender', 'name email photoUrl');

      if (socketManager && socketManager.io) {
        socketManager.sendNotificationToUser(recipientId, savedNotification);
      }

      return savedNotification;
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  }

  async createBulkNotifications({ recipientIds, senderId = null, title, message, data = null, actionUrl = null, expiresAt = null }) {
    try {
      const notifications = recipientIds.map(recipientId => ({
        recipient: recipientId,
        sender: senderId,
        title,
        message,
        data,
        actionUrl,
        expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }));

      const savedNotifications = await Notification.insertMany(notifications);
      
    
      const populatedNotifications = await Notification.populate(savedNotifications, {
        path: 'sender',
        select: 'name email photoUrl'
      });

      
      if (socketManager && socketManager.io) {
        recipientIds.forEach((recipientId, index) => {
          socketManager.sendNotificationToUser(recipientId, populatedNotifications[index]);
        });
      }

      return populatedNotifications;
    } catch (error) {
      console.error('Create bulk notifications error:', error);
      throw error;
    }
  }

  async getUserNotifications(userId, { page = 1, limit = 20, unreadOnly = false } = {}) {
    try {
      const query = { recipient: userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      
      await Notification.deleteMany({
        recipient: userId,
        expiresAt: { $lte: new Date() }
      });

      const skip = (page - 1) * limit;
      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('sender', 'name email photoUrl')
        .lean();

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
        expiresAt: { $gt: new Date() }
      });

      return {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      };
    } catch (error) {
      console.error('Get user notifications error:', error);
      throw error;
    }
  }

  
  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({
        recipient: userId,
        isRead: false,
        expiresAt: { $gt: new Date() }
      });
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  }

  
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      ).populate('sender', 'name email photoUrl');

      return notification;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  
  async markAllAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      return result;
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId
      });

      return notification;
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  
  async deleteAllNotifications(userId) {
    try {
      const result = await Notification.deleteMany({
        recipient: userId
      });

      return result;
    } catch (error) {
      console.error('Delete all notifications error:', error);
      throw error;
    }
  }

  
  async cleanExpiredNotifications() {
    try {
      const result = await Notification.deleteMany({
        expiresAt: { $lte: new Date() }
      });

      return result;
    } catch (error) {
      console.error('Clean expired notifications error:', error);
      throw error;
    }
  }
}

export default new NotificationService();