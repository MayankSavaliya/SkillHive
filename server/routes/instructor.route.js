import express from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { 
  getInstructorAnalytics, 
  getInstructorRevenue, 
  getInstructorStudents, 
  getCoursePerformance,
  sendMessageToStudent,
  getInstructorMessages,
  sendAnnouncement,
  getInstructorDashboard,
  updateInstructorProfile,
  getInstructorProfile
} from "../controllers/instructor.controller.js";

const router = express.Router();

// All instructor routes require authentication
router.use(verifyFirebaseToken);

// Dashboard and analytics routes
router.get("/dashboard", getInstructorDashboard);
router.get("/analytics", getInstructorAnalytics);
router.get("/revenue", getInstructorRevenue);
router.get("/course-performance", getCoursePerformance);

// Student management routes
router.get("/students", getInstructorStudents);

// Message and communication routes
router.get("/messages", getInstructorMessages);
router.post("/send-message", sendMessageToStudent);
router.post("/send-announcement", sendAnnouncement);

// Profile management routes
router.get("/profile", getInstructorProfile);
router.put("/profile", updateInstructorProfile);

export default router;
