import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedTab } from "../../../slices/selectedTabSlice";

export default function Failure() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate("/user/checkout");
  };

  return (
    <div className="flex items-center w-full justify-center h-130 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white ">
        <div className="flex flex-col items-center">
          {/* X icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full ">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
            >
              <img
                src="            
              https://static.thenounproject.com/png/247536-200.png" alt=""/>
              {/* <X className="w-8 h-8 text-white" /> */}
            </motion.div>
          </div>

          {/* Text content */}
          <motion.h2
            className="mb-2 mt-2 text-xl font-semibold text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Order Failed!
          </motion.h2>

          <motion.p
            className="mb-6 text-sm text-center text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Something went wrong please try again!
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-col justify-center sm:flex-row gap-3 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={handleTryAgain}
              className="px-2 cursor-pointer hover:bg-black hover:text-white py-3 text-sm font-medium text-black border  bg-white "
            >
              TRY AGAIN
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
