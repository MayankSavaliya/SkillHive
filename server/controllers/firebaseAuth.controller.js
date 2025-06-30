import { User } from "../models/user.model.js";
import { adminAuth } from "../config/firebase.js";

export const firebaseAuth = async (req, res) => {
  try {
    // Check if Firebase Admin is available
    if (!adminAuth) {
      return res.status(503).json({
        success: false,
        message: "Firebase authentication service is not configured. Please set up Firebase Admin SDK."
      });
    }

    const { idToken, userData } = req.body;
    
    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token is required"
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    console.log("🔍 Firebase decoded token:", { uid, email, name, picture });
    console.log("🔍 User data from request:", userData);

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { firebaseUid: uid },
        { email: email }
      ]
    });

    if (user) {
      console.log("👤 Existing user found:", { 
        name: user.name, 
        photoUrl: user.photoUrl,
        email: user.email 
      });
      
      // Update existing user with Firebase UID if not present
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        await user.save();
      }
      
      // Update user info if provided
      if (userData?.name && userData.name !== user.name) {
        user.name = userData.name;
      }
      if (picture && picture !== user.photoUrl) {
        user.photoUrl = picture;
        console.log("📸 Updated user photoUrl to:", picture);
      }
      await user.save();
    } else {
      console.log("🆕 Creating new user with photoUrl:", picture);
      // Create new user
      user = await User.create({
        firebaseUid: uid,
        name: userData?.name || name || 'Unknown User',
        email: email,
        photoUrl: picture || "",
        role: 'student'
      });
    }

    // Return success response
    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photoUrl: user.photoUrl,
      isEmailVerified: user.isEmailVerified,
      enrolledCourses: user.enrolledCourses,
      requestedInstructor: user.requestedInstructor
    };
    
    console.log("📤 Sending user response:", responseUser);
    
    return res.status(200).json({
      success: true,
      user: responseUser,
      message: `🎊 Welcome ${user.name}! Ready to continue learning?`
    });

  } catch (error) {
    console.error('Firebase authentication error:', error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

export const firebaseSignup = async (req, res) => {
  try {
    // Check if Firebase Admin is available
    if (!adminAuth) {
      return res.status(503).json({
        success: false,
        message: "Firebase authentication service is not configured. Please set up Firebase Admin SDK."
      });
    }

    const { idToken, userData } = req.body;
    
    if (!idToken || !userData) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token and user data are required"
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { firebaseUid: uid },
        { email: email }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists. Please try logging in instead."
      });
    }

    // Create new user
    const user = await User.create({
      firebaseUid: uid,
      name: userData.name,
      email: email,
      photoUrl: userData.photoUrl || "",
      role: 'student'
    });

    return res.status(201).json({
      success: true,
      message: "🎉 Welcome to SkillHive! Your account has been created successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photoUrl: user.photoUrl
      }
    });

  } catch (error) {
    console.error('Firebase signup error:', error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating your account. Please try again."
    });
  }
};

export const firebaseLogout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to logout"
    });
  }
};
