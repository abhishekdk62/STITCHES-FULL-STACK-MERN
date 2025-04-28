import React, { useState } from "react";
import { Hash, Tag, Percent, DollarSign, Calendar, Users, ChevronLeft, Save, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { addCoupon } from "../../../../services/couponService";

const AddCoupon = ({ setSelectedTab }) => {
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [minimumAmount, setMinimumAmount] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!discountValue || !expiryDate || !usageLimit || !minimumAmount) {
      setError("Please fill in all fields.");
      return;
    }

    if (discountValue <= 0 || usageLimit <= 0 || minimumAmount <= 0) {
      setError("Please provide valid values.");
      return;
    }

    const couponData = {
      name,
      discountType,
      discountValue: Number(discountValue),
      expiryDate,
      usageLimit: Number(usageLimit),
      minimumAmount: Number(minimumAmount),
    };

    try {
      await addCoupon(couponData);

      toast.success("Coupon added successfully!", {
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "black",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });

      // Reset form fields
      setDiscountType("percentage");
      setDiscountValue("");
      setExpiryDate("");
      setUsageLimit("");
      setName("");
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl border border-gray-100">
      <div className="mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Coupon</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Create promotional offers for your customers
        </p>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={18} />
          <p className="text-red-700 text-sm sm:text-base">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Coupon Name */}
          <div className="space-y-1 sm:space-y-2">
            <label
              className="flex items-center text-gray-700 font-medium text-sm sm:text-base"
              htmlFor="name"
            >
              <Tag className="mr-2" size={16} />
              Coupon Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Summer Sale Discount"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            />
          </div>

          {/* Discount Type */}
          <div className="space-y-1 sm:space-y-2">
            <label
              className="flex items-center text-gray-700 font-medium text-sm sm:text-base"
              htmlFor="discountType"
            >
              {discountType === "percentage" ? (
                <Percent className="mr-2" size={16} />
              ) : (
                <DollarSign className="mr-2" size={16} />
              )}
              Discount Type
            </label>
            <select
              id="discountType"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            >
              <option value="percentage">Percentage Discount (%)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="space-y-1 sm:space-y-2">
            <label
              className="flex items-center text-gray-700 font-medium text-sm sm:text-base"
              htmlFor="discountValue"
            >
              {discountType === "percentage" ? (
                <Percent className="mr-2" size={16} />
              ) : (
                <DollarSign className="mr-2" size={16} />
              )}
              Discount Value
            </label>
            <input
              id="discountValue"
              type="number"
              placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 500"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-1 sm:space-y-2">
            <label
              className="flex items-center text-gray-700 font-medium text-sm sm:text-base"
              htmlFor="expiryDate"
            >
              <Calendar className="mr-2" size={16} />
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            />
          </div>

          {/* Usage Limit */}
          <div className="space-y-1 sm:space-y-2">
            <label
              className="flex items-center text-gray-700 font-medium text-sm sm:text-base"
              htmlFor="usageLimit"
            >
              <Users className="mr-2" size={16} />
              Usage Limit
            </label>
            <input
              id="usageLimit"
              type="number"
              placeholder="e.g. 100"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            />
          </div>

          {/* Minimum Amount */}
          <div className="space-y-1 sm:space-y-2">
            <label
              className="flex items-center text-gray-700 font-medium text-sm sm:text-base"
              htmlFor="minimumAmount"
            >
              <DollarSign className="mr-2" size={16} />
              Minimum Amount
            </label>
            <input
              id="minimumAmount"
              type="number"
              placeholder="e.g. 100"
              value={minimumAmount}
              onChange={(e) => setMinimumAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 mt-4 sm:mt-6 border-t">
          <button
            type="button"
            onClick={() => setSelectedTab("view")}
            className="flex items-center px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm sm:text-base"
          >
            <ChevronLeft className="mr-2" size={16} />
            Back
          </button>
          <button
            type="submit"
            className="flex items-center px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base"
          >
            <Save className="mr-2" size={16} />
            Save Coupon
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;