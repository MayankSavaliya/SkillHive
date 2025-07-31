import express from "express";
import { 
    getUserProfile, 
    updateProfile, 
    getAllUsers, 
    updateUserRole, 
    deleteUser, 
    getUserStats, 
    requestInstructorRole,
    getEnrollmentAnalytics,
    getRevenueAnalytics,
    getTopPerformingCourses,
    getAllEnrollments,
    getAdminCourseDetails
} from "../controllers/user.controller.js";
import { 
    firebaseAuth, 
    firebaseSignup, 
    firebaseLogout 
} from "../controllers/firebaseAuth.controller.js";
import verifyFirebaseToken from "../middlewares/verifyFirebaseToken.js";
import verifyFirebaseAdmin from "../middlewares/verifyFirebaseAdmin.js";
import upload from "../utils/multer.js";

const router = express.Router();

// Firebase authentication routes (only these are needed now)
router.route("/auth/firebase").post(firebaseAuth);
router.route("/auth/firebase/signup").post(firebaseSignup);
router.route("/auth/firebase/logout").post(firebaseLogout);

// Profile fetch karva ne update karva mate route
router.route("/profile").get(verifyFirebaseToken, getUserProfile);
router.route("/profile/update").put(verifyFirebaseToken, upload.single("profilePhoto"), updateProfile);

// User role management
router.route("/request-instructor").put(verifyFirebaseToken, requestInstructorRole);

// Admin na user managemnet routes
router.route("/admin/users").get(verifyFirebaseAdmin, getAllUsers);
router.route("/admin/users/stats").get(verifyFirebaseAdmin, getUserStats);
router.route("/admin/users/:userId/role").put(verifyFirebaseAdmin, updateUserRole);
router.route("/admin/users/:userId").delete(verifyFirebaseAdmin, deleteUser);

// Admin na analytics karva mate na route matlab admin dashboard
router.route("/admin/analytics/enrollments").get(verifyFirebaseAdmin, getEnrollmentAnalytics);
router.route("/admin/analytics/revenue").get(verifyFirebaseAdmin, getRevenueAnalytics);
router.route("/admin/analytics/top-courses").get(verifyFirebaseAdmin, getTopPerformingCourses);
router.route("/admin/enrollments").get(verifyFirebaseAdmin, getAllEnrollments);
router.route("/admin/courses/:courseId/details").get(verifyFirebaseAdmin, getAdminCourseDetails);

export default router;