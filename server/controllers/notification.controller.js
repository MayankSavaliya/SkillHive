import NotificationService from '../services/notificationService.js';
import { Notification } from '../models/notification.model.js';
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

// Create bulk notifications
export const createBulkNotifications = async (req, res) => {
  try {
    const {
      recipientIds,
      title,
      message,
      data = null,
      actionUrl = null,
      expiresAt = null
    } = req.body;

    if (!recipientIds || !Array.isArray(recipientIds) || recipientIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Recipient IDs array is required"
      });
    }

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required"
      });
    }

    const notifications = await NotificationService.createBulkNotifications({
      recipientIds,
      senderId: req.user._id,
      title,
      message,
      data,
      actionUrl,
      expiresAt
    });

    return res.status(201).json({
      success: true,
      message: `${notifications.length} notifications created successfully`,
      notifications
    });
  } catch (error) {
    console.error("Create bulk notifications error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create bulk notifications"
    });
  }
};

// Get notification types and categories (for frontend dropdowns)
export const getNotificationMeta = async (req, res) => {
  try {
    const types = [
      "course_published",
      "course_enrolled", 
      "course_updated",
      "lecture_added",
      "assignment_submitted",
      "assignment_graded",
      "message_received",
      "announcement",
      "payment_received",
      "course_completed",
      "certificate_earned",
      "review_received",
      "system_maintenance",
      "welcome",
      "reminder",
      "achievement"
    ];

    const categories = [
      "course",
      "message", 
      "payment",
      "system",
      "achievement",
      "general"
    ];

    const priorities = ["low", "medium", "high", "urgent"];

    return res.status(200).json({
      success: true,
      types,
      categories,
      priorities
    });
  } catch (error) {
    console.error("Get notification meta error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get notification metadata"
    });
  }
};

// Get notification statistics for admin
export const getNotificationStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get statistics
    const totalNotifications = await Notification.countDocuments({
      createdAt: { $gte: startDate }
    });

    const unreadNotifications = await Notification.countDocuments({
      createdAt: { $gte: startDate },
      isRead: false
    });

    const emailsSent = await Notification.countDocuments({
      createdAt: { $gte: startDate },
      emailSent: true
    });

    // Get notifications by type
    const notificationsByType = await Notification.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get notifications by category
    const notificationsByCategory = await Notification.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get daily notification counts
    const dailyNotifications = await Notification.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalNotifications,
        unreadNotifications,
        emailsSent,
        readRate: totalNotifications > 0 ? ((totalNotifications - unreadNotifications) / totalNotifications * 100).toFixed(1) : 0,
        emailRate: totalNotifications > 0 ? (emailsSent / totalNotifications * 100).toFixed(1) : 0
      },
      charts: {
        notificationsByType,
        notificationsByCategory,
        dailyNotifications
      }
    });
  } catch (error) {
    console.error("Get notification stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get notification statistics"
    });
  }
}; 