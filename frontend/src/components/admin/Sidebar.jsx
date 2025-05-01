import React, { useState, useEffect, useRef } from "react";
import { Menu, X, BadgeDollarSign, ShoppingCart, BarChart3, Users, Tag, Package, LineChart, Activity } from "lucide-react";

const Sidebar = ({activeTab, setActiveTab}) => {

  
  const navItems = [
    { key: "order", label: "Order", icon: <ShoppingCart className="h-5 w-5" /> },
    { key: "products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { key: "report", label: "Sales Report", icon: <LineChart className="h-5 w-5" /> },
    { key: "customer", label: "Customer", icon: <Users className="h-5 w-5" /> },
    { key: "coupon", label: "Coupon", icon: <Tag className="h-5 w-5" /> },
    { key: "category", label: "Category", icon: <BarChart3 className="h-5 w-5" /> },
    { key: "offers", label: "Offers", icon: <BadgeDollarSign className="h-5 w-5" /> },
    { key: "transactions", label: "Transactions", icon: <Activity className="h-5 w-5" /> },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      setIsOpen(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        window.innerWidth < 1024
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative z-50">
      {/* Hamburger button */}
      <button
        className="lg:hidden fixed inline-flex items-center justify-center top-4 left-4 p-2.5 bg-black text-white rounded-full  hover:bg-gray-800 transition-colors z-50"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col
          bg-white border-r border-gray-200 border rounded-xl
          transform transition-all duration-300 ease-in-out
          w-72 max-w-[80vw]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0`}
      >
        {/* Header */}
        <div className="px-6 py-6 rounded-xl border-gray-200 bg-gray-50">
          <h2 className="font-extrabold tracking-tight text-xl text-black flex items-center">
            <span className="bg-black text-white p-1.5 rounded-md mr-2">
              <BarChart3 className="h-5 w-5" />
            </span>
            Admin Panel
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="space-y-2 px-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-200
                  ${
                    activeTab === item.key
                      ? "bg-black text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }`}
                aria-current={activeTab === item.key ? "page" : undefined}
              >
                <span
                  className={`flex items-center justify-center ${
                    activeTab === item.key ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span className={`ml-3 font-medium ${activeTab === item.key ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
                {activeTab === item.key && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-white"></span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Footer / User Profile */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
            <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
            <div className="ml-auto">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;