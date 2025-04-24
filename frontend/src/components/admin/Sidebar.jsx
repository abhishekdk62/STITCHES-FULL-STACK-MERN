import React from "react";
import { FaChartLine } from "react-icons/fa";
import {
  BadgeDollarSign,
  ShoppingCart,
  Gauge,
  Package,
  ChartBarStacked,
  Users,
  Tag,
  LineChart,
  Activity,
} from "lucide-react";
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
  
    { key: "order", label: "Order", icon: <ShoppingCart /> },
    { key: "products", label: "Products", icon: <Package /> },
    { key: "report", label: "Sales Report", icon: <LineChart /> },
    { key: "customer", label: "Customer", icon: <Users /> },
    { key: "coupon", label: "Coupon", icon: <Tag /> },
    { key: "category", label: "Category", icon: <ChartBarStacked /> },
    { key: "offers", label: "Offers", icon: <BadgeDollarSign /> },
    { key: "transactions", label: "Transactions", icon: <Activity /> },
  ];

  return (
    <div className="w-64  bg-white text-black flex flex-col">
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-2xl font-extrabold tracking-wide">Admin Panel</h2>
      </div>

      <nav className="mt-4 flex-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full flex items-center px-6 py-3 text-left transition-colors duration-200
              ${
                activeTab === item.key
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-900 hover:text-white"
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="ml-4">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
