import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../../../slices/authSlice";
import { loginUser } from "../../../services/userService";

const LoginForm = ({ setForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthtenticated, setIsAuthenticated] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Check for OAuth error parameters on component mount
  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError) {
      setError(decodeURIComponent(oauthError));
     
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      alert("Error: Email address is required");
      return;
    }
    if (!emailRegex.test(email)) {
      alert("Error: Please enter a valid email address");
      return;
    }
    // Validate password
    if (!password) {
      alert("Error: Password is required");
      return;
    }
    if (password.length < 6) {
      alert("Error: Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    try {
      // Call the loginUser service function
      const res = await loginUser(email, password);
      console.log(res);
      const { userId, role } = res; // Expecting backend to send userId and role
      dispatch(login({ userId, role })); 
      navigate(role === "admin" ? "/admin/dashboard" : "/user/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      alert(`Error: ${err.response?.data?.message || "Login failed"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div
      className="flex min-h-full bg-gradient-to-r from-gray-700 via-gray-500 to-gray-600 p-5 w-full justify-center items-center"
      // style={{
      //   backgroundImage: `url('https://as1.ftcdn.net/v2/jpg/00/95/63/36/1000_F_95633689_oBuCYmHIFSabh2y8cfAoSLIsgjW7VXAA.jpg')`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className=" w-2xl relative"
      >

        <motion.div
          className="bg-white z-10 overflow-hidden"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8 border border-gray-400 rounded-2xl">
            <div className="flex justify-center ">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <User className="w-6 h-6 text-black mr-2" />
                  <h2 className="text-2xl font-bold  text-black tracking-tight">
                    Welcome Back
                  </h2>
                </div>
                <h1 className="text-3xl font-bold text-black">Sign In</h1>
              </div>
            </div>

            {/* Error display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6  text-center text-red-500 bg-red-50 border border-red-200 p-4 "
              >
                {error}
              </motion.div>
            )}

            {/* Login Form */}
            <motion.form
              onSubmit={handleLogin}
              className="space-y-6 max-w-lg mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  className="block text-gray-700 mb-2 flex items-center"
                  htmlFor="password"
                >
                  <Lock className="w-5 h-5 text-gray-600 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
              </motion.div>

              <motion.div
                className="flex justify-between items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.span
                  whileHover={{ scale: 1.05, color: "#000" }}
                  onClick={() => setForgotPassword(true)}
                  className="text-sm cursor-pointer text-gray-500 hover:text-black transition-colors"
                >
                  Forgot your password?
                </motion.span>
              </motion.div>

              <motion.button
                type="submit"
                className="w-full rounded-md cursor-pointer bg-black text-white py-3 transition-all duration-300 disabled:opacity-50 "
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </motion.button>
            </motion.form>

            {/* Sign Up Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-gray-500"
            >
              Don't have an account?{" "}
              <motion.span
                whileHover={{ scale: 1.05, color: "#000" }}
                onClick={() => navigate("/signup")}
                className="text-black font-medium hover:underline cursor-pointer transition-all"
              >
                Sign up
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
                onClick={handleGoogleLogin}
                className="w-full gap-3 flex items-center justify-center rounded-md py-3 border border-gray-300 hover:bg-gray-50 transition-all duration-300 "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src="https://brandlogo.org/wp-content/uploads/2024/05/Google-G-Logo-300x300.png.webp"
                  alt="Google Logo"
                  width={24}
                  className="mr-2"
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
