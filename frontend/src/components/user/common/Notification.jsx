import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Notification = ({p1,p2,icon}) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      };
  return (
    <div className="flex h-auto shadow-sm w-4xl rounded-xl border border-gray-100 justify-center gap-3 items-center flex-col">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-8 bg-white rounded-xl h-full flex-col flex  w-4xl gap-3 justify-center items-center "
      >
        {icon}
        <div>
          <p className="text-2xl text-center font-bold text-gray-700 mb-2">
            {p1}
          </p>
          <p className="text-gray-500 text-center">
           {p2}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Notification;
