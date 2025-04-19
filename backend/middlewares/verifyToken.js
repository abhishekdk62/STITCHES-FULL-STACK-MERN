const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const token = req.cookies?.token; 
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    try {
      const verified = jwt.verify(token, process.env.SECRET_KEY); 
      req.user = verified; 
      

      if (allowedRoles.length > 0 && !allowedRoles.includes(verified.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();  
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;



// const jwt = require("jsonwebtoken");
// const generateToken = require("../utils/generateToken");

// const authMiddleware = (allowedRoles = []) => {
//   return async (req, res, next) => {
//     let accessToken = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

//     if (!accessToken) {
//       return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     try {
//       const verified = jwt.verify(accessToken, process.env.SECRET_KEY);
//       req.user = verified;
//       if (allowedRoles.length > 0 && !allowedRoles.includes(verified.role)) {
//         return res.status(403).json({ message: "Forbidden: Access denied" });
//       }
//       next();
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         const refreshToken = req.cookies?.refreshToken;
//         if (!refreshToken) {
//           return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
//         }
//         try {
//           const decodedRefresh = jwt.verify(refreshToken, process.env.SECRET_KEY);
//           const newAccessToken = generateToken(decodedRefresh.id, decodedRefresh.role, "access");
          
//           res.cookie("token", newAccessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "strict",
//             maxAge: 60 * 60 * 1000, // 1 hour
//           });
          
//           const newVerified = jwt.verify(newAccessToken, process.env.SECRET_KEY);
//           req.user = newVerified;
//           if (allowedRoles.length > 0 && !allowedRoles.includes(newVerified.role)) {
//             return res.status(403).json({ message: "Forbidden: Access denied" });
//           }
//           next();
//         } catch (refreshError) {
//           return res.status(403).json({ message: "Invalid or expired refresh token" });
//         }
//       } else {
//         return res.status(403).json({ message: "Invalid access token" });
//       }
//     }
//   };
// };

// module.exports = authMiddleware;
