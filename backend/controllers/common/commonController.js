const bcrypt = require("bcrypt");
const Admin = require("../../models/adminSchema");
const User = require("../../models/userSchema");
const generateToken = require("../../utils/generateToken");
const jwt = require("jsonwebtoken");


const login = async (req, res) => { 
  try {
    const { email, password } = req.body;

    // Find user (Admin first, then User)
    let user = await Admin.findOne({ email });
    let role = user ? "admin" : "user";
    if (!user) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Incorrect Email address" });
      }
      if (user.status !== "Active") {
        return res.status(403).json({ message: "Your account is blocked. Contact support." });
      }
      
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

//generate token 

    const accessToken = generateToken(user._id, role,process.env.ACCESS_SECRET,"15m");
    const refreshToken = generateToken(user._id, role,process.env.REFRESH_SECRET,"7d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE), 
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE), 
    });

    
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      role: role
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { _id, status } = req.body;

  
    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update user status and return the updated document
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { status },
      { new: true } // This ensures you get the updated user back
    );

    res.json({ message: "Status updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken', { 
      httpOnly: true, 
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === "production" 
    });
    
    res.clearCookie('refreshToken', { 
      httpOnly: true, 
      sameSite: 'lax', 
      secure: process.env.NODE_ENV === "production" 
    });
    
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const check = async (req, res) => {

  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    if (decoded.role === "user") {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (user.status !== "Active") { 
        return res.status(403).json({ message: "Your account is blocked. Please sign in again." });
      }
    } 
    const user = await User.findById(decoded.id).populate("addresses");

    res.status(200).json({ userId: decoded.id, role: decoded.role ,user});
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};










module.exports = { login,logout,check, updateProfile };
