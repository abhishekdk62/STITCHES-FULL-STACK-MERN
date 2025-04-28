import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTab } from "../../../slices/selectedTabSlice";
import {
  User,
  Heart,
  LogOut,
  Package,
  Ticket,
  ShoppingCart,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      id: "orders",
      label: "My Orders",
      icon: <Package className="w-5 h-5 mr-3" />,
      matchIds: ["orders"],
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: <Heart className="w-5 h-5 mr-3" />,
      matchIds: ["wishlist"],
    },
    {
      id: "myinfo",
      label: "My Info",
      icon: <User className="w-5 h-5 mr-3" />,
      matchIds: ["myinfo", "editaddress", "address", "editinfo"],
    },
    {
      id: "coupons",
      label: "My Coupons",
      icon: <Ticket className="w-5 h-5 mr-3" />,
      matchIds: ["coupons"],
    },
    {
      id: "cart",
      label: "Cart",
      icon: <ShoppingCart className="w-5 h-5 mr-3" />,
      matchIds: ["cart"],
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: <Wallet className="w-5 h-5 mr-3" />,
      matchIds: ["wallet"],
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="lg:hidden fixed top-5 left-4 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMobileMenu}
          className="bg-white p-2 rounded-lg shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <Menu className="w-6 h-6 text-black" />
          )}
        </motion.button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-md p-6 w-[304px]"
        >
          {/* Hello heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="border-l-4 border-black pl-4 mb-8"
          >
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Hello
            </h2>
          </motion.div>

          {/* Navigation Menu */}
          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const isSelected = item.matchIds.includes(selectedTab);

              return (
                <motion.a
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1), duration: 0.3 }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.1 },
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    dispatch(setSelectedTab(item.id));
                    if (window.innerWidth < 768) {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`flex cursor-pointer items-center justify-between w-full py-3 px-4 rounded-lg transition-all duration-300 ${
                    isSelected
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <motion.div
                      animate={{
                        color: isSelected ? "#ffffff" : "#6b7280",
                      }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="font-medium text-base lg:text-base">
                      {item.label}
                    </span>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.a>
              );
            })}
          </nav>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="lg:hidden  fixed inset-0 bg-black z-30"
            />

            {/* Mobile Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-y-0 left-0 z-40 w-[280px] bg-white shadow-xl"
            >
              <div className="h-full overflow-y-auto p-6">
                <nav className="space-y-2">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              .
            </h2>
                  {menuItems.map((item, index) => {
                    const isSelected = item.matchIds.includes(selectedTab);

                    return (
                      <motion.a
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (index + 1), duration: 0.3 }}
                        whileHover={{
                          scale: 1.05,
                          transition: { duration: 0.1 },
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          dispatch(setSelectedTab(item.id));
                          if (window.innerWidth < 768) {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className={`flex cursor-pointer items-center justify-between w-full py-3 px-4 rounded-lg transition-all duration-300 ${
                          isSelected
                            ? "bg-black text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          <motion.div
                            animate={{
                              color: isSelected ? "#ffffff" : "#6b7280",
                            }}
                          >
                            {item.icon}
                          </motion.div>
                          <span className="font-medium text-base lg:text-base">
                            {item.label}
                          </span>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.a>
                    );
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;