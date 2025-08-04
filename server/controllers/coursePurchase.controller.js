import Stripe from "stripe";
import { Course } from "../models/course.model.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import notificationService from "../services/notificationService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found!" });

    const newPurchase = new CoursePurchase({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100, 
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://www.skill-hive.live/course-detail/${courseId}`, 
      cancel_url: `https://www.skill-hive.live/course-detail/${courseId}`,  
      metadata: {
        courseId: courseId.toString(),
        userId: userId.toString(),
      },
      shipping_address_collection: {
        allowed_countries: ["IN"], 
      },
    });

    if (!session.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session" });
    }

    
    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      success: true,
      url: session.url, 
    });
  } catch (error) {
    console.log(error);
  }
};

export const stripeWebhook = async (req, res) => {
  let event;

  try {
    const payloadString = req.body.toString();
    const secret = process.env.WEBHOOK_ENDPOINT_SECRET;
    const signature = req.headers['stripe-signature'];

    event = stripe.webhooks.constructEvent(payloadString, signature, secret);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    console.log("check session complete is called");

    try {
      const session = event.data.object;

      const purchase = await CoursePurchase.findOne({
        paymentId: session.id,
      }).populate({ path: "courseId" });

      if (!purchase) {
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (session.amount_total) {
        purchase.amount = session.amount_total / 100;
      }
      purchase.status = "completed";

      if (purchase.courseId && purchase.courseId.lectures.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures } },
          { $set: { isPreviewFree: true } }
        );
      }

      await purchase.save();

      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }, 
        { new: true }
      );

      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }, 
        { new: true }
      );

      const student = await User.findById(purchase.userId);
      const course = purchase.courseId;
      
      await notificationService.createNotification({
        recipientId: course.creator,
        senderId: purchase.userId,
        title: "New Student Enrollment!",
        message: `${student.name} has enrolled in your course: ${course.courseTitle}`,
        data: {
          courseId: course._id,
          studentId: purchase.userId,
          amount: purchase.amount
        },
        actionUrl: `/instructor/course/${course._id}`
      });

      await notificationService.createNotification({
        recipientId: purchase.userId,
        senderId: course.creator,
        title: "Welcome to your new course!",
        message: `You've successfully enrolled in "${course.courseTitle}". Start learning now!`,
        data: {
          courseId: course._id
        },
        actionUrl: `/course-progress/${course._id}`
      });


    } catch (error) {
      console.error("Error handling event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(courseId).populate('creator', 'name').populate('lectures');
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
        
      });
    }

    // Check if user has purchased this course
    const purchased = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "completed"
    });

    return res.status(200).json({
      success: true,
      course,
      purchased: !!purchased
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course details"
    });
  }
};

export const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");
    if (!purchasedCourse) {
      return res.status(404).json({
        purchasedCourse: [],
      });
    }
    return res.status(200).json({
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
  }
};


