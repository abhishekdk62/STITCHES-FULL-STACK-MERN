import axios from "axios";
import React, { useEffect, useState } from "react";
import { X, Search, User,ArrowLeft,ArrowRight, ArrowUp, ArrowDown, CheckCircle, XCircle, AlertCircle, MoreHorizontal, RefreshCw } from "lucide-react";
import { fetchUsers, updateStatus } from "../../services/userService";

const Customer = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getUsers = async (searchQuery = "", page = 1) => {
    setLoading(true);
    try {
      const data = await fetchUsers(searchQuery, page);
      setUserList(data.users);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError("No users found");
          setUserList([]);
        } else {
          setError(err.response.data.message || "Server error");
        }
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError("Error fetching users");
      }
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers("", 1);
  }, []);

  const handleSearch = () => {
    getUsers(searchInput.trim(), 1);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const data = await updateStatus(id, status);
      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: data.updatedUser.status } : user
        )
      );
    } catch (err) {
      console.error(
        "Error updating status:",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
    
    const sortedUsers = [...userList].sort((a, b) => {
      if (field === "name") {
        return isAsc 
          ? b.firstname.localeCompare(a.firstname)
          : a.firstname.localeCompare(b.firstname);
      }
      if (field === "orders") {
        return isAsc 
          ? (b.orders || 0) - (a.orders || 0) 
          : (a.orders || 0) - (b.orders || 0);
      }
      if (field === "balance") {
        return isAsc 
          ? (b.balance || 0) - (a.balance || 0) 
          : (a.balance || 0) - (b.balance || 0);
      }
      return 0;
    });
    
    setUserList(sortedUsers);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Blocked":
        return "bg-red-100 text-red-800 border-red-200";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const sortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? 
      <ArrowUp size={14} className="ml-1" /> : 
      <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <User size={24} />
          </div>
          <h1 className="text-3xl font-bold">Customer Management</h1>
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
                  placeholder="Search by customer name or email"
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      getUsers("", 1);
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
                onClick={() => getUsers("", 1)}
                className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-100 w-full md:w-auto justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                <span>Refresh</span>
              </button>
            </div>
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

        {/* Customers Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Customer List</h2>
          </div>

          {loading ? (
            // Shimmer UI while loading
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : userList.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {userList.map((customer) => (
                <div key={customer._id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      <div className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">
                        {getInitials(customer.firstname)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {customer.firstname} {customer.lastname || ''}
                        </h3>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="text-sm">
                        ${customer.balance || 0} spent
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </div>
                      <button
                        onClick={() => {
                          const confirmChange = window.confirm(
                            `Are you sure you want to ${
                              customer.status === "Active" ? "Block" : "Unblock"
                            } ${customer.firstname}?`
                          );
                          if (confirmChange) {
                            handleUpdateStatus(
                              customer._id,
                              customer.status === "Active" ? "Blocked" : "Active"
                            );
                          }
                        }}
                        className={`px-3 py-1 rounded-md text-white text-sm font-medium ${
                          customer.status === "Active"
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {customer.status === "Active" ? "Block" : "Unblock"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <User size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No customers found</h3>
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
                  getUsers(searchInput.trim(), currentPage - 1);
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
                  getUsers(searchInput.trim(), currentPage + 1);
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
export default Customer;