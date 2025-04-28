import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { FaHeart, FaUser, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../../../slices/authSlice";
import { setSearchTerm } from "../../../../slices/searchSlice";
import {
  fetchCategoriesForFilter,
  logoutUser,
} from "../../../services/userService";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, LogOut, Settings, LogIn, UserPlus } from "lucide-react";

import { setSelectedTab } from "../../../../slices/selectedTabSlice";

function UserModal({ open, onClose, onLogout }) {
  const userDetails = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  return (
    <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/50 flex items-start justify-end p-2 md:p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.4 }}
          className="bg-white w-full h-full shadow-lg rounded-2xl overflow-hidden max-w-[16rem] md:max-w-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 md:p-6 h-full flex flex-col">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex justify-between items-center mb-4 md:mb-6"
            >
              <div className="font-bold text-base md:text-lg flex items-center">
                <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600 mr-2" />
                {isAuthenticated
                  ? userDetails?.firstname.toUpperCase()
                  : 'GUEST'}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-900 flex items-center text-sm md:text-base focus:outline-none"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </motion.div>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Authenticated Actions */}
            {isAuthenticated ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-4 md:space-y-6 mt-4 flex-grow"
              >
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02, backgroundColor: '#f3f4f6' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/user/account')}
                  className="text-gray-700 flex items-center w-full py-2 md:py-3 px-3 md:px-4 rounded-lg text-sm md:text-base transition-all duration-200"
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  My Account
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="w-full block bg-black text-white text-center py-2 md:py-3 rounded-lg flex items-center justify-center text-sm md:text-base transition-all duration-300 hover:bg-gray-800"
                >
                  <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Logout
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="space-y-6 md:space-y-8 mt-2 flex-grow"
              >
                {/* Login */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <p className="text-center text-sm md:text-base text-black mb-2">Do you have an account?</p>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/')}
                    className="w-full block bg-black text-white text-center py-2 md:py-3 rounded-lg flex items-center justify-center text-sm md:text-base transition-all duration-300 hover:bg-white hover:text-black border"
                  >
                    <LogIn className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Log In
                  </motion.button>
                </motion.div>

                {/* OR Divider */}
                <div className="flex items-center my-2 md:my-4">
                  <hr className="flex-grow border-gray-300" />
                  <span className="mx-2 text-xs md:text-sm text-gray-500">OR</span>
                  <hr className="flex-grow border-gray-300" />
                </div>

                {/* Sign Up */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/signup')}
                    className="w-full block text-black text-center py-2 md:py-3 rounded-lg flex items-center justify-center text-sm md:text-base border border-black bg-white hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <UserPlus className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Sign Up
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>

  );
}

const Header = ({ selectedCategory, setSelectedCategory }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const dropdownRef = useRef(null);
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const userDetails = useSelector((state) => state.auth.user);
  const [categoryList, setCategoryList] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [modifiedCategoryList, setModifiedCategoryList] = useState([]);
  // Animation for logo
  const logoHover = () => {
    return {
      scale: 1.05,
      transition: { duration: 0.2 },
    };
  };
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategoriesForFilter("");
        setCategoryList(data);

        console.log(data);
      } catch (error) {
        console.error("Failed to fetch categories. Please try again", error);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    {
      setModifiedCategoryList([
        { name: "SHOP", id: "shop123" },
        ...categoryList,
      ]);
    }
  }, [categoryList]);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (showSearch && searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearch]);
  

  return (
    <div className="relative bg-white">
      {/* Mobile layout (below md breakpoint) */}
      <div className="[@media(min-width:450px)]:hidden">
        <nav className="flex items-center p-1 md:p-2 relative">
          <div className="flex items-center justify-between w-full">
       

            <a
              onClick={() => {
                dispatch(setSelectedTab("cart"));
                navigate("/user/account");
              }}
              className="cursor-pointer p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
            >
              <FaShoppingCart className="h-3 w-3" />
            </a>
            
            <div className="flex items-center space-x-4">
              <a
                onClick={() => {
                  dispatch(setSelectedTab("wishlist"));
                  navigate("/user/account");
                }}
                className="p-2 cursor-pointer rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
              >
                <FaHeart className="h-3 w-3" />
              </a>
            </div>

            <div
              className="relative group cursor-pointer"
              onClick={() => navigate("/user/home")}
            >
              <span className="flex items-center">
                <h3
                  style={{ fontFamily: "'Bayon', sans-serif" }}
                  className="text-xl tracking-tighter"
                >
                  STITCHES
                </h3>
                <img
                  className="h-6 w-6 hidden [@media(min-width:450px)]:block"
                  src="https://static.thenounproject.com/png/626032-200.png"
                  alt=""
                />
              </span>
            </div>
            
            <div>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300"
              >
                <Search className="h-3 w-3" />
              </button>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className={
                  !isAuthenticated || !userDetails?.profileImage
                    ? "p-2 cursor-pointer rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
                    : "cursor-pointer transition-all duration-300 hover:scale-110 transform"
                }
              >
                {isAuthenticated && userDetails?.profileImage ? (
                  <img
                    src={userDetails?.profileImage}
                    className="h-8 w-8 rounded-full border-2 border-transparent hover:border-gray-400 transition-all duration-300"
                    alt="User Profile"
                  />
                ) : (
                  <FaUser />
                )}
              </button>
              <UserModal
                open={open}
                onClose={() => setOpen(false)}
                onLogout={handleLogout}
              />
            </div>
        
          </div>

          {showSearch && (
            <div className="absolute top-11 left-0 w-full bg-white px-4 z-50">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    dispatch(setSearchTerm(e.target.value));
                    navigate("/products");
                  }}
                  placeholder="Search"
                  className="w-full text-sm pl-10 pr-10 py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-white transition-all duration-200 placeholder:tracking-tight"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <button
                    ref={searchRef}

                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 w-4 h-4  top-1/2 transform cursor-pointer -translate-y-1/2 text-gray-500 hover:text-black transition-colors duration-200"
                >
                  &#x2715;
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Desktop layout (md breakpoint and above) */}
      <div className="hidden [@media(min-width:450px)]:block">
        <nav className="flex items-center justify-between p-4 relative">
          {/* Left Section */}
          <div className="flex ml-4 mt-3 items-center">
            <div
              className="text-2xl relative group cursor-pointer"
              onClick={() => navigate("/user/home")}
            >
              <span className="flex items-center">
                <h3
                  style={{ fontFamily: "'Bayon', sans-serif" }}
                  className="tracking-tighter"
                >
                  STITCHES
                </h3>
                <img
                  className="h-9 w-9"
                  src="https://static.thenounproject.com/png/626032-200.png"
                  alt=""
                />
              </span>
            </div>
          </div>

          {/* Center Search */}
          <div className=" ">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  dispatch(setSearchTerm(e.target.value));
                  navigate("/products");
                }}
                placeholder="Search"
                className="w-37 [@media(min-width:533px)]:w-48  [@media(min-width:607px)]:w-full pl-10 pr-10 py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-white transition-all duration-200 placeholder:tracking-tight"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchTerm(""))}
                  className="absolute right-3 top-1/2 transform cursor-pointer -translate-y-1/2 text-gray-500 hover:text-black transition-colors duration-200"
                >
                  &#x2715;
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
         

            <a
              onClick={() => {
                dispatch(setSelectedTab("wishlist"));
                navigate("/user/account");
              }}
              className="p-2 cursor-pointer rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
            >
              <FaHeart className="h-5 w-5" />
            </a>
            <a
              onClick={() => {
                dispatch(setSelectedTab("cart"));
                navigate("/user/account");
              }}
              className="cursor-pointer p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
            >
              <FaShoppingCart className="h-5 w-5" />
            </a>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className={
                  !isAuthenticated || !userDetails?.profileImage
                    ? "p-2 cursor-pointer rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
                    : "cursor-pointer transition-all duration-300 hover:scale-110 transform"
                }
              >
                {isAuthenticated && userDetails?.profileImage ? (
                  <img
                    src={userDetails?.profileImage}
                    className="w-10 h-10 rounded-full border-2 border-transparent hover:border-gray-400 transition-all duration-300"
                    alt="User Profile"
                  />
                ) : (
                  <FaUser className="h-5 w-5" />
                )}
              </button>

              <UserModal
                open={open}
                onClose={() => setOpen(false)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </nav>
      </div>

      <nav className="flex items-center justify-center p-2 md:p-4 bg-white text-black">
        <div
          className="flex items-center space-x-6 font-sans overflow-x-auto scrollbar-hide"
          style={{ fontWeight: 600, transform: "scaleY(0.92)" }}
        >
          {modifiedCategoryList?.map((category, indx) => (
            <button
              key={indx}
              onClick={() => {
                setSelectedCategory(category._id);
                navigate("/products");
              }}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="text-black cursor-pointer md:text-[1rem] lg:text-lg sm:text-sm  text-xs uppercase whitespace-nowrap hover:text-black transition-all duration-300 relative"
            >
              {category.name}
              <span
                className={`absolute left-0 bottom-0 h-0.5 bg-black transition-all duration-300 ${
                  hoveredCategory === category ? "w-full" : "w-0"
                }`}
              ></span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Header;
