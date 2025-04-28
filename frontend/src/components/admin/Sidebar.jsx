import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import {
  BadgeDollarSign,
  ShoppingCart,
  ChartBarStacked,
  Users,
  Tag,
  Package,
  LineChart,
  Activity,
} from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { key: "order",        label: "Order",         icon: <ShoppingCart /> },
    { key: "products",     label: "Products",      icon: <Package /> },
    { key: "report",       label: "Sales Report",  icon: <LineChart /> },
    { key: "customer",     label: "Customer",      icon: <Users /> },
    { key: "coupon",       label: "Coupon",        icon: <Tag /> },
    { key: "category",     label: "Category",      icon: <ChartBarStacked /> },
    { key: "offers",       label: "Offers",        icon: <BadgeDollarSign /> },
    { key: "transactions", label: "Transactions",  icon: <Activity /> },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // auto-open above md, close below
  useEffect(() => {
    const onResize = () => {
      setIsOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        className="md:hidden fixed inline-flex items-center justify-center  top-2 border left-2 p-2 bg-white text-black rounded-full shadow"
        onClick={() => setIsOpen((o) => !o)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col 
          bg-white text-black shadow-lg
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
          w-64
        `}
      >
        <div className="px-6 py-4 border-b">
          <h2 className="font-extrabold tracking-wide text-lg lg:2xl md:text-xl">
            Admin Panel
          </h2>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              className={`
                w-full flex items-center px-6 py-3 text-left transition-colors duration-200
                ${
                  activeTab === item.key
                    ? "bg-black text-white font-semibold"
                    : "hover:bg-gray-900 hover:text-white"
                }
              `}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="ml-4 text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
