import { adminAuth } from '../config/firebase.js';
import { User } from '../models/user.model.js';

export const verifyFirebaseToken = async (req, res, next) => {
  try {

    if (!adminAuth) {
      return res.status(503).json({
        success: false,
        message: 'Firebase admin is not available.'
      });
    }

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

    const decodedToken = await adminAuth.verifyIdToken(token);
    
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      user = await User.create({
        firebaseUid: decodedToken.uid,
        name: decodedToken.name || 'Unknown User',
        email: decodedToken.email,
        photoUrl: decodedToken.picture || null,
        role: 'student'
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
