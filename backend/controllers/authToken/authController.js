const jwt = require('jsonwebtoken');
const generateToken = require("../../utils/generateToken")

const refreshToken =(req,res)=>{
  try {
    const refreshToken=req.cookies.refreshToken

    if(!refreshToken) {
      return res.status(401).json({ message: "Authorization denied - No refresh token provided" });
    }
    
    try {
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
      
      const accessToken = generateToken(
        decodedRefreshToken.id,
        decodedRefreshToken.role,
        process.env.ACCESS_SECRET,
        "15m"
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE), 
      });
      console.log("access token ",accessToken);
      console.log("refresh token",refreshToken);
      

      return res.status(200).json({ message: "Access token refreshed successfully!" });
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: "Refresh token has expired, please login again" });
      }
      return res.status(401).json({ message: "Invalid refresh token" });
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports={refreshToken}