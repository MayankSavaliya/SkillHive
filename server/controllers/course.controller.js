import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import notificationService from "../services/notificationService.js";
import {deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia} from "../utils/cloudinary.js";

export const createCourse = async (req,res) => {
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category) {
            return res.status(400).json({
                message:"Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator:req.user._id
        });

        return res.status(201).json({
            course,
            message:"Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}

export const searchCourse = async (req,res) => {
    try {
        const {query = "", categories = [], sortByPrice =""} = req.query;
        console.log(categories);
        
        // create search query
        const searchCriteria = {
            isPublished:true,
            $or:[
                {courseTitle: {$regex:query, $options:"i"}},
                {subTitle: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}},
            ]
        }

        // if categories selected
        if(categories.length > 0) {
            searchCriteria.category = {$in: categories};
        }

        // define sorting order
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;//sort by price in ascending
        }else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1; // descending
        }

        let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            success:true,
            courses: courses || []
        });

    } catch (error) {
        console.log(error);
        
    }
}

export const getPublishedCourse = async (_,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published courses"
        })
    }
}
export const getCreatorCourses = async (req,res) => {
    try {
        const userId = req.user._id;
        const courses = await Course.find({creator:userId});
        if(!courses){
            return res.status(404).json({
                courses:[],
                message:"Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}
export const editCourse = async (req,res) => {
    try {
        const courseId = req.params.courseId;
        const {courseTitle, subTitle, description, category, courseLevel, coursePrice, whatYouWillLearn, requirements, language} = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on clourdinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }

        // Parse JSON strings for arrays
        let parsedWhatYouWillLearn = [];
        let parsedRequirements = [];

        if (whatYouWillLearn) {
            try {
                parsedWhatYouWillLearn = JSON.parse(whatYouWillLearn);
            } catch (e) {
                // If parsing fails, split by newlines as fallback
                parsedWhatYouWillLearn = whatYouWillLearn.split('\n').filter(item => item.trim());
            }
        }

        if (requirements) {
            try {
                parsedRequirements = JSON.parse(requirements);
            } catch (e) {
                // If parsing fails, split by newlines as fallback
                parsedRequirements = requirements.split('\n').filter(item => item.trim());
            }
        }
 
        const updateData = {
            courseTitle, 
            subTitle, 
            description, 
            category, 
            courseLevel, 
            coursePrice, 
            courseThumbnail: courseThumbnail?.secure_url,
            whatYouWillLearn: parsedWhatYouWillLearn,
            requirements: parsedRequirements,
            language
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        course = await Course.findByIdAndUpdate(courseId, updateData, {new:true});

        return res.status(200).json({
            course,
            message:"Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update course"
        })
    }
}
export const getCourseById = async (req,res) => {
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId).populate("lectures");

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course by id"
        })
    }
}

export const createLecture = async (req,res) => {
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        };

        // Get the course to determine next lecture index
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }

        // Calculate next lecture index
        const nextIndex = course.lectures.length + 1;

        // create lecture with default values for new fields
        const lecture = await Lecture.create({
            lectureTitle,
            description: "",
            duration: "0:00", 
            lectureIndex: nextIndex
        });

        // Add lecture to course
        course.lectures.push(lecture._id);
        await course.save();

        return res.status(201).json({
            lecture,
            message:"Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        })
    }
}
export const getCourseLecture = async (req,res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lectures"
        })
    }
}
export const editLecture = async (req,res) => {
    try {
        const {lectureTitle, videoInfo, isPreviewFree, description, duration, lectureIndex} = req.body;
        
        const {courseId, lectureId} = req.params;
        
        console.log("Edit lecture request:", {
            lectureTitle,
            videoInfo,
            isPreviewFree,
            description,
            duration,
            lectureIndex,
            courseId,
            lectureId
        });
        
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }

        console.log("Current lecture before update:", lecture);

        const hadVideo = !!lecture.videoUrl;
        
        // update lecture
        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        if(isPreviewFree !== undefined) lecture.isPreviewFree = isPreviewFree;
        if(description !== undefined) lecture.description = description;
        if(duration) lecture.duration = duration;
        if(lectureIndex !== undefined) lecture.lectureIndex = lectureIndex;

        await lecture.save();
        
        console.log("Updated lecture:", lecture);

        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = await Course.findById(courseId).populate('creator', 'name');
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id);
            await course.save();
        };

        // 🔔 Send notification if video was just added (not just editing)
        if (!hadVideo && videoInfo?.videoUrl) {
            // Get enrolled students for this course
            const enrolledStudents = await CoursePurchase.find({
                courseId: courseId,
                status: "completed"
            }).distinct('userId');
            
            if (enrolledStudents.length > 0) {
                await notificationService.createBulkNotifications({
                    recipientIds: enrolledStudents,
                    senderId: req.user._id,
                    title: "New Lecture Available!",
                    message: `A new lecture "${lecture.lectureTitle}" has been added to ${course.courseTitle}`,
                    data: { 
                        courseId: course._id,
                        lectureId: lecture._id,
                        lectureTitle: lecture.lectureTitle
                    },
                    actionUrl: `/course-progress/${course._id}`
                });
            }
        }
        
        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lectures"
        })
    }
}
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures:lectureId}, // find the course that contains the lecture
            {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by id"
        })
    }
}


// publich unpublish course logic

export const togglePublishCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true, false
        const course = await Course.findById(courseId).populate('creator', 'name');
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            });
        }
        
        const wasPublished = course.isPublished;
        // publish status based on the query paramter
        course.isPublished = publish === "true";
        await course.save();

        // 🔔 Send notifications when course is newly published
        if (!wasPublished && course.isPublished) {
            // Get students who have enrolled in instructor's other courses
            const instructorCourses = await Course.find({ creator: req.user._id });
            const courseIds = instructorCourses.map(c => c._id);
            
            const enrolledStudents = await CoursePurchase.find({
                courseId: { $in: courseIds },
                status: "completed"
            }).distinct('userId');
            
            // Notify interested students about new course
            if (enrolledStudents.length > 0) {
                await notificationService.createBulkNotifications({
                    recipientIds: enrolledStudents,
                    senderId: req.user._id,
                    title: "New Course Available!",
                    message: `${course.creator.name} has published a new course: ${course.courseTitle}`,
                    data: { courseId: course._id },
                    actionUrl: `/course-detail/${course._id}`
                });
            }
        }

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message:`Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}

// Admin course management functions
export const getAllCoursesForAdmin = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category = '', status = '' } = req.query;
        const skip = (page - 1) * limit;

        // Build search query
        let query = {};
        if (search) {
            query.$or = [
                { courseTitle: { $regex: search, $options: 'i' } },
                { subTitle: { $regex: search, $options: 'i' } }
            ];
        }
        if (category && category !== 'all') {
            query.category = category;
        }
        if (status && status !== 'all') {
            query.isPublished = status === 'published';
        }

        const courses = await Course.find(query)
            .populate('creator', 'name email')
            .populate('lectures')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalCourses = await Course.countDocuments(query);
        const totalPages = Math.ceil(totalCourses / limit);

        return res.status(200).json({
            success: true,
            courses,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalCourses,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            },
            message: "All courses retrieved successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve courses"
        });
    }
};

export const toggleCourseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        course.isPublished = !course.isPublished;
        await course.save();
        
        return res.status(200).json({
            success: true,
            course,
            message: `Course ${course.isPublished ? 'published' : 'unpublished'} successfully`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to toggle course status"
        });
    }
};

export const deleteCourseByAdmin = async (req, res) => {
    try {
        const { courseId } = req.params;
        
        const course = await Course.findById(courseId).populate('lectures');
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }
        
        // Delete course thumbnail from cloudinary if exists
        if (course.courseThumbnail) {
            const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
            await deleteMediaFromCloudinary(publicId);
        }
        
        // Delete all lecture videos from cloudinary
        if (course.lectures && course.lectures.length > 0) {
            for (const lecture of course.lectures) {
                if (lecture.videoUrl) {
                    const publicId = lecture.videoUrl.split("/").pop().split(".")[0];
                    await deleteVideoFromCloudinary(publicId);
                }
            }
        }
        
        // Delete all lectures
        await Lecture.deleteMany({ _id: { $in: course.lectures } });
        
        // Delete the course
        await Course.findByIdAndDelete(courseId);
        
        return res.status(200).json({
            success: true,
            message: "Course and all associated content deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete course"
        });
    }
};

export const getCourseStats = async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();
        const publishedCourses = await Course.countDocuments({ isPublished: true });
        const draftCourses = await Course.countDocuments({ isPublished: false });
        
        // Get course enrollment stats
        const courseStats = await Course.aggregate([
            {
                $group: {
                    _id: null,
                    totalEnrollments: { $sum: { $size: "$enrolledStudents" } },
                    averagePrice: { $avg: "$coursePrice" },
                    totalRevenue: { 
                        $sum: { 
                            $multiply: ["$coursePrice", { $size: "$enrolledStudents" }] 
                        } 
                    }
                }
            }
        ]);
        
        console.log(courseStats);
        // Get top categories
        const topCategories = await Course.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        
        return res.status(200).json({
            success: true,
            stats: {
                totalCourses,
                publishedCourses,
                draftCourses,
                totalEnrollments: courseStats[0]?.totalEnrollments || 0,
                averagePrice: courseStats[0]?.averagePrice || 0,
                totalRevenue: courseStats[0]?.totalRevenue || 0,
                topCategories
            },
            message: "Course statistics retrieved successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve course statistics"
        });
    }
};
