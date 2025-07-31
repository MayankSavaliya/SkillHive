import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";
import NotificationService from "../services/notificationService.js";



//instructor na analytics page ma data show karva
export const getInstructorAnalytics = async (req, res) => {
  try {
    const instructorId = req.user._id;


    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('courseId').populate('userId');

    
    const totalRevenue = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    const totalSales = purchases.length;
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    
    
    const uniqueStudents = [...new Set(purchases.map(p => p.userId._id.toString()))];
    const totalStudents = uniqueStudents.length;

    
    const avgRating = 4.6;

    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthRevenue = purchases
      .filter(p => {
        const purchaseDate = new Date(p.createdAt);
        return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
      })
      .reduce((sum, purchase) => sum + (purchase.amount || 0), 0);

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

//instructor na revenue page ma data show karva
export const getInstructorRevenue = async (req, res) => {
  try {
    const instructorId = req.user._id;
    const { period = "6months" } = req.query;

    
    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('courseId');

   
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


    const filteredPurchases = purchases.filter(p => new Date(p.createdAt) >= startDate);


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

    
    const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month: month.split(' ')[0], 
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



//instructor na students page ma students ni details mate
export const getInstructorStudents = async (req, res) => {
  try {
    const instructorId = req.user._id;

    
    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('courseId').populate('userId');

    
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

//dashboard page na course performance mate
export const getCoursePerformance = async (req, res) => {
  try {
    const instructorId = req.user._id;

    
    const courses = await Course.find({ creator: instructorId });

    
    const coursePerformance = await Promise.all(
      courses.map(async (course) => {
        const purchases = await CoursePurchase.find({
          courseId: course._id,
          status: "completed"
        });

        const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalEnrollments = purchases.length;

        
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
          avgRating: (Math.random() * 2 + 3).toFixed(1),
          completionRate: Math.floor(Math.random() * 40 + 60)
        };
      })
    );


    coursePerformance.sort((a, b) => b.totalRevenue - a.totalRevenue);


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

//dashboard page ma data show karva
export const getInstructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user._id;

    
    const courses = await Course.find({ creator: instructorId });
    const courseIds = courses.map(course => course._id);

    
    const purchases = await CoursePurchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate('courseId').populate('userId');

    
    const totalRevenue = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    const totalSales = purchases.length;
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    
    
    const uniqueStudents = [...new Set(purchases.map(p => p.userId._id.toString()))];
    const totalStudents = uniqueStudents.length;

    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPurchases = purchases.filter(p => new Date(p.createdAt) >= thirtyDaysAgo);
    const recentRevenue = recentPurchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    const newStudentsThisMonth = [...new Set(recentPurchases.map(p => p.userId._id.toString()))].length;

    
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

    //only top 5 courses show karva
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
        avgRating: 4.6, 
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

