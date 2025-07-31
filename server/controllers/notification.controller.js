import NotificationService from '../services/notificationService.js';
import socketManager from '../utils/socketManager.js';

// Get notifications for the authenticated user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const result = await NotificationService.getUserNotifications(userId, {
      page,
      limit,
      unreadOnly: unreadOnly === 'true'
    });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get notifications"
    });
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await NotificationService.getUnreadCount(userId);

    return res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get unread count"
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await NotificationService.markAsRead(notificationId, userId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    // Emit real-time update
    if (socketManager && socketManager.io) {
      socketManager.io.to(`user_${userId}`).emit('notification_read', notificationId);
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read"
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const result = await NotificationService.markAllAsRead(userId);

    // Emit real-time update
    if (socketManager && socketManager.io) {
      socketManager.io.to(`user_${userId}`).emit('all_notifications_read');
    }

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read"
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.params;

    const notification = await NotificationService.deleteNotification(notificationId, userId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully"
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete notification"
    });
  }
};

// Create notification
export const createNotification = async (req, res) => {
  try {
    const {
      recipientId,
      title,
      message,
      data = null,
      actionUrl = null,
      expiresAt = null
    } = req.body;

    if (!recipientId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient ID, title, and message are required"
      });
    }

    const notification = await NotificationService.createNotification({
      recipientId,
      senderId: req.user._id,
      title,
      message,
      data,
      actionUrl,
      expiresAt
    });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification
    });
  } catch (error) {
    console.error("Create notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create notification"
    });
  }
};





 