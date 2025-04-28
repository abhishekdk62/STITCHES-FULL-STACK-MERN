import React from "react";
import { motion } from "framer-motion";

const StatisticCard = ({ title, value, Icon, formatValue }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs md:text-lg mb-1">{title}</p>
          <h3 className="text-xs md:text-lg font-bold">
            {formatValue ? formatValue(value) : value}
          </h3>
        </div>
        <div className="md:p-3 p-2 bg-black rounded-full">
          <Icon className="md:w-5 md:h-5 h-3 w-3 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatisticCard;