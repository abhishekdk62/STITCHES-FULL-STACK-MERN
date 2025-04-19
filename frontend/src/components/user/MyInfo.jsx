import React, { useState } from "react";
import {
  Pencil,
  Home,
  Phone,
  Mail,
  User,
  MapPin,
  Gift,
  Check,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTab } from "../../../slices/selectedTabSlice";
import PleaseLogin from "./PleaseLogin";
import { motion } from "framer-motion";

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

  if (!user) {
    return <PleaseLogin />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-8 bg-white min-h-screen w-4xl rounded-xl"
    >
      <div>
        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-black" />
            <h2 className="text-2xl font-bold text-black tracking-tight">
              My Info
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(setSelectedTab("editinfo"))}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            Edit <Pencil size={15} />
          </motion.button>
        </div>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-gray-700" />
            Contact Details
          </h3>

          <div className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm mb-1">Your Name</p>
                <p className="font-medium text-lg">{user?.firstname}</p>
              </div>
              <div>
                {user?.profileImage ? (
                  <div className="relative">
                    <img
                      src={user?.profileImage}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
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
                <Mail className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm mb-1">Email Address</p>
                  <p className="font-medium lowercase">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-2">
                  {/* Icon and Label */}
                  <div className="flex items-center gap-2 mb-1">
                    <Gift className="w-5 h-5 text-gray-500" />
                    <p className="text-gray-500 text-sm">Referral code</p>
                  </div>

                  {/* Referral Code Display */}
                  <div
                    className="border border-gray-500 p-3 rounded-md cursor-pointer group transition"
                    style={{
                      borderStyle: "dotted",
                      borderWidth: "2px",
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
                        className="font-semibold tracking-[0.3em] text-black uppercase group-hover:text-blue-600 transition-colors"
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
                <Phone className="w-5 h-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                  <p className="font-medium">{user?.phone}</p>
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
            <MapPin className="w-5 h-5 text-gray-700" />
            <h3 className="text-lg font-semibold">Address</h3>
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
                    <h4 className="font-semibold text-lg">
                      {address?.fullName}
                    </h4>
                    {indx === 0 && (
                      <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <Phone className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="text-gray-700">{address?.phone}</p>
                  </div>

                  <div className="flex items-start gap-3 mb-4">
                    <Home className="w-4 h-4 text-gray-500 mt-1" />
                    <p className="text-gray-700">
                      {address?.street}, {address?.city}, {address?.state},{" "}
                      {address?.country}, {address?.zipCode}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                      {address.addressType}
                    </span>
                    {indx === 0 && (
                      <span className="px-3 py-1 bg-gray-100 rounded-md text-sm font-medium text-gray-700">
                        Billing address
                      </span>
                    )}
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
