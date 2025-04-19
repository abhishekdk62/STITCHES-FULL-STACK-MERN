import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { sendOTP, updatePassword, verifyOTP } from "../../services/userService";
import { motion } from "framer-motion";
import { KeyRound, Mail, Shield,EyeOff ,CheckCircle,Lock,Eye    } from "lucide-react";
const ForgotPassword = ({ setForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOTP = async () => { 
    try {
      await sendOTP(email);
      setOtpSent(true);
      setMessage("OTP sent successfully. Check your email.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const data = await verifyOTP(email, otp);
      if (data.success) {
        setOtpVerified(true);
        setMessage("OTP verified successfully.");
      } else {
        setMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Error verifying OTP");
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      const data = await updatePassword(email, password);
      setMessage(data.message);
      setTimeout(() => {
        setForgotPassword(false);
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating password");
    }
  };



  return (
    <div
      className="flex min-h-full p-35 w-full justify-center items-center"
      style={{
        backgroundImage: `url('https://as1.ftcdn.net/v2/jpg/00/95/63/36/1000_F_95633689_oBuCYmHIFSabh2y8cfAoSLIsgjW7VXAA.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-2xl relative"
      >
        <motion.div
          className="bg-white z-10 overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-15 border rounded-2xl">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6 text-black mr-2" />
                  <h2 className="text-2xl font-bold text-black tracking-tight">
                    Reset Your Password
                  </h2>
                </div>
              </div>
            </div>
  
            {/* Error display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center text-red-500 bg-red-50 border border-red-200 p-4 rounded-lg"
              >
                {message}
              </motion.div>
            )}
  
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 max-w-lg mx-auto"
            >
              <div>
                <label
                  className="block text-gray-700 mb-2 flex items-center"
                  htmlFor="email"
                >
                  <Mail className="w-5 h-5 text-gray-600 mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                />
              </div>
  
              <motion.button
                onClick={handleSendOTP}
                className="w-full rounded-md cursor-pointer bg-black text-white py-3 transition-all duration-300 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Send OTP
              </motion.button>
            </motion.div>
  
            {/* OTP Input */}
            {otpSent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 space-y-6 max-w-lg mx-auto"
              >
                <div>
                  <label
                    className="block text-gray-700 mb-2 flex items-center"
                    htmlFor="otp"
                  >
                    <Shield className="w-5 h-5 text-gray-600 mr-2" />
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  />
                </div>
  
                <motion.button
                  onClick={handleVerifyOTP}
                  className="w-full rounded-md cursor-pointer bg-black text-white py-3 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verify OTP
                </motion.button>
  
                {!otpVerified && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 text-sm"
                  >
                    Verify OTP to enable password reset
                  </motion.p>
                )}
              </motion.div>
            )}
  
            {/* Password Reset Fields */}
            {otpVerified && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 space-y-6 max-w-lg mx-auto"
              >
                <div className="relative">
                  <label
                    className="block text-gray-700 mb-2 flex items-center"
                    htmlFor="password"
                  >
                    <Lock className="w-5 h-5 text-gray-600 mr-2" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    />
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </motion.span>
                  </div>
                </div>
  
                <div className="relative">
                  <label
                    className="block text-gray-700 mb-2 flex items-center"
                    htmlFor="confirmPassword"
                  >
                    <CheckCircle className="w-5 h-5 text-gray-600 mr-2" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    />
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </motion.span>
                  </div>
                </div>
  
                <motion.button
                  onClick={handleResetPassword}
                  className="w-full rounded-md cursor-pointer bg-black text-white py-3 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset Password
                </motion.button>
              </motion.div>
            )}
  
            {/* Login Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-gray-500"
            >
              Remembered your password?{" "}
              <motion.span
                whileHover={{ scale: 1.05, color: "#000" }}
                onClick={() => navigate("/login")}
                className="text-black font-medium hover:underline cursor-pointer transition-all"
              >
                Sign in
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
