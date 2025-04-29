import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  sendOTP,
  updatePassword,
  verifyOTP,
} from '../../../services/userService';
import { motion } from 'framer-motion';
import {
  KeyRound,
  Mail,
  Shield,
  EyeOff,
  CheckCircle,
  Lock,
  Eye,
} from 'lucide-react';

const ForgotPassword = ({ setForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let intervalId;
    if (otpSent) {
      setSecondsLeft(300); // 5 * 60 seconds
      intervalId = setInterval(() => {
        setSecondsLeft((sec) => {
          if (sec <= 1) {
            clearInterval(intervalId);
            return 0;
          }
          return sec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [otpSent]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  const handleSendOTP = async () => {
    if (!email) {
      return setMessage('Please enter your email address.');
    }
    try {
      setLoading(true);
      await sendOTP(email);
      setOtpSent(true);
      setInfo('OTP sent successfully. Check your email.');
      setSecondsLeft(300);
      setLoading(false);
      setMessage(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending OTP');
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!otp) {
        return setMessage('Please enter the OTP sent to your email.');
      }
      const data = await verifyOTP(email, otp);
      if (data.success) {
        setOtpVerified(true);
        setMessage(null);
        setInfo('OTP verified successfully.');
      } else {
        setInfo(null);
        setMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.log(error);
      setInfo(null);
      setMessage(error.response?.data?.message || 'Error verifying OTP');
    }
  };

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setInfo(null);
      setMessage('Passwords do not match!');
      return;
    }
    try {
      const data = await updatePassword(email, password);
      setMessage(null);
      setInfo(data.message);
      setTimeout(() => {
        setForgotPassword(false);
      }, 2000);
    } catch (error) {
      setInfo(null);
      setMessage(error.response?.data?.message || 'Error updating password');
    }
  };

  return (
    <div className="flex bg-gray-200 min-h-full p-4 sm:p-6 w-full justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-md relative"
      >
        <motion.div
          className="bg-white z-10 rounded-lg overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-5 sm:p-6 border border-gray-300 rounded-lg">
            <div className="flex justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <KeyRound className="w-5 sm:w-6 h-5 sm:h-6 text-black mr-2" />
                  <h2 className="text-lg sm:text-xl font-bold text-black tracking-tight">
                    Reset Your Password
                  </h2>
                </div>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-center text-red-500 text-xs sm:text-sm"
              >
                {message}
              </motion.div>
            )}
            {info && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 text-center text-green-500 text-xs sm:text-sm"
              >
                {info}
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3 sm:space-y-5 max-w-sm mx-auto"
            >
              <div>
                <label
                  className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                  htmlFor="email"
                >
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm"
                />
              </div>

              <motion.button
                onClick={handleSendOTP}
                className="w-full rounded-md cursor-pointer bg-black text-white py-2 sm:py-3 transition-all duration-300 disabled:opacity-50 text-xs sm:text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </motion.button>
            </motion.div>

            {otpSent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 sm:mt-6 space-y-3 sm:space-y-5 max-w-sm mx-auto"
              >
                <div>
                  <label
                    className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                    htmlFor="otp"
                  >
                    <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm"
                  />
                  <div className="flex justify-end mt-1">
                    <p className="text-xs text-gray-500">
                      {secondsLeft > 0 ? (
                        <>Resend in {formatTimer(secondsLeft)}</>
                      ) : (
                        <span
                          onClick={handleSendOTP}
                          className="text-blue-500 cursor-pointer hover:underline"
                        >
                          Resend OTP
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={handleVerifyOTP}
                  className="w-full rounded-md cursor-pointer bg-black text-white py-2 sm:py-3 transition-all duration-300 text-xs sm:text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Verify OTP
                </motion.button>

                {!otpVerified && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 text-xs sm:text-sm"
                  >
                    Verify OTP to enable password reset
                  </motion.p>
                )}
              </motion.div>
            )}

            {otpVerified && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 sm:mt-6 space-y-3 sm:space-y-5 max-w-sm mx-auto"
              >
                <div className="relative">
                  <label
                    className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                    htmlFor="password"
                  >
                    <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm"
                    />
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    >
                      {showPassword ? (
                        <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                      ) : (
                        <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" />
                      )}
                    </motion.span>
                  </div>
                </div>

                <div className="relative">
                  <label
                    className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                    htmlFor="confirmPassword"
                  >
                    <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm"
                    />
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    >
                      {showConfirmPassword ? (
                        <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                      ) : (
                        <EyeOff className="w-4 sm:w-5 h-4 sm:h-5" />
                      )}
                    </motion.span>
                  </div>
                </div>

                <motion.button
                  onClick={handleResetPassword}
                  className="w-full rounded-md cursor-pointer bg-black text-white py-2 sm:py-3 transition-all duration-300 text-xs sm:text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Reset Password
                </motion.button>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 sm:mt-6 text-center text-gray-500 text-xs sm:text-sm"
            >
              Remembered your password?{' '}
              <motion.span
                whileHover={{ scale: 1.05, color: '#000' }}
                onClick={() => setForgotPassword(false)}
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
