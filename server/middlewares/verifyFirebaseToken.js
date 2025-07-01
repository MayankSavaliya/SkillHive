import { adminAuth } from '../config/firebase.js';
import { User } from '../models/user.model.js';

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Check if Firebase Admin is available
    if (!adminAuth) {
      return res.status(503).json({
        success: false,
        message: 'Firebase authentication service is not available. Please contact administrator.'
      });
    }

    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No valid token provided.'
      });
    }

    // Verify Firebase token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // Find or create user in database
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        firebaseUid: decodedToken.uid,
        name: decodedToken.name || 'Unknown User',
        email: decodedToken.email,
        photoUrl: decodedToken.picture || null,
        role: 'student' // default role
      });
    }
    
    req.id = user._id.toString();
    req.firebaseUid = decodedToken.uid;
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export default verifyFirebaseToken;
