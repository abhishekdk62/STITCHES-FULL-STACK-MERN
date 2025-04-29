import { useState } from 'react';
import { motion } from 'framer-motion';
import Payment from '../../components/user/order/Payment';
import OrderSummary from '../../components/user/order/OrderSummary';
import AddaddressCheckout from '../../components/user/editInfo/AddAddressCheckout';
import React from 'react'

// import DeliveryAddress from '../../components/user/editinfo/DeliveryAddress';

import DeliveryAddress from '../../components/user/editInfo/DeliveryAddress'

import Header from '../../components/user/common/Header';
import CheckoutEditAddress from '../../components/user/editInfo/CheckoutEditAddress';

import { CheckCircle } from 'lucide-react';

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [showCheckEditAddress, setShowCheckEditAddress] =
    useState('showaddress');
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };
  const stepData = [
    { label: 'Delivery' },
    { label: 'Summary' },
    { label: 'Payment' },
  ];

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.3 },
    },
    exit: {
      opacity: 0,
      y: -30,
      transition: { duration: 0.3 },
    },
  };
  const [couponData, setCouponData] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <Header
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <motion.div
        className="md:max-w-4xl w-full mx-auto md:p-6 pt-10 md:pt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Title */}
        <motion.h1
          className="md:text-2xl font-semibold mb-8 text-center"
          variants={stepVariants}
        >
          Complete Your Purchase
        </motion.h1>
        <motion.div
          className="flex justify-between mb-12 px-4"
          variants={stepVariants}
        >
          {stepData.map((item, i) => {
            const idx = i + 1;
            const isCompleted = step > idx;
            const isCurrent = step === idx;

            return (
              <div key={item.label}>
                {/* Step indicator */}
                <div
                  className={`flex flex-col items-center ${
                    step >= idx ? 'text-black' : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`sm:w-10 w-7 h-7 sm:h-10 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : isCurrent
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={16} className="sm:w-5 sm:h-5" />
                    ) : (
                      <p className="text-xs sm:text-base">{idx}</p>
                    )}
                  </div>
                  <span className="mt-2 text-sm sm:text-base font-medium">
                    {item.label}
                  </span>
                </div>

                {/* Connector line (except after last step) */}
                {i < stepData.length - 1 && (
                  <div className="relative w-full self-center mt-1">
                    <div className="w-full h-0.5 absolute top-1/2 transform -translate-y-1/2 bg-gray-200" />
                    <div
                      className={`h-0.5 absolute top-1/2 transform -translate-y-1/2 transition-all duration-700 ease-in-out ${
                        step > idx ? 'bg-gray-300' : 'bg-gray-200'
                      }`}
                      style={{ width: step > idx ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Content Section */}
        <motion.div
          variants={contentVariants}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {step === 1 && showCheckEditAddress === 'showaddress' ? (
            <DeliveryAddress
              setStep={setStep}
              setShowCheckEditAddress={setShowCheckEditAddress}
            />
          ) : showCheckEditAddress === 'checkoutEditAddress' ? (
            <CheckoutEditAddress
              setShowCheckEditAddress={setShowCheckEditAddress}
            />
          ) : showCheckEditAddress === 'addaddress' ? (
            <AddaddressCheckout
              setStep={setStep}
              setShowCheckEditAddress={setShowCheckEditAddress}
            />
          ) : (
            <></>
          )}

          {step === 2 && (
            <OrderSummary
              setStep={setStep}
              setCouponData={setCouponData}
              couponData={couponData}
            />
          )}

          {step === 3 && <Payment setStep={setStep} couponData={couponData} />}
        </motion.div>

        {/* Logo/Branding Footer */}
        <motion.div className="mt-12 text-center" variants={stepVariants}>
          <div className="flex items-center justify-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-semibold text-lg">SecureCheckout</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Safe & secure payment processing
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
