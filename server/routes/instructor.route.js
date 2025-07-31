import express from "express";
import { verifyFirebaseToken } from "../middlewares/verifyFirebaseToken.js";
import { 
  getInstructorAnalytics, 
  getInstructorRevenue, 
  getInstructorStudents, 
  getCoursePerformance,
  sendMessageToStudent,
  sendAnnouncement,
  getInstructorDashboard
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
router.post("/send-message", sendMessageToStudent);
router.post("/send-announcement", sendAnnouncement);

export default router;
