const jwt = require("jsonwebtoken");

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    try {
      const verified = jwt.verify(accessToken, process.env.ACCESS_SECRET);
      const now = new Date().getTime() / 1000;

      if (verified.exp && verified.exp < now) {
        return res.status(401).json({ message: "Token expired" });
      }

      req.user = verified;
      if (allowedRoles.length > 0 && !allowedRoles.includes(verified.role)) {
        return res.status(403).json({ message: "Forbidden: Access denied" });
      }

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Token expired" });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res.status(500).json({ message: "Authentication error" });
    }
  };
};

module.exports = authMiddleware;
