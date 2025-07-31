import verifyFirebaseToken from './verifyFirebaseToken.js';


export const verifyFirebaseAdmin = async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      verifyFirebaseToken(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required."
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

export default verifyFirebaseAdmin;
