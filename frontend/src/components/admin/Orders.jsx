import axios from "axios";
import React, { useEffect, useState } from "react";
import { X, Search, Package, ArrowRight, ArrowLeft, FileText, RefreshCw, Tag } from "lucide-react";
import { fetchOrdersAdmin } from "../../services/orderServices";

const Orders = ({ setActiveTab }) => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getOrders = async (search = "", page = 1) => {
    setLoading(true);
    try {
      const response = await fetchOrdersAdmin(search, page);
      setOrderList(response.data.data);
      console.log(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleUpdateStatus = (id, status) => {};

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSearch = () => {
    getOrders(searchInput.trim(), 1);
  };

  const toggleOrderExpansion = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
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
            <div className="w-full  md:w-auto flex flex-col md:flex-row items-center gap-4">
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
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
                <span>Search</span>
              </button>
              <button
                onClick={() => getOrders("", 1)}
                className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-100 w-full md:w-auto justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                <span>Refresh</span>
              </button>
            </div>
            <button 
              className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              onClick={() => setActiveTab("returns")}
            >
              <Tag size={18} className="mr-2" />
              <span>View Returns</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Order List</h2>
          </div>

          {loading ? (
            // Shimmer UI while loading
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
          ) : orderList.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {orderList.map((order) => (
                <div key={order._id} className="transition-all duration-200">
                  <div 
                    className={`p-4 hover:bg-gray-50 cursor-pointer ${expandedOrder === order._id ? 'bg-gray-50' : ''}`}
                    onClick={() => toggleOrderExpansion(order._id)}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div className="flex items-center gap-3 mb-2 md:mb-0">
                        <div className="bg-black text-white p-1.5 rounded-full">
                          <FileText size={16} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {order.orderID || (order._id ? order._id.substring(0, 8) : "N/A")}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {order.address && order.address.fullName ? order.address.fullName : "Customer: N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm">
                          {order.items && order.items.length > 0 ? `${order.items.length} item(s)` : "No items"}
                        </span>
                        <ArrowRight 
                          size={16} 
                          className={`transform transition-transform ${expandedOrder === order._id ? 'rotate-90' : ''}`} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Order Details */}
                  {expandedOrder === order._id && (
                    <div className="bg-gray-50 p-4 border-t border-gray-100">
                      {order.items && order.items.length > 0 ? (
                        <div className="space-y-3">
                          {order.items.map((item) => {
                            // Get product details, either as an object or fallback
                            const productName =
                              typeof item.product === "object"
                                ? item.product.name || "N/A"
                                : item.product || "N/A";
                            const productImage =
                              typeof item.product === "object"
                                ? item.product.image
                                : null;
                            
                            return (
                              <div
                                key={item._id}
                                onClick={() => {
                                  setActiveTab("orderInfo");
                                  localStorage.setItem("orderdetailsadmin", JSON.stringify([item, order]));
                                }}
                                className="flex flex-col md:flex-row justify-between items-start border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                              >
                                <div className="flex items-center gap-4 mb-3 md:mb-0">
                                  {productImage ? (
                                    <img
                                      src={productImage}
                                      alt={productName}
                                      className="w-12 h-12 object-cover rounded-md border border-gray-200"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                                      <Package size={20} className="text-gray-400" />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-medium text-gray-900">{productName}</h4>
                                    <p className="text-sm text-gray-500">ID: {item._id ? item._id.substring(0, 8) : "N/A"}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
                                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm w-full md:w-auto">
                                    <div className="text-gray-500">Price:</div>
                                    <div className="font-medium">${item.price != null ? item.price.toFixed(2) : "0.00"}</div>
                                    <div className="text-gray-500">Quantity:</div>
                                    <div className="font-medium">{item.quantity || 0}</div>
                                  </div>
                                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                                    {item.status || "N/A"}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No items found for this order.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Package size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
            </div>
          )}
        </div>

        {/* Fixed Pagination UI at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-center items-center space-x-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                  getOrders(searchInput.trim(), currentPage - 1);
                }
              }}
              disabled={currentPage <= 1}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>

            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                  getOrders(searchInput.trim(), currentPage + 1);
                }
              }}
              disabled={currentPage >= totalPages}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;