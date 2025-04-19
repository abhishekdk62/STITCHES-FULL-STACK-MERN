import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedTab } from "../../../slices/selectedTabSlice";
import { User, Heart, LogOut, Package, Ticket, ShoppingCart, ChevronRight } from "lucide-react";
import { Wallet } from 'lucide-react';
import { motion } from "framer-motion";

const Sidebar = () => {
  const dispatch = useDispatch();
  const selectedTab = useSelector((state) => state.selectedTab.selectedTab);

  const menuItems = [
    {
      id: "orders",
      label: "My Orders",
      icon: <Package className="w-5 h-5 mr-3" />,
      matchIds: ["orders"]
    },
    {
      id: "wishlist",
      label: "Wishlist",
      icon: <Heart className="w-5 h-5 mr-3" />,
      matchIds: ["wishlist"]
    },
    {
      id: "myinfo",
      label: "My Info",
      icon: <User className="w-5 h-5 mr-3" />,
      matchIds: ["myinfo", "editaddress", "address", "editinfo"]
    },
    {
      id: "coupons",
      label: "My Coupons",
      icon: <Ticket className="w-5 h-5 mr-3" />,
      matchIds: ["coupons"]
    },
    {
      id: "cart",
      label: "Cart",
      icon: <ShoppingCart className="w-5 h-5 mr-3" />,
      matchIds: ["cart"]
    },
    {
      id: "wallet",
      label: "Wallet",
      icon: <Wallet className="w-5 h-5 mr-3" />,
      matchIds: ["wallet"]
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-md p-6 w-[304px]"
    >
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="border-l-4 border-black pl-4 mb-8"
      >
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Hello</h2>
      </motion.div>
      
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
        scale: 1.07,
        transition: { duration: 0.1 }
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => dispatch(setSelectedTab(item.id))}
      className={`flex cursor-pointer items-center justify-between w-full py-3 px-4 rounded-lg transition-all duration-300 ${
        isSelected
          ? "bg-black text-white shadow-md"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center">
        <motion.div
          animate={{
            color: isSelected ? "#ffffff" : "#6b7280"
          }}
        >
          {item.icon}
        </motion.div>
        <span className="font-medium">{item.label}</span>
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
  );
};

export default Sidebar;