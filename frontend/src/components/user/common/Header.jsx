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
          className="fixed inset-0 bg-black/50 flex items-start justify-end p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4,
            }}
            className="bg-white w-full max-w-xs h-full shadow-lg rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full flex flex-col">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex justify-between items-center mb-6"
              >
                <div className="font-bold text-lg flex items-center">
                  <User className="w-5 h-5 text-gray-600 mr-2" />
                  {isAuthenticated
                    ? userDetails?.firstname.toUpperCase()
                    : "Guest"}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-900 flex items-center text-sm focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </motion.div>

              <div className="border-t border-gray-200 my-2"></div>

              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="space-y-6  mt-6"
                >
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/user/account")}
                    className="text-gray-700 cursor-pointer hover:text-black flex items-center w-full py-3 px-4 rounded-lg text-sm transition-all duration-200"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    My Account
                  </motion.button>

                  <div className="mt-auto">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onLogout}
                      className="w-full block bg-black cursor-pointer text-center text-white py-3 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-gray-800"
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="space-y-8 mt-4 flex-grow"
                >
                  <div className="pt-3">
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-center text-black mb-4"
                    >
                      Do you have an Account?
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/")}
                      className="w-full block bg-black cursor-pointer text-center text-white py-3 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-white hover:text-black border"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Log In
                    </motion.button>
                  </div>

                  <div className="py-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center my-4"
                    >
                      <hr className="flex-grow border-gray-300" />
                      <span className="mx-4 text-gray-500">OR</span>
                      <hr className="flex-grow border-gray-300" />
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="text-center text-black mb-4"
                    >
                      Are you new here?
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/signup")}
                      className="w-full block cursor-pointer border border-black text-center text-black py-3 rounded-lg flex items-center justify-center bg-white hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Sign Up
                    </motion.button>
                  </div>
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
const [modifiedCategoryList,setModifiedCategoryList]=useState([])
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


useEffect(()=>{
    {

      setModifiedCategoryList([{name:"SHOP",id:"shop123"},...categoryList])
    }
},[categoryList])


  return (
    <div className="relative bg-white">
      {/* Header Section */}
      <nav className="flex items-center justify-between p-4 relative">
        {/* Left Section */}
        <div className="flex ml-4 mt-3 items-center">
          <div
            className="text-2xl relative group cursor-pointer"
            onClick={() => navigate("/user/home")}
          >
            <span className=" flex items-center">
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

        <div className="absolute left-1/2 transform -translate-x-1/2 w-[320px]">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                dispatch(setSearchTerm(e.target.value));
                navigate("/products");
              }}
              placeholder="Search"
              className="w-full pl-10 pr-10 py-2 border-b border-gray-300 focus:outline-none focus:border-black bg-white transition-all duration-200 placeholder:tracking-tight"
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

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <select className="bg-white text-black border-none focus:outline-none cursor-pointer hover:text-gray-700 transition-colors">
            <option>English (United States)</option>
          </select>

          {/* Icons */}
          <a
            onClick={() => {
              dispatch(setSelectedTab("wishlist"));
              navigate("/user/account");
            }}
            className="p-2 cursor-pointer rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
          >
            <FaHeart />
          </a>
          <a
            onClick={() => {
              dispatch(setSelectedTab("cart"));
              navigate("/user/account");
            }}
            className="cursor-pointer p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-110 transform"
          >
            <FaShoppingCart />
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
      </nav>
      <nav className="flex items-center justify-center p-4 bg-white text-black">
        {/* <div
          className="flex  items-center space-x-6 font-sans"
          style={{ fontWeight: 600, transform: "scaleY(0.92)" }}
        >
          {["SHOP"].map((category) => (
            <button
              key={category}
              onClick={() =>
                category === "SHOP" ? navigate("/products") : null
              }
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="text-black cursor-pointer hover:text-black transition-all duration-300 relative"
            >
              {category}
              <span
                className={`absolute left-0 bottom-0 h-0.5 bg-black transition-all duration-300 ${
                  hoveredCategory === category ? "w-full" : "w-0"
                }`}
              ></span>
            </button>
          ))}
        </div> */}
        <div
          className="flex  items-center space-x-6 font-sans"
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
              className="text-black cursor-pointer uppercase hover:text-black transition-all duration-300 relative"
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
