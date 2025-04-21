import React from "react";
import { Filter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const FiltersSection = ({
  dateRange,
  setDateRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-300"
        >
          <Filter size={15} />
          Filters
          <ChevronDown
            size={15}
            className={`transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </motion.button>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: showFilters ? "auto" : 0,
          opacity: showFilters ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden mb-6"
      >
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
          <h3 className="text-lg font-semibold mb-4">Report Settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            {dateRange === "custom" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FiltersSection;