import React, { useState, useEffect } from "react";
import { BarChart, Download, FileSpreadsheet } from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getReportsApi } from "../../../services/salesReportService";
import OverallStatistics from "./elements/OverallStatistics";
import FiltersSection from "./elements/FiltersSection";
import SalesTable from "./elements/SalesTable";
import SalesTrendChart from "./elements/SalesTrendChart";
import { downloadExcel, downloadPDF } from "./elements/ReportDownload";
import TopSelling from "./elements/TopSelling";

const Report = () => {
  const [salesReportData, setSalesReportData] = useState();
  const [dateRange, setDateRange] = useState("yearly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    showDiscount: true,
    showCoupons: true,
  });

  const user = useSelector((state) => state.auth.user);

  const getReports = async () => {
    try {
      const response = await getReportsApi(
        customStartDate,
        customEndDate,
        dateRange || "yearly"
      );
      setSalesReportData(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getReports();
  }, [customEndDate, customStartDate, dateRange]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-white min-h-screen w-full rounded-xl"
    >
      <div>
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <div className="flex items-center gap-3">
            <BarChart className="w-6 h-6 text-black" />
            <h2 className="text-2xl font-bold text-black tracking-tight">
              Sales Report
            </h2>
          </div>
        </div>

        {salesReportData && (
          <OverallStatistics
            salesReportData={salesReportData}
            formatCurrency={formatCurrency}
          />
        )}

        <FiltersSection
          dateRange={dateRange}
          setDateRange={setDateRange}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
    

        {salesReportData && (
          <>
            <SalesTable
              salesReportData={salesReportData}
              selectedFilters={selectedFilters}
              formatCurrency={formatCurrency}
            />

            <div className="flex justify-end p-7">
              <div className="flex gap-3">
                <button
                  onClick={() => downloadPDF(salesReportData)}
                  className="flex items-center gap-2 px-4 bg-black py-2 text-sm rounded-3xl text-white transform transition duration-300 hover:scale-105 w-full text-left"
                >
                  <Download size={15} />
                  Download as PDF
                </button>

                <button
                  onClick={() => downloadExcel(salesReportData)}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm transform transition duration-300 hover:scale-105 rounded-3xl w-full text-left"
                >
                  <FileSpreadsheet size={15} />
                  Download as Excel
                </button>
              </div>
            </div>

            <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <TopSelling />
        </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Sales Trend</h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 bg-black rounded-full"></span>
                    <span className="text-sm text-gray-600">Sales</span>

                    {selectedFilters.showDiscount && (
                      <>
                        <span className="inline-block w-3 h-3 bg-gray-400 rounded-full ml-4"></span>
                        <span className="text-sm text-gray-600">Discount</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-64 w-full">
                  <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
                    <SalesTrendChart
                      salesData={salesReportData}
                      showDiscount={selectedFilters.showDiscount}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}


      </div>
    </motion.div>
  );
};

export default Report;
