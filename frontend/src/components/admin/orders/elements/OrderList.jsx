// OrderList.jsx
import React, { useState, useEffect } from "react";
import { X, Search, Package, RefreshCw, Tag } from "lucide-react";
import OrderDetails from "./OrderDetails";
import Pagination from "../../../common/utils/Pagination";

const OrderList = ({
  orderList,
  loading,
  searchInput,
  setSearchInput,
  getOrders,
  error,
  currentPage,
  setCurrentPage,
  totalPages,
  setActiveTab,
}) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  // 1️⃣ Whenever page changes, re-fetch with current search term
  useEffect(() => {
    getOrders(searchInput.trim(), currentPage);
  }, [currentPage]);

  const handleSearch = () => {
    // jump back to page 1 on new search
    setCurrentPage(1);
    getOrders(searchInput.trim(), 1);
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <Package size={24} />
          </div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by order ID or customer name"
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      setCurrentPage(1);
                      getOrders("", 1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              >
                <Search size={18} className="mr-2" />
                Search
              </button>
              <button
                onClick={() => {
                  setSearchInput("");
                  setCurrentPage(1);
                  getOrders("", 1);
                }}
                className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-100 w-full md:w-auto justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                Refresh
              </button>
            </div>
            <button
              className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              onClick={() => setActiveTab("returns")}
            >
              <Tag size={18} className="mr-2" />
              View Returns
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
          ) : (
            <OrderDetails
              orderList={orderList}
              expandedOrder={expandedOrder}
              toggleOrderExpansion={toggleOrderExpansion}
              setActiveTab={setActiveTab}
            />
          )}
        </div>

        {/* ← Simple Pagination wrapped in your bottom-fixed container */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderList;
