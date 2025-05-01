import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login } from '../../../../slices/authSlice'; // Redux action for login
import {
  completeSignup,
  sendSignupOTP,
  verifySignupOTP,
} from '../../../services/userService';
import {
  UserPlus,
  User,
  Mail,
  Shield,
  Phone,
  Lock,
  EyeOff,
  Eye,
  Gift,
} from 'lucide-react';
import SplitText from '../../common/utils/SplitText';

const LoginForm = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [signUpError, setSognUpError] = useState(false);
  const dispatch = useDispatch();
  const [isRefOpen, setIsRefOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [verify, setVerify] = useState(false);
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
  const handleClick = () => {
    setIsRefOpen(!isRefOpen);
  };
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams]);

  // Step 1: Send OTP using Name & Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!name) {
      setSognUpError('Name is required');
      return;
    }
    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setSognUpError('Email address is required');
      return;
    }
    if (!emailRegex.test(email)) {
      setSognUpError('Please enter a valid email address');

      return;
    }

    setLoading(true);
    try {
      setOtpSent(false);
      const res = await sendSignupOTP(email);

      setOtpSent(true);
      
      
      setStep(2);

      toast.success('OTP has been sent to your email address!', {
        icon: (
          <img
            src="https://static.thenounproject.com/png/412945-200.png"
            className="animate-bounce"
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: '1px solid #0f5132',
          padding: '16px',
          color: 'white',
          background: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      });
      setSognUpError('');
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setVerify(true);
    try {
      if (!otp) {
        setError('OTP is required');
        return;
      }
      const res = await verifySignupOTP(email, otp);
      console.log('OTP verified:', res);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      console.log(err.response?.data);
    } finally {
      setError('');
      setVerify(false);
    }
  };

  // Step 3: Complete Signup with Phone & Password
  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const signupData = {
        email,
        name,
        phone: `+${phone}`,
        password,
        referralCode,
      };
      const res = await completeSignup(signupData);
      const { userId, role } = res; // Expecting userId and role from backend
      dispatch(login({ userId, role }));
      navigate(role === 'admin' ? '/admin/dashboard' : '/user/home');
    } catch (err) {
      console.log(err);

      setError(err.response?.data || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL
    }/auth/google`;
  };

  return (
    <div
      className="flex bg-gray-200 min-h-full p-4 sm:p-6 w-full justify-center items-center"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm sm:max-w-md relative"
      >
        <motion.div
          className="bg-white rounded-lg z-10 overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-5 sm:p-6 border rounded-lg">
            <div className="flex justify-center">
              <div className="text-center pb-4">
                <h1 className="text-lg sm:text-xl font-bold text-black">
                  Create an account
                </h1>
              </div>
            </div>

            {/* Error display */}
            {signUpError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-center text-red-400  p-3 rounded-md text-xs sm:text-sm"
              >
                {signUpError}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-center text-red-400  p-3 rounded-md text-xs sm:text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Step 1: Name & Email */}
            {step === 1 && (
              <motion.form className="space-y-3 sm:space-y-5 max-w-sm mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                    htmlFor="name"
                  >
                    <User className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                    htmlFor="email"
                  >
                    <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm"
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full rounded-md cursor-pointer bg-black text-white py-2 sm:py-3 transition-all duration-300 disabled:opacity-50 text-xs sm:text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </motion.button>
              </motion.form>
            )}

            {/* Step 2: Enter OTP */}
            {step === 2 && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-3 sm:space-y-5 max-w-sm mx-auto"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
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
                    placeholder="Enter the OTP"
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
                </motion.div>

                <motion.button
                  type="submit"
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full rounded-md cursor-pointer bg-black text-white py-2 sm:py-3 transition-all duration-300 disabled:opacity-50 text-xs sm:text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {verify
                    ? 'Verifying OTP...'
                    : loading
                      ? 'Sending OTP...'
                      : 'Verify OTP'}
                </motion.button>
              </motion.form>
            )}

            {/* Step 3: Phone & Password */}
            {step === 3 && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-3 sm:space-y-5 max-w-sm mx-auto"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <label
                    className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                    htmlFor="phone"
                  >
                    <Phone className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                    Phone
                  </label>
                  <PhoneInput
                    country={'in'}
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    inputProps={{
                      id: 'phone',
                      className:
                        'w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm',
                    }}
                    containerClass="w-full"
                    buttonStyle={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '0 8px',
                    }}
                    dropdownClass="bg-white shadow-lg rounded-lg"
                    inputStyle={{
                      width: '100%',
                      height: '100%',
                      paddingLeft: '48px',
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <label
                    className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                    htmlFor="password"
                  >
                    <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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
                </motion.div>

                <p
                  onClick={handleClick}
                  className="text-xs text-gray-500 hover:text-black cursor-pointer"
                >
                  Have a referal code?
                </p>

                {isRefOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <label
                      className="block text-gray-700 mb-1 sm:mb-2 flex items-center text-xs sm:text-sm"
                      htmlFor="referralCode"
                    >
                      <Gift className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2" />
                      Referral Code{' '}
                      <span className="ml-1 text-sm text-gray-400"></span>
                    </label>

                    <div className="relative mt-6">
                      <input
                        id="referralCode"
                        type="text"
                        placeholder="Enter referral code "
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm"
                      />
                    </div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  onClick={handleCompleteSignup}
                  disabled={loading}
                  className="w-full rounded-md cursor-pointer bg-black text-white py-2 sm:py-3 transition-all duration-300 disabled:opacity-50 text-xs sm:text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </motion.button>
              </motion.form>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 sm:mt-6 text-center text-gray-500 text-xs sm:text-sm"
            >
              Already have an account?{' '}
              <motion.span
                whileHover={{ scale: 1.05, color: '#000' }}
                onClick={() => navigate('/')}
                className="text-black font-medium hover:underline cursor-pointer transition-all"
              >
                Sign in
              </motion.span>
            </motion.p>

            <motion.div
              className="flex items-center my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-500">OR</span>
              <hr className="flex-grow border-gray-300" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-lg mx-auto"
            >
              <motion.button
                onClick={handleGoogleSignup}
                className="w-full  cursor-pointer  py-2 sm:py-3 transition-all duration-300 disabled:opacity-50 text-xs sm:text-sm gap-3 flex items-center justify-center rounded-md  border border-gray-300 hover:bg-gray-50 "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src="https://brandlogo.org/wp-content/uploads/2024/05/Google-G-Logo-300x300.png.webp"
                  alt="Google Logo"
                  width={24}
                  className="w-4 sm:w-5 h-4 sm:h-5 text-gray-600 mr-2"
                />
                <span className="text-gray-700 font-medium">
                  Continue With Google
                </span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
