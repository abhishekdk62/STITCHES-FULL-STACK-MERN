"use client";
import React, { useState, useEffect } from "react";
import { getCoupons } from "../../services/couponService";
import { Calendar, Copy, Clock, Ticket, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useSelector } from "react-redux";
import { getCartItems } from "../../services/userService";
import { ChevronLeft , ChevronRight, Package, MapPin, CreditCard, ShoppingBag, Truck } from "lucide-react";
import { appllyCouponApi } from "../../services/couponService";
export default function OrderSummary({ setStep,setCouponData,couponData }) {
  const [cartItems, setCartItems] = useState();
  const address = useSelector((state) => state.checkout.shippingAddress);
  const [couponCode ,setCouponCode]=useState("")
const[err,setErr]=useState(false)
  const getCart = async () => {
    try {
      const response = await getCartItems();
      setCartItems(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);


const [isOpen,setIsOpen]=useState(false)
  const discount=couponData?((cartItems?.totalPrice + cartItems?.tax)*(couponData?.discountValue)/100):0
  const finalTotal = cartItems?.totalPrice + cartItems?.tax + cartItems?.shippingPrice-discount;
const [isApplied,setIsApplied]=useState(false)
const handleApplyCoupon =async()=>{
  if(!couponCode.trim())
  {
    return setErr("enter valid coupon code")
  }

  try {
    const response=await appllyCouponApi(couponCode)
    console.log(response);
    setCouponData(response)

    setIsApplied(true)


    setErr("")
    
  } catch (error) {
    setErr(error.response.data)
    console.log(error);
    
    
  }

}

const removeApplyCoupon=()=>{
  setCouponData()
  setIsApplied(false)

}

const [coupons, setCoupons] = useState([]);
const [referalCoupons, setReferalCoupons] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const fetchCoupons = async () => {
  if (!isOpen) return;
  
  try {
    setLoading(true);
    const response = await getCoupons();
    setCoupons(response.coupons);
    setReferalCoupons(response.refCoupons);
    setLoading(false);
  } catch (error) {
    console.log(error);
    setError("Failed to fetch coupons");
    setLoading(false);
  }
};

useEffect(() => {
  if (isOpen) {
    fetchCoupons();
  }
}, [isOpen]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};



const selectCoupon = (code) => {
  setCouponCode(code);
  setIsOpen(false)
};

const daysUntilExpiry = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const couponVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.3
    }
  })
};









  return (
    
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-white   w-full mx-auto"
    >







<AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 flex items-center justify-center"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={()=>setIsOpen(false)}
          >
            {/* Modal */}
            <motion.div
              className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden z-50"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b border-gray-200 p-4">
                <div className="flex items-center gap-2">
                  <Ticket size={20} className="text-gray-700" />
                  <h3 className="text-lg font-bold text-black">Available Coupons</h3>
                </div>
                <button 
                  onClick={()=>setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-700" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-64px)]">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-pulse text-gray-400">Loading coupons...</div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center p-4">
                    {error}
                  </div>
                ) : coupons.length === 0 && referalCoupons.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-gray-500">No coupons available right now.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Referral Coupons */}
                    {referalCoupons.length > 0 && (
                      <>
                        {referalCoupons.map((coupon, index) => (
                          <motion.div
                            key={coupon._id}
                            custom={index}
                            variants={couponVariants}
                            initial="hidden"
                            animate="visible"
                            className="border border-gray-200 rounded-md overflow-hidden bg-gradient-to-r from-orange-100 to-pink-300"
                          >
                            <div className="p-3">
                              <div className="flex text-sm justify-between">
                                <div>
                                  <h5 className="font-bold text-black">{coupon.couponName}</h5>
                                  <div className=" font-bold text-black mt-1">
                                    {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="text-xs text-gray-700 mt-1">{daysUntilExpiry(coupon.expiryDate)} days left</div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-100 p-2 flex justify-between items-center">
                              <div className="font-mono font-bold text-sm border-dashed border border-gray-500 px-2 py-1">
                                {coupon.code}
                              </div>
                              <div className="flex space-x-2">
                               
                                <button
                                  onClick={() => selectCoupon(coupon.code)}
                                  className="text-xs bg-black text-white hover:bg-gray-800 p-1 px-2 rounded transition-colors"
                                >
                                  Use
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </>
                    )}

                    {/* Regular Coupons */}
                    {coupons.length > 0 && (
                      <>
                        {coupons.map((coupon, index) => (
                          <motion.div
                            key={coupon._id}
                            custom={index + referalCoupons.length}
                            variants={couponVariants}
                            initial="hidden"
                            animate="visible"
                            className="border border-gray-200 rounded-md overflow-hidden bg-gradient-to-r from-green-100 to-green-300"
                          >
                            <div className="p-3">
                              <div className="flex text-sm justify-between">
                                <div>
                                  <h5 className="font-bold text-black">{coupon.couponName}</h5>
                                  <div className=" font-bold text-black mt-1">
                                    {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="text-xs text-gray-700 mt-1">{daysUntilExpiry(coupon.expiryDate)} days left</div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-gray-100 p-2 flex justify-between items-center">
                              <div className="font-mono font-bold text-sm border-dashed border border-gray-500 px-2 py-1">
                                {coupon.code}
                              </div>
                              <div className="flex space-x-2">
                               
                                <button
                                  onClick={() => selectCoupon(coupon.code)}
                                  className="text-xs bg-black text-white hover:bg-gray-800 p-1 px-2 rounded transition-colors"
                                >
                                  Apply
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>








      <div className="flex justify-between items-center border-b pb-4 mb-8">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-bold text-black tracking-tight">Order Summary</h2>
        </div>
      
      </div>

      {/* Delivery Address */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-700" />
          Delivery Address
        </h3>
        
        <div className="space-y-2 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-3">
              <div>
                <p className="font-medium text-lg">{address?.fullName}</p>
                <p className="text-gray-700 mt-1">{address?.street}</p>
                <p className="text-gray-700">{address?.city}, {address?.state}, {address?.zipCode}</p>
                <p className="text-gray-700 mt-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {address?.phone}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-black"
            >
              Change
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Order Items */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-700" />
          Items ({cartItems?.items?.length || 0})
        </h3>
        
        <div className="rounded-lg border border-gray-100 overflow-hidden">
          {cartItems?.items?.map((item, indx) => (
            <motion.div
              key={indx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + indx * 0.05 }}
              className="py-4 px-6 flex justify-between items-center border-b border-gray-100 bg-gray-50 hover:bg-white transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                  {item?.productId?.image ? (
                    <img src={item?.productId?.image} alt={item?.productId?.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <ShoppingBag className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{item?.productId?.name}</p>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                    <p>${item?.price?.toFixed(2)} × {item?.quantity}</p>
                  </div>
                </div>
              </div>
              <p className="font-medium">
                ${(item?.price * item?.quantity).toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Order Summary Calculation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-700" />
          Payment Summary
        </h3>
        
        <div className="space-y-3 bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="flex justify-between text-gray-700">
            <p>Subtotal</p>
            <p>${cartItems?.totalPrice?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="flex justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              <p>Shipping</p>
            </div>
            <p>${cartItems?.shippingPrice?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="flex justify-between text-gray-700">
            <p>Tax</p>
            <p>${cartItems?.tax?.toFixed(2) || "0.00"}</p>
          </div>
         {discount? <div className="flex justify-between text-gray-700">
            <p>Discount</p>
            <p className="text-green-300">${discount}</p>
          </div>:null}
          <div className="border-t border-gray-200 pt-3 mt-3"></div>
          <div className="flex justify-between font-bold text-lg">
            <p>Grand Total</p>
            <p>${finalTotal?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
      </motion.div>
{/* Coupon Code Input - styled like rest of OrderSummary */}
<motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.25 }}
  className="mb-8"
>
  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
    <Ticket className="w-5 h-5 text-gray-700" />
    Apply Coupon
  </h3>

  <div className="flex flex-col  gap-4 bg-gray-50 p-6 rounded-lg border border-gray-100">
  <div className="flex gap-3"> <div> <input
      type="text"
      placeholder="Enter coupon code"
      className=" px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
      value={couponCode}
      onChange={(e) => setCouponCode(e.target.value)}
    /></div>
<div className=" flex gap-70 items-center">
<div>
   <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleApplyCoupon}
      className="px-6 py-2 bg-black text-white rounded-lg border border-black hover:bg-white hover:text-black transition-all duration-300"
    >
      Apply
    </motion.button>
   </div>
   <div>
   <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={()=>setIsOpen(true)}
      className=" py-2 px-2 bg-white hover:border-green-500 text-xs text-black rounded-lg border border-black transition-all duration-300"
    >
          Show coupons
    </motion.button>
   </div>

</div>
   </div>

   {isApplied&&    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={removeApplyCoupon}
      className=" w-[80px] py-2  text-red-500 border-red-500 text-xs rounded-lg border  hover:bg-white hover:text-red-500 transition-all duration-300"
    >
      Remove
    </motion.button> }


<div>
{err&&<p className="text-red-400 uppercase " >{err}</p>}</div>
  </div>

</motion.div>

      {/* Navigation Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-between mt-8 gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep(1)}
          className="px-6 py-3 flex items-center gap-2 border border-black text-black hover:bg-black hover:text-white transition-all duration-300 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Shipping
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            
            
            setStep(3)}}
          className="px-6 py-3 flex items-center gap-2 bg-black text-white border border-black hover:bg-white hover:text-black transition-all duration-300 rounded"
        >
          Proceed to Payment
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}


