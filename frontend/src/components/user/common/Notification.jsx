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
        <div className="flex pt-4 flex-col h-full shadow-sm w-full rounded-xl border border-gray-100 justify-center gap-3 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex-1 p-2 bg-white rounded-xl h-full flex flex-col w-full gap-3 justify-center items-center"
          >
            {React.cloneElement(icon, {
              className: "w-6 h-6 md:w-8 md:h-8 lg:w-14 lg:h-14 text-gray-700"
            })}
      
            <div>
              <p className="md:text-2xl text-center font-bold text-gray-700 mb-2">
                {p1}
              </p>
              <p className="text-gray-500 md:text-base text-sm text-center">
                {p2}
              </p>
            </div>
          </motion.div>
        </div>
      );
      
};

export default Notification;
