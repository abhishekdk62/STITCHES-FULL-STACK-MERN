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
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Coupon Code */}
           <div className="space-y-2">
             <label className="flex items-center text-gray-700 font-medium" htmlFor="code">
               <Hash className="mr-2" size={18} />
               Coupon Code
             </label>
             <div className="relative">
               <input
                 id="code"
                 type="text"
                 placeholder="e.g. SUMMER25"
                 value={code}
                 onChange={(e) => setCode(e.target.value.toUpperCase())}
                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
               />
             </div>
           </div>
           
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
               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent appearance-none bg-white"
             >
               <option value="percentage">Percentage Discount (%)</option>
               <option value="fixed">Fixed Amount (₹)</option>
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
               Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
             </label>
             <div className="relative">
               <input
                 id="discountValue"
                 type="number"
                 placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 500"}
                 value={discountValue}
                 onChange={(e) => setDiscountValue(e.target.value)}
                 className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
               />
               <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                 {discountType === "percentage" ? "%" : "₹"}
               </div>
             </div>
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
               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
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
               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
             />
           </div>
         </div>
 
         <div className="flex justify-between items-center pt-6 mt-6 border-t">
           <button
             type="button"
             onClick={() => setSelectedTab("view")}
             className="flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
           >
             <ChevronLeft className="mr-2" size={18} />
             Back to Coupons
           </button>
           <button
             type="submit"
             className="flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
           >
             <Save className="mr-2" size={18} />
             Save Changes
           </button>
         </div>
       </form>
    </div>
  );
};

export default EditCoupon;