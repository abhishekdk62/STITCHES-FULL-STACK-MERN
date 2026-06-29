const bcrypt = require("bcrypt");
const Admin = require("../../models/adminSchema");
const User = require("../../models/userSchema");
const generateToken = require("../../utils/generateToken");
const { getCookieOptions } = require("../../utils/cookieOptions");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Admin.findOne({ email });
    let role = user ? "admin" : "user";
    if (!user) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      if (user.status !== "Active") {
        return res
          .status(403)
          .json({ message: "Your account is blocked. Contact support." });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = generateToken(user._id, role, process.env.ACCESS_SECRET, "15m");
    const refreshToken = generateToken(user._id, role, process.env.REFRESH_SECRET, "7d");

    const cookieOptions = getCookieOptions();

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
    });

    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      role: role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { _id, status } = req.body;

    if (!_id || !status) {
      return res.status(400).json({ message: "User ID and status are required" });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    ).select("-password -otp -otpExpiry");

    res.json({ message: "Status updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const cookieOptions = getCookieOptions();

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const check = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    if (decoded.role === "admin") {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).json({ message: "Admin not found" });
      }
      return res.status(200).json({
        userId: decoded.id,
        role: decoded.role,
        user: admin,
      });
    }

    const user = await User.findById(decoded.id)
      .select("-password -otp -otpExpiry")
      .populate("addresses");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.status !== "Active") {
      return res
        .status(403)
        .json({ message: "Your account is blocked. Please sign in again." });
    }

    res.status(200).json({ userId: decoded.id, role: decoded.role, user });
  } catch (error) {
    console.error("JWT Error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { login, logout, check, updateProfile };
