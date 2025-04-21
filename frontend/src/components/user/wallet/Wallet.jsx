import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



import { motion } from "framer-motion";
import { Wallet as WalletIcon, Plus, X, ChevronRight, DollarSign, CreditCard, Clock, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { addMoneyPaypalApi, captureWalletPaymentApi, getTransactionsApi } from "../../../services/transactionService";

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const userDetails = useSelector((state) => state.auth.user);

  const fetchTransactions = async () => {
    try {
      const response = await getTransactionsApi();
      setTransactions(response.transactions);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAddMoney = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid amount", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/3941-200.png"
            className="animate-bounce"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          padding: "16px",
          color: "white",
          background: "#ff6666",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });
      return;
    }

    try {
      const response = await addMoneyPaypalApi({
        amount: Number(amount),
        userId: userDetails._id,
      });
      if (response?.approvalUrl) {
        window.location.href = response.approvalUrl;
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const getTransactionIcon = (type) => {
    switch(type) {
      case "Credit":
        return <ArrowDownCircle className="w-5 h-5 text-green-400" />;
      case "Debit":
        return <ArrowUpCircle className="w-5 h-5 text-red-400" />;
      case "Return":
        return <ArrowDownCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-8 bg-white rounded-xl shadow-sm w-4xl border border-gray-100"
    >
      {/* Wallet Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center border-b pb-4 mb-8">
        <div className="flex items-center gap-3">
          <WalletIcon className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-bold text-black tracking-tight">My Wallet</h2>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div 
        variants={itemVariants}
        className="mb-8 bg-gradient-to-r from-yellow-600 to-yellow-300 p-8 rounded-xl text-white shadow-lg"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-300 mb-2">Available Balance</p>
            <h3 className="text-4xl font-bold">${userDetails?.balance.toFixed(2)}</h3>
          </div>
          <CreditCard className="w-8 h-8 text-gray-300" />
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddMoneyModal(true)}
          className="mt-6 flex items-center gap-2 bg-white text-black px-5 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Add Money
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-gray-500 mb-1 text-sm">Last Transaction</p>
          <p className="font-medium text-lg">
            {transactions[0] ? 
              `$${Math.abs(transactions[0].amount).toFixed(2)}` : 
              "No transactions yet"}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-gray-500 mb-1 text-sm">This Month</p>
          <p className="font-medium text-lg">
            ${transactions
              .filter(t => new Date(t.createdAt).getMonth() === new Date().getMonth())
              .reduce((sum, t) => sum + Math.abs(t.amount), 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p className="text-gray-500 mb-1 text-sm">Total Transactions</p>
          <p className="font-medium text-lg">{transactions.length}</p>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div variants={itemVariants} className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-700" />
            Transaction History
          </h3>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="py-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No transactions yet</p>
              <p className="text-sm text-gray-400">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {transactions.map((transaction, index) => (
                  <motion.li
                    key={transaction._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        {getTransactionIcon(transaction.transactionType)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.details}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.transactionType === "Credit" || transaction.transactionType === "Return" ||transaction.transactionType === "Cancellation"
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {transaction.transactionType === "Credit" || transaction.transactionType === "Return"||transaction.transactionType === "Cancellation"
                          ? `+$${Math.abs(transaction.amount).toFixed(2)}` 
                          : `-$${Math.abs(transaction.amount).toFixed(2)}`}
                      </p>
                      <span className="inline-block text-xs px-2 py-1 mt-1 bg-gray-100 text-gray-600 rounded">
                        {transaction.transactionType}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-xl max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Money to Wallet
              </h2>
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Amount ($)</label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="0.00"
                  min="1"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Minimum amount: $1.00</p>
            </div>

            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddMoneyModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: !amount || amount <= 0 ? 1 : 1.02 }}
                whileTap={{ scale: !amount || amount <= 0 ? 1 : 0.98 }}
                onClick={handleAddMoney}
                disabled={!amount || amount <= 0}
                className={`px-5 py-2 rounded-lg flex items-center gap-2 ${
                  !amount || amount <= 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Wallet;