import express from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification
} from "../controllers/notification.controller.js";

const router = express.Router();

// All notification routes require authentication
router.use(verifyFirebaseToken);

// User notification routes
router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:notificationId/read", markAsRead);
router.patch("/mark-all-read", markAllAsRead);
router.delete("/:notificationId", deleteNotification);

// Create notification routes
router.post("/create", createNotification);



export default router; 