import React from "react";
import { DollarSign, Tag, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import StatisticCard from "./StatisticCard";

const OverallStatistics = ({ salesReportData, formatCurrency }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <h1 className="text-black p-3 text-sm md:text-lg font-bold">
        OVERALL STATISTICS
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticCard
          title="Total Sales"
          value={salesReportData?.totPrice}
          Icon={DollarSign}
          formatValue={formatCurrency}
        />
        <StatisticCard
          title="Total Orders"
          value={salesReportData?.totQuantity}
          Icon={ShoppingCart}
        />
        <StatisticCard
          title="Total Discount"
          value={salesReportData?.totDiscount}
          Icon={Tag}
          formatValue={formatCurrency}
        />
      </div>
    </motion.div>
  );
};

export default OverallStatistics;