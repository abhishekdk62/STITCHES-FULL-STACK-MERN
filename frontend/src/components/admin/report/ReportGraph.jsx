import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const SalesTrendChart = ({ salesData, showDiscount = true }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (salesData?.deliveredItems?.length > 0) {
      const processedData = processSalesDataForChart(salesData.deliveredItems);
      setChartData(processedData);
    }
  }, [salesData]);

  // Function to process sales data into chart-friendly format
  const processSalesDataForChart = (items) => {
    // Group sales by date
    const salesByDate = items.reduce((acc, item) => {
      const date = item.createdAt.split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          date,
          sales: 0,
          discount: 0,
          orders: 0
        };
      }
      
      // Calculate item total with tax
      const itemPriceWithTax = item.quantity * item.price + (item.quantity * item.price * 0.12);
      
      // Calculate discount if coupon exists
      const discountAmount = item.coupon && item.coupon.value > 0
        ? (itemPriceWithTax * item.coupon.value) / 100
        : 0;
      
      // Add to accumulated values
      acc[date].sales += (itemPriceWithTax - discountAmount);
      acc[date].discount += discountAmount;
      acc[date].orders += Number(item.quantity);
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    return Object.values(salesByDate).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  };

  // Format tooltip values as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };
  
  // Custom tooltip to display formatted values
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-black">
            <span className="inline-block w-3 h-3 bg-black rounded-full mr-2"></span>
            Sales: {formatCurrency(payload[0].value)}
          </p>
          {showDiscount && (
            <p className="text-gray-600">
              <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
              Discount: {formatCurrency(payload[1].value)}
            </p>
          )}
          <p className="text-blue-600">
            Orders: {payload[2]?.value || 0}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
            />
            {showDiscount && (
              <YAxis 
                yAxisId="right" 
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              name="Sales"
              stroke="#000000"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            {showDiscount && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="discount"
                name="Discount"
                stroke="#9CA3AF"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            )}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="orders"
              name="Orders"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">No data available for the selected period</p>
        </div>
      )}
    </div>
  );
};

export default SalesTrendChart;