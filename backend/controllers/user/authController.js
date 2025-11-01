const User = require("../../models/userSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library"); // Added for verifying Google token

const OTPModel = require("../../models/otpSchema");

const Referal = require("../../models/referalSchema");
const generateToken = require("../../utils/generateToken");
const sendEmail = require("../../utils/sendMail");

const signupOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user=await User.findOne({email})
    if(user)
    {
      return res.status(402).json({ message:"User already exist"})
    }
    const otp = crypto.randomInt(100000, 999999);
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    await OTPModel.findOneAndUpdate(
      { email },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );
    await sendEmail(
      email,
      "Email Verification OTP expiring in 5 minutes",
      otp.toString()
    );
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

const verifySignupOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTPModel.findOne({ email });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "OTP not found. Please request a new one." });
    }
    if (otpRecord.otp !== otp || otpRecord.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    await OTPModel.deleteOne({ email });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { email, name, phone, password, referralCode } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const existingNum = await User.findOne({ phone: phone });
    if (existingNum) {
      return res.status(400).json("Phone Number already registeed");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const generatedReferalCode = Math.random()
      .toString(36)
      .slice(2, 10)
      .toUpperCase();
    const newUser = new User({
      email,
      firstname: name,
      lastname: "",
      phone,
      password: hashedPassword,
      role: "user",
      referalCode: generatedReferalCode,
    });
    await newUser.save();
    if (referralCode) {
      const refUser = await User.findOne({ referalCode: referralCode });
      if (!refUser) {
        return res.status(400).json("Invalid referral code");
      }
      const code = Math.random().toString(32).slice(2, 6).toUpperCase();

      const codeString = "REF" + code;

      const daysToAdd = 30;

      const expiryDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

      const refer = new Referal({
        uid: refUser._id,
        usedById: newUser._id,
        code: codeString,
        expiryDate,
      });
      await refer.save();
    }

    const accessToken = generateToken(
      newUser._id,
      newUser.role,
      process.env.ACCESS_SECRET,
      "15m"
    );
    const refreshToken = generateToken(
      newUser._id,
      newUser.role,
      process.env.REFRESH_SECRET,
      "7d"
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none", 

      maxAge: Number(process.env.ACCESS_TOKEN_MAX_AGE),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: Number(process.env.REFRESH_TOKEN_MAX_AGE),
    });
    res.status(201).json({
      message: "Signup successful",
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during signup", error: error.message });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email not found. Please sign up first." });
    }

    const otp = crypto.randomInt(100000, 999999);
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    await User.findOneAndUpdate({ email }, { otp, otpExpiry }, { new: true });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (Date.now() > user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful verification
    await User.findOneAndUpdate(
      { email },
      { $unset: { otp: 1, otpExpiry: 1 } }
    );

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email },
      { password: hashedPassword, otp: null, otpExpiry: null }
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating password", error: error.message });
  }
};
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const verifyEmailOtp = async (req, res) => {
  try {
    const { newEmail, otp } = req.body;
    const userId = req.user.id;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required." });
    }
    if (!otp) {
      return res.status(400).json({ message: "OTP is required." });
    }

    // Check if the new email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Validate OTP
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Update the user's email and clear OTP fields
    user.email = newEmail;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Email updated successfully." });
  } catch (error) {
    console.error("Error in requestEmailChange:", error);
    res
      .status(500)
      .json({ message: "Error updating email", error: error.message });
  }
};
const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const userId = req.user.id;
    if (!newEmail) {
      return res.status(400).json({ message: "New email is required." });
    }
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }
    const otpCode = crypto.randomInt(100000, 999999).toString();

    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    await User.findByIdAndUpdate(userId, { otp: otpCode, otpExpiry });
    await sendEmail(
      newEmail,
      "Email Change OTP",
      `Your OTP code is: ${otpCode}. It will expire in 5 minutes.`
    );
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in requestEmailChange:", error);
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
};

module.exports = {
  signupOTP,
  verifySignupOTP,
  signup,
  sendOTP,
  verifyOTP,
  resetPassword,
  changePassword,
  verifyEmailOtp,
  requestEmailChange,
};
