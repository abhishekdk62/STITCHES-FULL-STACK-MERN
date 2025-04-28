import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { User, Menu } from "lucide-react";
import { logout } from "../../../../slices/authSlice";
import { logoutAdmin } from "../../../services/userService";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
<header className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12 bg-white text-black p-4 sm:p-6 md:p-6 lg:p-6 xl:p-6 2xl:p-7">

<nav className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <h3
            style={{ fontFamily: "'Bayon', sans-serif" }}
            className="
              text-base       /* base */
              sm:text-lg      /* ≥640px */
              md:text-xl      /* ≥768px */
              lg:text-2xl     /* ≥1024px */
              xl:text-3xl     /* ≥1280px */
              2xl:text-4xl    /* ≥1536px */
            "
          >
            STITCHES
          </h3>
          <img
            className="
              h-6 w-6         /* base */
              sm:h-7 sm:w-7   /* ≥640px */
              md:h-8 md:w-8   /* ≥768px */
              lg:h-9 lg:w-9   /* ≥1024px */
              xl:h-10 xl:w-10 /* ≥1280px */
            "
            src="https://static.thenounproject.com/png/626032-200.png"
            alt="logo"
          />
        </div>

        {/* ── Full nav on ≥md (≥768px) ── */}
        <div className="
          hidden md:flex 
          items-center 
          space-x-2      /* base */
          md:space-x-4   /* ≥768px */
          lg:space-x-6   /* ≥1024px */
          xl:space-x-8   /* ≥1280px */
          2xl:space-x-10 /* ≥1536px */
        ">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2">
                ADMIN <User size={18} />
              </span>
              <button
                onClick={handleLogout}
                className="
                  px-3 py-1    /* base */
                  sm:px-4 sm:py-2
                  border bg-black text-white rounded-full
                  hover:bg-white hover:text-black transition-colors
                "
              >
                Logout
              </button>
            </>
          ) : (
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

        {/* ── Hamburger on <md (<768px) ── */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen((o) => !o)}
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* ── Mobile / Tablet Menu on <md ── */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 py-4 border-t">
          {isAuthenticated ? (
            <>
              <span className="flex items-center gap-2">
                ADMIN <User size={18} />
              </span>
              <button
                onClick={handleLogout}
                className="w-11/12 sm:w-3/4 px-4 py-2 border bg-black text-white rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/")}
                className="w-11/12 sm:w-3/4 px-4 py-2 bg-black text-white rounded-full hover:bg-white hover:text-black border transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="w-11/12 sm:w-3/4 px-4 py-2 bg-white text-black rounded-full hover:bg-black hover:text-white border transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/user/home")}
                className="w-11/12 sm:w-3/4 px-4 py-2 bg-black text-white rounded-full hover:bg-white hover:text-black border transition-colors"
              >
                Guest
              </button>
            </>
          )}
        </div>
      )}
            <hr className="mt-8 border-gray-700" />
    </header>
  );
};

export default Header;
