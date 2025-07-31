import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";
import NotificationService from "../services/notificationService.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    let courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    }).populate("courseId");

    const courseDetails = await Course.findById(courseId).populate("lectures");

    if (!courseDetails) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    if (!courseProgress) {
      return res.status(200).json({
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    return res.status(200).json({
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// lecture progress update karva mate
export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.user._id;

    
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (lecture) => lecture.lectureId === lectureId
    );

    let lectureJustCompleted = false;

    if (lectureIndex !== -1) {
      if (!courseProgress.lectureProgress[lectureIndex].viewed) {
        courseProgress.lectureProgress[lectureIndex].viewed = true;
      }
    } else {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }
    lectureJustCompleted = true;

    const lectureProgressLength = courseProgress.lectureProgress.filter(
      (lectureProg) => lectureProg.viewed
    ).length;

    const course = await Course.findById(courseId).populate('creator', 'name');
    let courseJustCompleted = false;

    if (course.lectures.length === lectureProgressLength && !courseProgress.completed) {
      courseProgress.completed = true;
      courseJustCompleted = true;
    }

    await courseProgress.save();

    // notification send karva mate
    if (lectureJustCompleted) {
      const student = await User.findById(userId);
      const lecture = course.lectures.find(l => l._id.toString() === lectureId);
      
      // Notify instructor about lecture completion
      await NotificationService.createNotification({
        recipientId: course.creator._id,
        senderId: userId,
        title: "Lecture Completed!",
        message: `${student.name} completed "${lecture?.lectureTitle || 'a lecture'}" in ${course.courseTitle}`,
        data: {
          courseId: course._id,
          lectureId: lectureId,
          studentId: userId
        },
        actionUrl: `/instructor/course/${course._id}`,
        category: 'progress'
      });
    }

    // 🔔 Send notifications for course completion and certificate
    if (courseJustCompleted) {
      const student = await User.findById(userId);
      
      // Congratulations notification to student
      await NotificationService.createNotification({
        recipientId: userId,
        senderId: course.creator._id,
        title: "🎉 Course Completed!",
        message: `Congratulations! You've completed "${course.courseTitle}". Your certificate is ready!`,
        data: {
          courseId: course._id,
          certificateGenerated: true
        },
        actionUrl: `/course-progress/${course._id}/certificate`,
        category: 'achievement'
      });

      // Notify instructor about course completion
      await NotificationService.createNotification({
        recipientId: course.creator._id,
        senderId: userId,
        title: "Student Completed Course!",
        message: `${student.name} has successfully completed "${course.courseTitle}" and earned their certificate!`,
        data: {
          courseId: course._id,
          studentId: userId,
          certificateGenerated: true
        },
        actionUrl: `/instructor/course/${course._id}`,
        category: 'progress'
      });
    }

    return res.status(200).json({
      message: "Lecture progress updated successfully.",
      courseCompleted: courseJustCompleted
    });
  } catch (error) {
    console.log(error);
  }
};


export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });

    const wasAlreadyCompleted = courseProgress.completed;

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();

    // notification send karva mate
    if (!wasAlreadyCompleted) {
      const course = await Course.findById(courseId).populate('creator', 'name');
      const student = await User.findById(userId);
      
      //student ne notification send karva mate
      await NotificationService.createNotification({
        recipientId: userId,
        senderId: course.creator._id,
        title: "Course Completed!",
        message: `Congratulations! You've completed "${course.courseTitle}". Your certificate is ready!`,
        data: {
          courseId: course._id,
          certificateGenerated: true
        },
        actionUrl: `/course-progress/${course._id}/certificate`,
        category: 'achievement'
      });

      //instructor ne notification send karva mate
      await NotificationService.createNotification({
        recipientId: course.creator._id,
        senderId: userId,
        title: "Student Completed Course!",
        message: `${student.name} has successfully completed "${course.courseTitle}" and earned their certificate!`,
        data: {
          courseId: course._id,
          studentId: userId,
          certificateGenerated: true
        },
        actionUrl: `/instructor/course/${course._id}`,
        category: 'progress'
      });
    }

    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.log(error);
  }
};


//akaha course ne Incomplete karva mate
export const markAsInCompleted = async (req, res) => {
    try {
      const { courseId } = req.params;
      const userId = req.user._id;
  
      const courseProgress = await CourseProgress.findOne({ courseId, userId });
      if (!courseProgress)
        return res.status(404).json({ message: "Course progress not found" });
  
      courseProgress.lectureProgress.map(
        (lectureProgress) => (lectureProgress.viewed = false)
      );
      courseProgress.completed = false;
      await courseProgress.save();
      return res.status(200).json({ message: "Course marked as incompleted." });
    } catch (error) {
      console.log(error);
    }
  };
