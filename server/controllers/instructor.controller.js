import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";
import NotificationService from "../services/notificationService.js";

// Get instructor analytics overview
export const getInstructorAnalytics = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get instructor's courses
    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    // Get all purchases for instructor's courses
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('courseId').populate('userId');

    // Calculate metrics
    const totalRevenue = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    const totalSales = purchases.length;
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    
    // Get unique students
    const uniqueStudents = [...new Set(purchases.map(p => p.userId._id.toString()))];
    const totalStudents = uniqueStudents.length;

    // Calculate average rating (mock for now - can be enhanced with actual ratings)
    const avgRating = 4.6;

    // Get current month revenue
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthRevenue = purchases
      .filter(p => {
        const purchaseDate = new Date(p.createdAt);
        return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
      })
      .reduce((sum, purchase) => sum + (purchase.amount || 0), 0);

    // Calculate growth (comparing with previous month)
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthRevenue = purchases
      .filter(p => {
        const purchaseDate = new Date(p.createdAt);
        return purchaseDate.getMonth() === previousMonth && purchaseDate.getFullYear() === previousYear;
      })
      .reduce((sum, purchase) => sum + (purchase.amount || 0), 0);

    const revenueGrowth = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
      : 0;

    return res.status(200).json({
      success: true,
      analytics: {
        totalRevenue,
        totalSales,
        totalCourses,
        publishedCourses,
        totalStudents,
        avgRating,
        currentMonthRevenue,
        revenueGrowth: parseFloat(revenueGrowth)
      }
    });
  } catch (error) {
    console.error("Get instructor analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructor analytics"
    });
  }
};

// Get instructor revenue data for charts
export const getInstructorRevenue = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const { period = "6months" } = req.query;

    // Get instructor's courses
    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    // Get all purchases for instructor's courses
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('courseId');

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case "7days":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 6);
    }

    // Filter purchases by date range
    const filteredPurchases = purchases.filter(p => new Date(p.createdAt) >= startDate);

    // Group revenue by month
    const revenueByMonth = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    filteredPurchases.forEach(purchase => {
      const date = new Date(purchase.createdAt);
      const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      if (!revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] = 0;
      }
      revenueByMonth[monthKey] += purchase.amount || 0;
    });

    // Convert to array format for charts
    const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month: month.split(' ')[0], // Just month name
      revenue,
      fullDate: month
    }));

    return res.status(200).json({
      success: true,
      revenueData: revenueData.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate))
    });
  } catch (error) {
    console.error("Get instructor revenue error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructor revenue data"
    });
  }
};

// Get instructor students data
export const getInstructorStudents = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get instructor's courses
    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    // Get all purchases for instructor's courses with user details
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('courseId').populate('userId');

    // Get unique students with their data
    const studentsMap = new Map();
    
    purchases.forEach(purchase => {
      const studentId = purchase.userId._id.toString();
      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          id: studentId,
          name: purchase.userId.name,
          email: purchase.userId.email,
          photoUrl: purchase.userId.photoUrl,
          enrolledCourses: [],
          totalSpent: 0,
          lastPurchase: purchase.createdAt
        });
      }
      
      const student = studentsMap.get(studentId);
      student.enrolledCourses.push({
        courseId: purchase.courseId._id,
        courseTitle: purchase.courseId.courseTitle,
        purchaseDate: purchase.createdAt,
        amount: purchase.amount
      });
      student.totalSpent += purchase.amount || 0;
      
      // Update last purchase date if this is more recent
      if (new Date(purchase.createdAt) > new Date(student.lastPurchase)) {
        student.lastPurchase = purchase.createdAt;
      }
    });

    const students = Array.from(studentsMap.values());

    return res.status(200).json({
      success: true,
      students,
      totalStudents: students.length
    });
  } catch (error) {
    console.error("Get instructor students error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructor students data"
    });
  }
};

// Get course performance metrics
export const getCoursePerformance = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get instructor's courses with detailed data
    const courses = await Course.find({ creator: instructorId });

    // Get purchase data for each course
    const coursePerformance = await Promise.all(
      courses.map(async (course) => {
        const purchases = await CoursePurchase.find({
          courseId: course._id,
          status: "completed"
        });

        const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalEnrollments = purchases.length;

        // Get unique students for this course
        const uniqueStudents = [...new Set(purchases.map(p => p.userId.toString()))];

        return {
          courseId: course._id,
          courseTitle: course.courseTitle,
          category: course.category,
          isPublished: course.isPublished,
          coursePrice: course.coursePrice || 0,
          totalRevenue,
          totalEnrollments,
          uniqueStudents: uniqueStudents.length,
          lectureCount: course.lectures ? course.lectures.length : 0,
          createdAt: course.createdAt,
          // Mock rating data (can be enhanced with actual rating system)
          avgRating: (Math.random() * 2 + 3).toFixed(1),
          // Calculate completion rate (mock data for now)
          completionRate: Math.floor(Math.random() * 40 + 60) // 60-100%
        };
      })
    );

    // Sort by revenue (highest first)
    coursePerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Get category distribution
    const categoryStats = {};
    courses.forEach(course => {
      const category = course.category || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          name: category,
          count: 0,
          revenue: 0
        };
      }
      categoryStats[category].count++;
    });

    // Add revenue to category stats
    coursePerformance.forEach(course => {
      const category = course.category || 'Other';
      if (categoryStats[category]) {
        categoryStats[category].revenue += course.totalRevenue;
      }
    });

    const categoryData = Object.values(categoryStats);

    return res.status(200).json({
      success: true,
      coursePerformance,
      categoryData,
      totalCourses: courses.length
    });
  } catch (error) {
    console.error("Get course performance error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course performance data"
    });
  }
};

// Get comprehensive instructor dashboard data
export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get instructor's courses
    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    // Get all purchases for instructor's courses
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('courseId').populate('userId');

    // Calculate comprehensive metrics
    const totalRevenue = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    const totalSales = purchases.length;
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    
    // Get unique students
    const uniqueStudents = [...new Set(purchases.map(p => p.userId._id.toString()))];
    const totalStudents = uniqueStudents.length;

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPurchases = purchases.filter(p => new Date(p.createdAt) >= thirtyDaysAgo);
    const recentRevenue = recentPurchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    const newStudentsThisMonth = [...new Set(recentPurchases.map(p => p.userId._id.toString()))].length;

    // Top performing courses
    const coursePerformance = {};
    purchases.forEach(purchase => {
      const courseId = purchase.courseId._id.toString();
      if (!coursePerformance[courseId]) {
        coursePerformance[courseId] = {
          courseTitle: purchase.courseId.courseTitle,
          revenue: 0,
          enrollments: 0
        };
      }
      coursePerformance[courseId].revenue += purchase.amount || 0;
      coursePerformance[courseId].enrollments += 1;
    });

    const topCourses = Object.values(coursePerformance)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalRevenue,
        totalSales,
        totalCourses,
        publishedCourses,
        totalStudents,
        recentRevenue,
        newStudentsThisMonth,
        topCourses,
        avgRating: 4.6, // Mock - can be enhanced with real ratings
      }
    });
  } catch (error) {
    console.error("Get instructor dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructor dashboard data"
    });
  }
};

// Get instructor messages/conversations
export const getInstructorMessages = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // For now, return mock data since we don't have a Message model
    // This can be enhanced with actual message/conversation system
    const mockMessages = [
      {
        id: 1,
        student: {
          name: "Alice Johnson",
          email: "alice@example.com",
          avatar: "AJ"
        },
        lastMessage: "Thank you for the detailed explanation about hooks!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        unread: true,
        priority: "high",
        course: "React Fundamentals"
      },
      {
        id: 2,
        student: {
          name: "Bob Smith",
          email: "bob@example.com",
          avatar: "BS"
        },
        lastMessage: "Could you review my assignment?",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        unread: false,
        priority: "medium",
        course: "Node.js Basics"
      }
    ];

    return res.status(200).json({
      success: true,
      messages: mockMessages,
      unreadCount: mockMessages.filter(m => m.unread).length
    });
  } catch (error) {
    console.error("Get instructor messages error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructor messages"
    });
  }
};

// Send message to student
export const sendMessageToStudent = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const { studentId, message, subject } = req.body;

    if (!studentId || !message) {
      return res.status(400).json({
        success: false,
        message: "Student ID and message are required"
      });
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Create notification for the message
    await NotificationService.createNotification({
      recipientId: studentId,
      senderId: instructorId,
      type: 'message_received',
      title: subject || 'New Message from Instructor',
      message: message.length > 100 ? message.substring(0, 100) + '...' : message,
      data: {
        messageId: null, // Would be actual message ID when implementing full messaging
        customData: {
          fullMessage: message,
          subject: subject
        }
      },
      priority: 'medium',
      category: 'message',
      actionUrl: '/student/messages',
      sendEmail: true
    });

    console.log(`Message from instructor ${instructorId} to student ${studentId}: ${message}`);

    return res.status(200).json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send message"
    });
  }
};

// Send announcement to all students
export const sendAnnouncement = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const { title, message, courseId } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required"
      });
    }

    // Get instructor's courses
    let targetCourses = [];
    if (courseId && courseId !== 'all') {
      const course = await Course.findOne({ _id: courseId, creator: instructorId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found or not authorized"
        });
      }
      targetCourses = [course];
    } else {
      targetCourses = await Course.find({ creator: instructorId });
    }

    const courseIds = targetCourses.map(course => course._id);

    // Get all students enrolled in these courses
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('userId');

    const uniqueStudents = [...new Set(purchases.map(p => p.userId._id.toString()))];

    // Create notifications for all students
    if (uniqueStudents.length > 0) {
      await NotificationService.createBulkNotifications({
        recipientIds: uniqueStudents,
        senderId: instructorId,
        type: 'announcement',
        title: title,
        message: message,
        data: {
          courseId: courseId && courseId !== 'all' ? courseId : null,
          customData: {
            targetCourses: targetCourses.map(c => c.courseTitle).join(', ')
          }
        },
        priority: 'medium',
        category: 'general',
        actionUrl: '/student/announcements',
        sendEmail: true
      });
    }

    console.log(`Announcement from instructor ${instructorId} to ${uniqueStudents.length} students: ${title} - ${message}`);

    return res.status(200).json({
      success: true,
      message: `Announcement sent to ${uniqueStudents.length} students`,
      recipients: uniqueStudents.length
    });
  } catch (error) {
    console.error("Send announcement error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send announcement"
    });
  }
};

// Get instructor profile
export const getInstructorProfile = async (req, res) => {
  try {
    const instructorId = req.user._id;

    // Get instructor details
    const instructor = await User.findById(instructorId).select('-password');
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found"
      });
    }

    // Get instructor's courses for additional stats
    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    // Get purchase stats
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    });

    const totalRevenue = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    const totalStudents = [...new Set(purchases.map(p => p.userId.toString()))].length;

    return res.status(200).json({
      success: true,
      profile: {
        ...instructor.toObject(),
        stats: {
          totalCourses: courses.length,
          publishedCourses: courses.filter(c => c.isPublished).length,
          totalStudents,
          totalRevenue,
          avgRating: 4.6, // Mock - can be enhanced with real ratings
          joinedDate: instructor.createdAt
        }
      }
    });
  } catch (error) {
    console.error("Get instructor profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get instructor profile"
    });
  }
};

// Update instructor profile
export const updateInstructorProfile = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData.role;
    delete updateData._id;

    const updatedInstructor = await User.findByIdAndUpdate(
      instructorId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedInstructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedInstructor
    });
  } catch (error) {
    console.error("Update instructor profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update instructor profile"
    });
  }
};
