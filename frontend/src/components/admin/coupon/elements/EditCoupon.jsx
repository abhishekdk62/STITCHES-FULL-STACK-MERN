import React, { useState, useEffect } from "react";
import { Hash, Tag, Percent, DollarSign, Calendar, Users, ChevronLeft, Save, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { editCoupon } from "../../../../services/couponService";

const EditCoupon = ({ setSelectedTab }) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [error, setError] = useState("");
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const val = localStorage.getItem("coupon");
    const parsedVal = JSON.parse(val);
    if (parsedVal) {
      setCoupon(parsedVal);
      setCode(parsedVal.code || "");
      setName(parsedVal.couponName || "");
      setDiscountType(parsedVal.discountType || "percentage");
      setDiscountValue(parsedVal.discountValue || "");
      setUsageLimit(parsedVal.usageLimit || "");
      setExpiryDate(new Date(parsedVal.expiryDate).toISOString().split("T")[0]);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!code || !discountValue || !expiryDate || !usageLimit) {
      setError("Please fill in all fields.");
      return;
    }

    const updateData = {
      code,
      couponName: name,
      discountType,
      discountValue: Number(discountValue),
      expiryDate,
      usageLimit: Number(usageLimit),
    };

    try {
      await editCoupon(coupon._id, updateData);

      toast.success("Coupon updated successfully!", {
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "black",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });

      setSelectedTab("view");
    } catch (error) {
      setError("An error occurred while updating the coupon.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border border-gray-100">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Edit Coupon</h1>
        <p className="text-gray-500 mt-1">Update your promotional offer details</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
          <AlertCircle className="text-red-500 mr-2" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        {/* Fields similar to AddCoupon.jsx */}
      </form>
    </div>
  );
};

export default EditCoupon;