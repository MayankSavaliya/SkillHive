import express from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { verifyFirebaseAdmin } from "../middlewares/verifyFirebaseAdmin.js";
import {
  getNotifications,
  getUnreadCount,
  getNotificationMeta,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
  createBulkNotifications
} from "../controllers/notification.controller.js";

const router = express.Router();

// All notification routes require authentication
router.use(verifyFirebaseToken);

// User notification routes
router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.get("/meta", getNotificationMeta);
router.patch("/:notificationId/read", markAsRead);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

// Create notification routes
router.post("/create", createNotification);
router.post("/bulk-create", createBulkNotifications);

// Test route for creating a test notification
router.post("/test", async (req, res) => {
  try {
    const userId = req.user._id;
    
    const testNotification = {
      recipientId: userId,
      title: "🎉 Test Notification",
      message: "This is a test notification to verify the system is working correctly!",
      data: { testData: "Hello World" },
      actionUrl: "/courses"
    };

    const result = await createNotification({ body: testNotification, user: req.user }, res);
    
    if (!res.headersSent) {
      return res.status(201).json({
        success: true,
        message: "Test notification created successfully"
      });
    }
  } catch (error) {
    console.error('Test notification error:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to create test notification"
      });
    }
  }
});

export default router; 