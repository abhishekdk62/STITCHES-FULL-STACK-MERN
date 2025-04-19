const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const generateToken = require("../utils/generateToken");
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

    // Generate token with user ID and role
    const token = generateToken(user._id, role);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Send userId and role separately in response
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      role: role
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     let user = await Admin.findOne({ email });
//     let role = user ? "admin" : "user";
//     if (!user) {
//       user = await User.findOne({ email });
//       if (!user) {
//         return res.status(400).json({ message: "Incorrect Email address" });
//       }
//       if (user.status !== "Active") {
//         return res.status(403).json({ message: "Your account is blocked. Contact support." });
//       }
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Incorrect Password" });
//     }

//     const accessToken = generateToken(user._id, role, "access");
//     const refreshToken = generateToken(user._id, role, "refresh");

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(200).json({
//       message: "Login successful",
//       accessToken,
//       userId: user._id,
//       role: role,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updateProfile = async (req, res) => {
  try {
    const { _id, status } = req.body;

    // Find user
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
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0), // Expire the cookie immediately
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const check = async (req, res) => {

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role === "user") {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (user.status !== "Active") { // using "Active" as stored in your database
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
