import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SalesTrendChart = ({ salesData, showDiscount }) => {
  // Prepare data for the chart
  const chartData = salesData.deliveredItems.map((item) => {
    const hasCoupon = item.coupon && item.coupon.value > 0;
    const itemPriceWithTax =
      item.quantity * item.price + item.quantity * item.price * 0.12;
    const sales = hasCoupon
      ? itemPriceWithTax - (item.coupon.value * itemPriceWithTax) / 100
      : itemPriceWithTax;
    const discount = (itemPriceWithTax * (item.coupon?.value || 0)) / 100;

    return {
      date: item.createdAt.split('T')[0], // Format the date as YYYY-MM-DD
      sales: sales.toFixed(2),
      discount: discount.toFixed(2),
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#000"
          activeDot={{ r: 8 }}
          name="Sales"
        />
        {showDiscount && (
          <Line
            type="monotone"
            dataKey="discount"
            stroke="#8884d8"
            name="Discount"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesTrendChart;
