import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../../../slices/authSlice"; // Import the logout action
import axios from 'axios'
import {User} from 'lucide-react'
import { logoutAdmin } from "../../../services/userService";
const   Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await logoutAdmin();
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <div>
      <nav className="flex items-center justify-between p-4 bg-white text-black">
      <span className=" flex ml-4 mt-3 items-center">
              {/* <img src="/images/logo.png" className="h-15 w-30" alt="" /> */}
              <h3
                style={{ fontFamily: "'Bayon', sans-serif" }}
                className="tracking-tighter text-2xl"
              >
                STITCHES
              </h3>
              <img
                className="h-9 w-9"
                src="https://static.thenounproject.com/png/626032-200.png"
                alt=""
              />
            </span>

        {/* Search Bar and Buttons */}
        <div className="flex items-center space-x-4">
        

          {/* Conditional Rendering */}
          {isAuthenticated ? (
           <div className="flex justify-center items-center gap-2"> ADMIN<User />
           <button
             onClick={handleLogout}
             className="px-4 py-2 border bg-black text-white rounded-full hover:bg-white hover:text-black transition-colors"
           >
             Logout
           </button></div>
          ) : (
            // If the user is not logged in, show the Log In and Sign Up buttons
            <>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-white hover:text-black border transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-white text-black rounded-full hover:bg-black hover:text-white border transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/user/home")}
                className="px-4 py-2 bg-black text-white rounded-full hover:bg-white hover:text-black border transition-colors"
              >
                Guest
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Horizontal Rule */}
      <hr className="border-gray-300" />
    </div>
  );
};

export default Header;