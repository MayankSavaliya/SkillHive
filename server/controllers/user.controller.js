import {User} from "../models/user.model.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";

export const getUserProfile = async (req,res) => {
    try {
        const userId = req.user._id;
        // Debug log removed for production
        const user = await User.findById(userId).select("-password").populate({
            path: "enrolledCourses",
            populate: {
                path: "creator",
                select: "name photoUrl"
            }
        });
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        })
    }
}
export const updateProfile = async (req,res) => {
    try {
        const userId = req.user._id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            }) 
        }
        // extract public id of the old image from the url is it exists;
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
            deleteMediaFromCloudinary(publicId);
        }

        // upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.buffer);
        const photoUrl = cloudResponse.secure_url;

        const updatedData = {name, photoUrl};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
}

// Admin functionalities for user management
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '' } = req.query;
        const skip = (page - 1) * limit;

        // Build search query
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role && role !== 'all') {
            query.role = role;
        }

        const users = await User.find(query)
            .select("-password")
            .populate('enrolledCourses', 'courseTitle coursePrice')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalUsers,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            message: "All users retrieved successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve users"
        });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        
        if (!role || !["student", "instructor", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Must be student, instructor, or admin."
            });
        }
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { role }, 
            { new: true }
        ).select("-password");
        
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: `User role updated to ${role} successfully`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update user role"
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Prevent admin from deleting themselves
        if (userId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own account"
            });
        }
        
        // Delete user's profile photo from cloudinary if exists
        if (user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0];
            deleteMediaFromCloudinary(publicId);
        }
        
        await User.findByIdAndDelete(userId);
        
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const students = await User.countDocuments({ role: "student" });
        const instructors = await User.countDocuments({ role: "instructor" });
        const admins = await User.countDocuments({ role: "admin" });
        
        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                students,
                instructors,
                admins
            },
            message: "User statistics retrieved successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user statistics"
        });
    }
};

export const requestInstructorRole = async (req, res) => {
    try {
        const userId = req.user._id; // from verifyFirebaseToken middleware
        
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        if (user.role === "instructor") {
            return res.status(400).json({
                success: false,
                message: "You are already an instructor"
            });
        }
        
        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Admins cannot request instructor role"
            });
        }
        
        // Update user role to instructor
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: "instructor" },
            { new: true }
        ).select("-password");
        
        return res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Congratulations! You are now an instructor"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update role to instructor"
        });
    }
};

// Admin Analytics Endpoints
export const getEnrollmentAnalytics = async (req, res) => {
    try {
        // Get total enrollments (only completed purchases)
        const totalEnrollments = await CoursePurchase.countDocuments({ status: 'completed' });
        
        // Get enrollment growth (last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        
        const recentEnrollments = await CoursePurchase.countDocuments({
            status: 'completed',
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        const previousEnrollments = await CoursePurchase.countDocuments({
            status: 'completed',
            createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        });
        
        const enrollmentGrowth = previousEnrollments > 0 
            ? ((recentEnrollments - previousEnrollments) / previousEnrollments * 100).toFixed(1)
            : 0;
        
        // Get active courses (courses with at least one completed enrollment)
        const activeCourses = await CoursePurchase.distinct('courseId', { status: 'completed' }).then(courseIds => courseIds.length);
        
        // Get enrollment timeline (last 7 days)
        const enrollmentTimeline = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));
            
            const dayEnrollments = await CoursePurchase.find({
                status: 'completed',
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }).populate('courseId', 'coursePrice');
            
            const dayRevenue = dayEnrollments.reduce((sum, enrollment) => 
                sum + (enrollment.courseId?.coursePrice || 0), 0
            );
            
            enrollmentTimeline.push({
                date: startOfDay,
                enrollments: dayEnrollments.length,
                revenue: dayRevenue
            });
        }
        
        return res.status(200).json({
            success: true,
            analytics: {
                totalEnrollments,
                enrollmentGrowth: parseFloat(enrollmentGrowth),
                activeCourses,
                enrollmentTimeline
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get enrollment analytics"
        });
    }
};

export const getRevenueAnalytics = async (req, res) => {
    try {
        const { period = '30d' } = req.query;
        
        let days = 30;
        switch (period) {
            case '7d': days = 7; break;
            case '30d': days = 30; break;
            case '90d': days = 90; break;
            case '1y': days = 365; break;
            default: days = 30;
        }
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Get revenue for the period (only completed purchases)
        const purchases = await CoursePurchase.find({
            status: 'completed',
            createdAt: { $gte: startDate }
        }).populate('courseId', 'coursePrice');
        
        const totalRevenue = purchases.reduce((sum, purchase) => 
            sum + (purchase.courseId?.coursePrice || 0), 0
        );
        
        // Get previous period for growth calculation (only completed purchases)
        const previousStartDate = new Date();
        previousStartDate.setDate(previousStartDate.getDate() - (days * 2));
        const previousEndDate = new Date();
        previousEndDate.setDate(previousEndDate.getDate() - days);
        
        const previousPurchases = await CoursePurchase.find({
            status: 'completed',
            createdAt: { $gte: previousStartDate, $lt: previousEndDate }
        }).populate('courseId', 'coursePrice');
        
        const previousRevenue = previousPurchases.reduce((sum, purchase) => 
            sum + (purchase.courseId?.coursePrice || 0), 0
        );
        
        const revenueGrowth = previousRevenue > 0 
            ? ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1)
            : 0;
        
        // Get average revenue per course
        const totalCourses = await Course.countDocuments();
        const avgRevenuePerCourse = totalCourses > 0 ? totalRevenue / totalCourses : 0;
        
        return res.status(200).json({
            success: true,
            analytics: {
                totalRevenue,
                revenueGrowth: parseFloat(revenueGrowth),
                avgRevenuePerCourse
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get revenue analytics"
        });
    }
};

export const getTopPerformingCourses = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        // Aggregate to get courses with enrollment count (only completed purchases)
        const topCourses = await Course.aggregate([
            {
                $lookup: {
                    from: 'coursepurchases',
                    localField: '_id',
                    foreignField: 'courseId',
                    as: 'enrollments'
                }
            },
            {
                $addFields: {
                    // Filter only completed enrollments
                    completedEnrollments: {
                        $filter: {
                            input: '$enrollments',
                            cond: { $eq: ['$$this.status', 'completed'] }
                        }
                    }
                }
            },
            {
                $addFields: {
                    enrollmentCount: { $size: '$completedEnrollments' },
                    totalRevenue: {
                        $multiply: ['$coursePrice', { $size: '$completedEnrollments' }]
                    }
                }
            },
            {
                $sort: { totalRevenue: -1 }
            },
            {
                $limit: parseInt(limit)
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'creator'
                }
            },
            {
                $unwind: '$creator'
            },
            {
                $project: {
                    courseTitle: 1,
                    coursePrice: 1,
                    category: 1,
                    enrollmentCount: 1,
                    totalRevenue: 1,
                    'creator.name': 1,
                    'creator.email': 1,
                    enrolledStudents: '$completedEnrollments'
                }
            }
        ]);
        
        return res.status(200).json({
            success: true,
            courses: topCourses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get top performing courses"
        });
    }
};

export const getAllEnrollments = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;
        
        // Get enrollments with populated data (only completed purchases)
        const enrollments = await CoursePurchase.find({ status: 'completed' })
            .populate({
                path: 'userId',
                select: 'name email'
            })
            .populate({
                path: 'courseId',
                select: 'courseTitle coursePrice category creator',
                populate: {
                    path: 'creator',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Filter based on search if provided
        let filteredEnrollments = enrollments;
        if (search) {
            filteredEnrollments = enrollments.filter(enrollment => {
                const studentName = enrollment.userId?.name?.toLowerCase() || '';
                const studentEmail = enrollment.userId?.email?.toLowerCase() || '';
                const courseTitle = enrollment.courseId?.courseTitle?.toLowerCase() || '';
                const searchTerm = search.toLowerCase();
                
                return studentName.includes(searchTerm) || 
                       studentEmail.includes(searchTerm) || 
                       courseTitle.includes(searchTerm);
            });
        }
        
        // Get total count for pagination (only completed purchases)
        const totalEnrollments = search ? filteredEnrollments.length : await CoursePurchase.countDocuments({ status: 'completed' });
        const totalPages = Math.ceil(totalEnrollments / limit);
        
        // Transform data for frontend
        const formattedEnrollments = filteredEnrollments.map(enrollment => ({
            _id: enrollment._id,
            student: enrollment.userId,
            course: enrollment.courseId,
            enrollmentDate: enrollment.createdAt,
            status: 'active'
        }));
        
        return res.status(200).json({
            success: true,
            enrollments: formattedEnrollments,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEnrollments,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get enrollments"
        });
    }
};

export const getAdminCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        // Get course with all details
        const course = await Course.findById(courseId)
            .populate('creator', 'name email')
            .populate('lectures');
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // Get enrollment details (only completed purchases)
        const enrollments = await CoursePurchase.find({ 
            courseId, 
            status: 'completed' 
        })
            .populate('userId', 'name email createdAt')
            .sort({ createdAt: -1 });
        
        // Calculate analytics
        const totalRevenue = enrollments.length * course.coursePrice;
        const enrollmentsByMonth = {};
        
        enrollments.forEach(enrollment => {
            const month = enrollment.createdAt.toISOString().slice(0, 7); // YYYY-MM
            enrollmentsByMonth[month] = (enrollmentsByMonth[month] || 0) + 1;
        });
        
        return res.status(200).json({
            success: true,
            course: {
                ...course.toObject(),
                enrollments: enrollments.map(e => ({
                    _id: e._id,
                    student: e.userId,
                    enrollmentDate: e.createdAt
                })),
                analytics: {
                    totalEnrollments: enrollments.length,
                    totalRevenue,
                    enrollmentsByMonth
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to get course details"
        });
    }
};