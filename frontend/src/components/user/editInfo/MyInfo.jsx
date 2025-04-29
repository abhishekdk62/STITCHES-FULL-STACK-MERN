import React, { useState } from 'react';
import {
  Pencil,
  Home,
  Phone,
  Mail,
  User,
  MapPin,
  Gift,
  Check,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTab } from '../../../../slices/selectedTabSlice';
import PleaseLogin from '../auth/PleaseLogin';
import { motion } from 'framer-motion';
import Notification from '../common/Notification';

const MyInfo = ({ avatar }) => {
  const user = useSelector((state) => state.auth.user);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(user?.referalCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const dispatch = useDispatch();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!user) {
    return (
      <Notification
        p1={'You’re not signed in'}
        p2={'Please log in to view your Account Information.'}
        icon={<User size={80} className="text-gray-300" />}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="pt-4 bg-white min-h-screen w-full rounded-xl"
    >
      <div>
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <div className="flex items-center gap-3">
            <User className="md:w-6 md:h-6 w-4 h-4 text-black" />
            <h2 className="md:text-2xl font-bold text-black tracking-tight">
              My Info
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setSelectedTab('editinfo'))}
            className="flex items-center gap-2 text-sm px-2 py-1 md:px-4 md:py-2 rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            Edit <Pencil size={13} className="md:h-4 md:w-4" />
          </motion.button>
        </div>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="md:text-2xl font-semibold mb-6 flex items-center gap-2">
            <Phone className="md:w-5 w-4 h-4 md:h-5 text-gray-700" />
            Contact Details
          </h3>

          <div className="md:space-y-6 space-y-3 bg-gray-50 p-1 md:p-6 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs md:text-sm mb-1">
                  Your Name
                </p>
                <p className="font-medium text-base md:text-lg">
                  {user?.firstname}
                </p>
              </div>
              <div>
                {user?.profileImage ? (
                  <div className="relative">
                    <img
                      src={user?.profileImage}
                      className="md:w-24 w-16 h-16 md:h-24 rounded-full object-cover border-4 border-white shadow-md"
                      alt="User avatar"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center shadow-md">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <Mail className="md:w-5 w-4 h-4 md:h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-500 text-xs md:text-sm mb-1">
                    Email Address
                  </p>
                  <p className="font-medium md:text-base text-sm lowercase">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-2">
                  {/* Icon and Label */}
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="md:w-5 w-4 h-4 md:h-5 text-gray-500" />
                    <p className="text-gray-500 text-xs md:text-sm">
                      Referral code
                    </p>
                  </div>

                  {/* Referral Code Display */}
                  <div
                    className="border border-gray-500 p-1 md:p-3 rounded-md cursor-pointer group transition"
                    style={{
                      borderStyle: 'dotted',
                      borderWidth: '2px',
                    }}
                    onClick={() =>
                      navigator.clipboard.writeText(user?.referalCode)
                    }
                    title="Click to copy"
                  >
                    {copied ? (
                      <div className="flex justify-center items-center gap-1 text-green-600 text-xs animate-fadeIn">
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </div>
                    ) : (
                      <p
                        onClick={handleCopy}
                        className="font-semibold tracking-[0.3em] text-sm md:text-base text-black uppercase group-hover:text-blue-600 transition-colors"
                      >
                        {user?.referalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-start gap-3">
                <Phone className="md:w-5 w-4 h-4 md:h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-500 text-xs md:text-sm mb-1">
                    Phone Number
                  </p>
                  <p className="font-medium md:text-base text-sm ">
                    {user?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Address Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="md:w-5 w-4 h-4 md:h-5 text-gray-700" />
            <h3 className="text-base md:text-xl mb-1 font-semibold">Address</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user?.addresses.map((address, indx) => (
              <motion.div
                key={address?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + indx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-6 bg-gray-50 h-full">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-base md:text-lg">
                      {address?.fullName}
                    </h4>
                    {indx === 0 && (
                      <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex text-base items-start gap-3 mb-4">
                    <Phone className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="text-base text-gray-700">{address?.phone}</p>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <Home className="w-10 h-10 text-gray-500 mt-1" />
                    <p className="text-gray-700 text-sm md:text-base">
                      {address?.street}, {address?.city}, {address?.state},{' '}
                      {address?.country}, {address?.zipCode}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                      {address.addressType}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MyInfo;
