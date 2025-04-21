import React from "react";
import { DollarSign, Tag, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const OverallStatistics = ({ salesReportData, formatCurrency }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <h1 className="text-black p-3 text-2xl font-bold">
        OVERALL STATISTICS
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Sales</p>
              <h3 className="text-2xl font-bold">
                {formatCurrency(salesReportData?.totPrice)}
              </h3>
            </div>
            <div className="p-3 bg-black rounded-full">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold">
                {salesReportData?.totQuantity}
              </h3>
            </div>
            <div className="p-3 bg-black rounded-full">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Discount</p>
              <h3 className="text-2xl font-bold">
                {formatCurrency(salesReportData?.totDiscount)}
              </h3>
            </div>
            <div className="p-3 bg-black rounded-full">
              <Tag className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OverallStatistics;