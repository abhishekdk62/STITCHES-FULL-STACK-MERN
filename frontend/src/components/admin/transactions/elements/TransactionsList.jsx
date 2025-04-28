import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  User,
  Info,
  Mail,
} from "lucide-react";

import toast from "react-hot-toast";
import { fetchTransactionsService } from "../../../../services/transactionService";
import Pagination from "../../../common/utils/Pagination";
import { useDebounce } from "../../../../../utils/useDebounce";

const TransactionsList = ({ setShowTransactionDetails }) => {
  const [searchInput, setSearchInput] = useState("");
  const [transactionsList, setTransactionsList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const debouncedValue = useDebounce(searchInput.trim(), 500);

  const fetchTransactions = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const data = await fetchTransactionsService(query, page);
      setTransactionsList(data.data.data);
      console.log(data.data);
      
      
      setCurrentPage(page);
      setTotalPages(data.data.pagination.totalPages); // Assuming 10 items per page
      setError("");
    } catch (err) {
      setError("Failed to fetch transactions. Please try again.");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchTransactions(debouncedValue, currentPage);
    }, [currentPage]);
    


  useEffect(() => {
    
    fetchTransactions(debouncedValue);
  }, [debouncedValue]);





  

  const viewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const navigateToOrder = (orderId) => {
    // Implementation for navigating to order details page
    toast.success("Navigating to order details...", {
      style: {
        border: "1px solid #0f5132",
        padding: "16px",
        color: "white",
        background: "black",
        fontSize: "14px",
        fontWeight: "bold",
      },
    });
    // Implement actual navigation logic here
  };

  // Function to get transaction type badge
  const getTransactionTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "credited":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <ArrowUpRight size={12} className="mr-1" />
            Credited
          </span>
        );
      case "debited":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ArrowDownLeft size={12} className="mr-1" />
            Debited
          </span>
        );
      case "return":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ArrowUpRight size={12} className="mr-1" />
            Return
          </span>
        );
      case "cancellation":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ArrowUpRight size={12} className="mr-1" />
            Cancellation
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {type}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get the amount color based on transaction type
  const getAmountColorClass = (transactionType) => {
    switch (transactionType?.toLowerCase()) {
      case "credited":
      case "return":
      case "cancellation":
        return "text-green-600";
      case "debited":
        return "text-red-600";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AnimatePresence>
        {isDetailsOpen && selectedTransaction && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 bg-opacity-50"
          >
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-black text-white p-3 sm:p-4 flex justify-between items-center">
                <h3 className="text-sm sm:text-base font-medium">Transaction Details</h3>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <X size={18} sm:size={20} />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center">
                    <User className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-500" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500">Name</h4>
                      <p className="font-medium text-xs sm:text-sm">{selectedTransaction.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-500" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500">Email</h4>
                      <p className="font-medium text-xs sm:text-sm">{selectedTransaction.email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-500" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500">Date</h4>
                      <p className="font-medium text-xs sm:text-sm">{formatDate(selectedTransaction.transactionDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Info className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-500" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500">Transaction ID</h4>
                      <p className="font-medium text-xs sm:text-sm">{selectedTransaction.transactionId}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Wallet className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-500" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500">Type</h4>
                      <div>{getTransactionTypeBadge(selectedTransaction.transactionType)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-500" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500">Amount</h4>
                      <p className={`font-bold text-xs sm:text-sm ${getAmountColorClass(selectedTransaction.transactionType)}`}>
                        ₹{selectedTransaction.amount ? selectedTransaction.amount.toFixed(2) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-12 sm:pb-16">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-center">
          <div className="bg-black text-white p-2 sm:p-3 rounded-full mr-2 sm:mr-3">
            <Wallet size={20} sm:size={24} />
          </div>
          <h1 className="text-base sm:text-lg font-bold">Wallet Transactions</h1>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow-md mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} sm:size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by User or Transaction type"
                className="pl-10 pr-10 py-1 sm:py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70 text-xs sm:text-sm"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} sm:size={18} />
                </button>
              )}
            </div>
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

        {/* Transactions Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-2 sm:py-3 px-3 sm:px-4">
            <h2 className="font-semibold text-sm sm:text-base">Transactions List</h2>
          </div>

          {loading ? (
            // Shimmer UI while loading
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 sm:p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : transactionsList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactionsList.map((transaction, index) => (
                    <tr key={transaction.transactionId || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                        {transaction.transactionId ? transaction.transactionId.substring(0, 8) : "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-500">
                        {formatDate(transaction.transactionDate)}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                        {transaction.name || "N/A"}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm">
                        {getTransactionTypeBadge(transaction.transactionType)}
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium">
                        <span className={getAmountColorClass(transaction.transactionType)}>
                          ₹{transaction.amount ? transaction.amount.toFixed(2) : "N/A"}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm">
                        <button
                          onClick={() => viewTransactionDetails(transaction)}
                          className="text-black hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 sm:p-8 text-center">
              <div className="inline-flex justify-center items-center w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gray-100 mb-4">
                <Wallet size={20} sm:size={24} className="text-gray-400" />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">
                No transactions found
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Try adjusting your search criteria or check back later.
              </p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsList;