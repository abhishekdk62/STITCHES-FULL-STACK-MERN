import React, { useState, useEffect, useRef } from 'react';
import { getCoupons } from '../../../services/couponService';
import { Calendar, Copy, Clock, Ticket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import Notification from '../common/Notification';

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [referalCoupon, setReferalCoupon] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getCoupons();
      console.log(response);
      setCoupons(response.coupons);
      setReferalCoupon(response.refCoupons);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError('Failed to fetch coupons');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  const listRef = useRef(null);

  const daysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  const handleViewAll = () => {
    setShowAll(true);
    // after state updates, scroll to the list
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const userDetails = useSelector((state) => state.auth.user);
  const containerVariants2 = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  if (!userDetails) {
    return (
      <Notification
        p1={'You’re not signed in'}
        p2={'Please log in to access your coupons.'}
        icon={<Ticket size={80} className="text-gray-300" />}
      />
    );
  }

  if (coupons.length <= 0) {
    return (
      <Notification
        p1={'No coupons available'}
        p2={'You don’t have any coupons yet.'}
        icon={<Ticket size={80} className="text-gray-300" />}
      />
    );
  }

  return (
    <div className="md:p-6 pt-4 w-full md:w-4xl shadow-sm border rounded-xl border-gray-100 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:text-2xl text-base flex text-black gap-2 items-center font-bold mb-8 border-b border-gray-800 pb-4"
        >
          <Ticket size={25} className="md:h-8 md:w-8" />
          Available Coupons
        </motion.h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-gray-400">
              Loading coupons...
            </div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-center p-4 border border-red-900 rounded-lg"
          >
            {error}
          </motion.div>
        ) : coupons?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 border border-gray-800 rounded-lg"
          >
            <p className="text-gray-400">No coupons available at the moment.</p>
          </motion.div>
        ) : (
          <motion.div
            ref={listRef}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {referalCoupon?.map((coupon) => (
              <motion.div
                key={coupon._id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  transition: { duration: 0.2 },
                }}
                className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-r from-orange-100 to-pink-300 h-full hover:border-white transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Coupon main info */}
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-2xl text-black font-bold">
                        {coupon.couponName}
                      </h3>
                      <div className="text-xs text-black">
                        ID: {coupon._id.slice(-6)}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center">
                      <div className="md:text-3xl text-sm font-bold text-black">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </div>
                      <div className="ml-2 md:text-base text-sm text-black font-medium">
                        {coupon.discountType === 'percentage'
                          ? 'OFF'
                          : 'FLAT OFF'}
                      </div>
                    </div>

                    <div className="items text-black grid grid-cols-2 gap-4">
                      <div className="flex items-center text-black">
                        <Calendar size={16} className="mr-2" />
                        <span>Expires: {formatDate(coupon.expiryDate)}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Clock size={16} className="mr-2" />
                        <span className="text-black">
                          {daysUntilExpiry(coupon.expiryDate)} days left
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-black text-sm">
                      Usage: {coupon.usedCount} used out of {coupon.usageLimit}
                    </div>
                  </div>

                  {/* Coupon code section */}
                  <div className="bg-gray-400 p-7 flex flex-col justify-center items-center min-w-48">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                        Coupon Code
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="font-mono text-xl font-bold border-dashed border-2 border-black py-1 px-2 mb-3"
                      >
                        {coupon.code}
                      </motion.div>
                      <motion.button
                        onClick={() => copyToClipboard(coupon.code)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center bg-white text-black py-2 px-4 rounded hover:bg-gray-200 transition-colors w-full"
                      >
                        <Copy size={14} className="mr-2" />
                        {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Progress bar for usage */}
                <div className="w-full h-1 bg-gray-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="h-1 bg-white"
                  ></motion.div>
                </div>
              </motion.div>
            ))}

            {(showAll ? coupons : coupons.slice(0, 2)).map((coupon) => (
              <motion.div
                key={coupon._id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  transition: { duration: 0.2 },
                }}
                className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-r from-green-100 to-green-300 h-full hover:border-white transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Coupon main info */}
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="md:text-2xl text-xl text-black font-bold">
                        {coupon.couponName}
                      </h3>
                      <div className="text-xs text-black">
                        ID: {coupon._id.slice(-6)}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center">
                      <div className="md:text-3xl  text-xl font-bold text-black">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </div>
                      <div className="ml-2 md:text-base text-sm text-black font-medium">
                        {coupon.discountType === 'percentage'
                          ? 'OFF'
                          : 'FLAT OFF'}
                      </div>
                    </div>

                    <div className="items text-black grid grid-cols-2 gap-4">
                      <div className="flex items-center text-black">
                        <Calendar size={16} className="mr-2" />
                        <span className="text-sm md:text-base">
                          Expires: {formatDate(coupon.expiryDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Clock size={16} className="mr-2" />
                        <span className="text-black flex text-sm md:text-base justify-center items-center">
                          {daysUntilExpiry(coupon.expiryDate)} days left
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="mt-4 text-black text-xs md:text-sm">
                        Usage: {coupon.usedCount} used out of{' '}
                        {coupon.usageLimit}
                      </div>
                      <div className="">
                        <div className=" flex justify-center mt-4 items-center text-black text-xs ">
                          minimum Amount {coupon.minimumAmount}Rs
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coupon code section */}
                  <div className="bg-gray-400 flex flex-col justify-center items-center min-w-48">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wide text-gray-400 mb-2">
                        Coupon Code
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="font-mono text-xl font-bold border-dashed border-2 border-black py-1 px-2 mb-3"
                      >
                        {coupon.code}
                      </motion.div>
                      <motion.button
                        onClick={() => copyToClipboard(coupon.code)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center bg-white text-black md:py-2 py-1 px-2 md:px-4 rounded hover:bg-gray-200 transition-colors w-full"
                      >
                        <Copy size={14} className="mr-2" />
                        {copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Progress bar for usage */}
                <div className="w-full h-1 bg-gray-300">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                    }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="h-1 bg-white"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {showAll ||
          (!loading && !error && coupons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8 flex justify-center"
            >
              <motion.button
                onClick={handleViewAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white text-gray-700 py-3 px-6 rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                View All Coupons
              </motion.button>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Coupon;
