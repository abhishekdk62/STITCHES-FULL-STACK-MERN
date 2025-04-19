import { getReportsApi } from "../../services/salesReportService";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import * as XLSX  from 'xlsx'
import autoTable from 'jspdf-autotable'; 

import {
  BarChart,
  LineChart,
  Download,
  Calendar,
  Filter,
  FileText,
  RefreshCw,
  DollarSign,
  Tag,
  ShoppingCart,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
const SalesReport = () => {
  const [salesReportData, setSalesReportData] = useState();
  const user = useSelector((state) => state.auth.user);
  const getReports = async () => {
    try {
      const response = await getReportsApi(
        customStartDate,
        customEndDate,
        dateRange || "yearly"
      );
      console.log(response);
      setSalesReportData(response);
    } catch (error) {
      console.log(error);
    }
  };
  const downloadExcel = (data) => {
    // Main data rows
    const header = ["ORDER DATE", "QUANTITY", "SALES", "DISCOUNT", "COUPON USED"];
    const rows = data.deliveredItems.map((item) => ({
      "ORDER DATE": item.createdAt?.split("T")[0] || "N/A",
      "QUANTITY": item.quantity,
      "SALES": item.price * item.quantity,
      "DISCOUNT": item.discount,
      "COUPON USED": item.coupon || "—"
    }));
  
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Summary sheet with all the information from PDF
    const summarySheet = [
      ["STITCHES", "", "", "", "", "Generated on: " + new Date().toLocaleDateString()],
      ["Sales Report", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["Report Period:", data.range, "", "", "", ""],
      ["", "", "", "", "", ""],
      ["Overall Statistics", "", "", "", "", ""],
      ["", "", "", "", "", ""],
      ["Total Ordered Items:", data.totQuantity, "", "", "", ""],
      ["Total Discount Count:", data.totDiscount, "", "", "", ""],
      ["Total Sales Price:", `₹${data.totPrice}`, "", "", "", ""],
      ["", "", "", "", "", ""],
      ["Detailed Sales Data", "", "", "", "", ""],
      ["", "", "", "", "", ""]
    ];
  
    // Add summary sheet
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summarySheet);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, "Summary");
  
    // Format summary sheet
    if (summaryWorksheet["!cols"] === undefined) summaryWorksheet["!cols"] = [];
    for (let i = 0; i < 6; i++) {
      summaryWorksheet["!cols"][i] = { width: 20 };
    }
  
    // Merge cells for headers
    summaryWorksheet["!merges"] = [
      // STITCHES header
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      // Sales Report header
      { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
      // Overall Statistics header
      { s: { r: 5, c: 0 }, e: { r: 5, c: 4 } },
      // Detailed Sales Data header
      { s: { r: 11, c: 0 }, e: { r: 11, c: 4 } }
    ];
  
    // Add data sheet
    const dataWorksheet = XLSX.utils.json_to_sheet(rows, { header });
    XLSX.utils.book_append_sheet(workbook, dataWorksheet, "Sales Data");
  
    // Format data sheet
    if (dataWorksheet["!cols"] === undefined) dataWorksheet["!cols"] = [];
    for (let i = 0; i < header.length; i++) {
      dataWorksheet["!cols"][i] = { width: 20 };
    }
  
    // Add currency format for sales and discount columns
    const range = XLSX.utils.decode_range(dataWorksheet["!ref"]);
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      // Format SALES column (column C)
      let salesCell = XLSX.utils.encode_cell({ r: R, c: 2 });
      if (dataWorksheet[salesCell]) {
        dataWorksheet[salesCell].t = 'n';
        dataWorksheet[salesCell].z = '"₹"#,##0.00';
      }
      
      // Format DISCOUNT column (column D)
      let discountCell = XLSX.utils.encode_cell({ r: R, c: 3 });
      if (dataWorksheet[discountCell]) {
        dataWorksheet[discountCell].t = 'n';
        dataWorksheet[discountCell].z = '"₹"#,##0.00';
      }
    }
  
    // Save as Excel file
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };
  const downloadPDF = (data) => {
    const doc = new jsPDF();
    

    const logoX = 15;
    const logoY = 15;
    const logoWidth = 20;
    const logoHeight = 20;
    
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("STITCHES", logoX + logoWidth + 5, logoY + 10);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Sales Report", 15, logoY + 25);
    
    doc.setDrawColor(0);
    doc.line(15, logoY + 30, 195, logoY + 30);
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    
    doc.setDrawColor(0);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, logoY + 45, 180, 30, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Overall Statistics", 20, logoY + 55);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Ordered Items: ${data.totQuantity}`, 20, logoY + 63);
    doc.text(`Total Discount Count: ${data.totDiscount}`, 90, logoY + 63);
    doc.text(`Total Sales Price: ₹${data.totPrice}`, 20, logoY + 70);
    

    const tableColumn = ["ORDER DATE", "QUANTITY", "SALES", "DISCOUNT", "COUPON USED"];
    const tableRows = data.deliveredItems.map((item) => [
      item.createdAt?.split("T")[0] || "N/A",
      item.quantity,
      `₹${item.price * item.quantity}`,
      `₹${item.discount}`,
      item.coupon || "—",
    ]);
    doc.text(`${data.range} Report`, 15, logoY + 40);

    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: logoY + 80,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [50, 50, 50],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 15 },
    });
    
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text('STITCHES - Generated on ' + new Date().toLocaleDateString(), 15, doc.internal.pageSize.height - 10);
      doc.text('Page ' + i + ' of ' + pageCount, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }
    
    doc.save("sales_report.pdf");
  };
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
  useEffect(() => {
    getReports();
  }, [customEndDate, customStartDate, dateRange]);
  const sampleData = {
    totalSales: 24560,
    totalOrders: 328,
    totalDiscount: 1250,
    dailyBreakdown: [
      { date: "Apr 1", sales: 850, orders: 12, discount: 45 },
      { date: "Apr 2", sales: 920, orders: 14, discount: 60 },
    ],
  };

  

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const [totalPrice, setTotalPrice] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [discount, setDiscount] = useState(0);
  useEffect(() => {
    if (salesReportData?.deliveredItems.length > 0) {
      let t = salesReportData.deliveredItems?.reduce((acc, i) => {
        // Check if coupon exists and has a value (coupon object is not empty)
        const hasCoupon = i.coupon && i.coupon.value > 0;
  
        // Calculate the total price based on whether the coupon exists
        const itemPriceWithTax = (i.quantity * i.price) + (i.quantity * i.price * 0.12); // Base price + tax
  
        return acc + (hasCoupon
          // If coupon exists, apply the coupon discount
          ? itemPriceWithTax - (i.coupon.value * itemPriceWithTax / 100)
          // If no coupon, just calculate price with tax
          : itemPriceWithTax);
      }, 0);
      setTotalPrice(t);
  
      // Calculate total quantity of orders
      let o = salesReportData.deliveredItems?.reduce((acc, cur) => {
        acc += Number(cur.quantity);
        return acc;
      }, 0);
      setOrdersCount(o);
  
      // Calculate total discount applied
      let d = salesReportData.deliveredItems?.reduce((acc, cur) => {
        acc += Number(cur.discount);
        return acc;
      }, 0);
      setDiscount(d);
    }
  }, [salesReportData]);
  
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
        )}

        {/* Filters Section */}

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

          <div className="relative group"></div>
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
              {/* Date Range Selection */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"></div>
          </div>
        </motion.div>

        {salesReportData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <p className="text-lg font-semibold mt-1">
                  {dateRange === "daily" && "Todays sales"}
                  {dateRange === "weekly" && "This week sales"}
                  {dateRange === "monthly" && "This month sales "}
                  {dateRange === "yearly" && "This year sales "}
                  {dateRange === "custom" && "Custom range sales breakdown"}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Sales
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Orders
                      </th>
                      {selectedFilters.showDiscount && (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Discount
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesReportData.deliveredItems.map((i, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {i.createdAt.split("T")[0]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(
  i.coupon && i.coupon.value > 0 ? 
    ((i.quantity * i.price) + (i.quantity * i.price * 0.12)) - (i.coupon.value * ((i.quantity * i.price) + (i.quantity * i.price * 0.12)) / 100) 
    : ((i.quantity * i.price) + (i.quantity * i.price * 0.12)) || 0
)}


                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {i.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(((((i.quantity*i.price)+(i.quantity*i.price*0.12))*(i.coupon.value))/100)||0)}
                        </td>
                    
                            <td className=" whitespace-nowrap text-sm text-gray-900">
                          {<p className="text-green-400">{i.coupon.code||"NO COUPON USED"}</p>}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="bg-gray-50">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {salesReportData?.deliveredItems.length > 0
                          ? formatCurrency(totalPrice)
                          : 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {salesReportData?.deliveredItems.length > 0
                          ? ordersCount
                          : 0}
                      </td>

                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className=" flex justify-end p-7">
        <div className="flex gap-3">
          <button
            onClick={() => downloadPDF(salesReportData)}
            className="flex items-center gap-2 px-4 bg-black py-2 text-sm rounded-3xl text-white transform transition duration-300 hover:scale-105  w-full text-left"
          >
            <Download size={15} />
            Download as PDF
          </button>

          <button
            onClick={() => downloadExcel(salesReportData)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm transform transition duration-300 hover:scale-105 rounded-3xl  w-full text-left"
          >
            <FileSpreadsheet size={15} />
            Download as Excel
          </button>
        </div>
      </div>

      {salesReportData && (
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
              {/* This is where the chart would be rendered */}
              <div className="bg-gray-50 h-full w-full rounded-lg flex items-center justify-center">
                <LineChart className="w-12 h-12 text-gray-300" />
                <span className="ml-2 text-gray-500">
                  Chart visualization would render here
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SalesReport;
