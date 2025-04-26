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
    if (  !discountValue || !expiryDate || !usageLimit||!minimumAmount) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (  discountValue<=0 || usageLimit<=0||minimumAmount<=0) {
      setError("Please provide valid values.");
      return;
    }


    const couponData = {
      name,
      discountType,
      discountValue: Number(discountValue),
      expiryDate,
      usageLimit: Number(usageLimit),
      minimumAmount:Number(minimumAmount)
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
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Add New Coupon</h1>
        <p className="text-gray-500 mt-1">Create promotional offers for your customers</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        

          {/* Coupon Name */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium" htmlFor="name">
              <Tag className="mr-2" size={18} />
              Coupon Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Summer Sale Discount"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Discount Type */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium" htmlFor="discountType">
              {discountType === "percentage" ? (
                <Percent className="mr-2" size={18} />
              ) : (
                <DollarSign className="mr-2" size={18} />
              )}
              Discount Type
            </label>
            <select
              id="discountType"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="percentage">Percentage Discount (%)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium" htmlFor="discountValue">
              {discountType === "percentage" ? (
                <Percent className="mr-2" size={18} />
              ) : (
                <DollarSign className="mr-2" size={18} />
              )}
              Discount Value
            </label>
            <input
              id="discountValue"
              type="number"
              placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 500"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium" htmlFor="expiryDate">
              <Calendar className="mr-2" size={18} />
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>

          {/* Usage Limit */}
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium" htmlFor="usageLimit">
              <Users className="mr-2" size={18} />
              Usage Limit
            </label>
            <input
              id="usageLimit"
              type="number"
              placeholder="e.g. 100"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center text-gray-700 font-medium" htmlFor="minimumAmount">
              <DollarSign className="mr-2" size={18} />
              Mininum amount
            </label>
            <input
              id="minimumAmount"
              type="number"
              placeholder="e.g. 100"
              value={minimumAmount}
              onChange={(e) => setMinimumAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t">
          <button
            type="button"
            onClick={() => setSelectedTab("view")}
            className="flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            <ChevronLeft className="mr-2" size={18} />
            Back
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Save className="mr-2" size={18} />
            Save Coupon
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;