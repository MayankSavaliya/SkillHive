import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  // User who will receive the notification
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  
  // User who sent the notification (optional)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // Notification title
  title: {
    type: String,
    required: true,
    maxlength: 200
  },

  // Notification message/content
  message: {
    type: String,
    required: true,
    maxlength: 1000
  },

  // Additional data for the notification (optional)
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  // Read status
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },

  // Action URL for clickable notifications (optional)
  actionUrl: {
    type: String,
    default: null
  },

  // Expiry date for notifications (optional)
  expiresAt: {
    type: Date,
    default: function() {
      // Default: expire after 30 days
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },

  // Read timestamp
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired notifications

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ recipient: userId, isRead: false });
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );
};

export const Notification = mongoose.model("Notification", notificationSchema); 