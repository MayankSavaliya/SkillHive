import verifyFirebaseToken from './verifyFirebaseToken.js';


export const verifyFirebaseInstructor = async (req, res, next) => {
  try {

    await new Promise((resolve, reject) => {
      verifyFirebaseToken(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    if (!req.user || !["instructor", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Instructor role required."
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });
  }
};

export default verifyFirebaseInstructor;
