import React from 'react';
import { motion } from 'framer-motion';

const ProductShimmer = () => {
  // Define the shimmer animation with Framer Motion
  const shimmerVariants = {
    initial: {
      backgroundPosition: "-200% 0",
    },
    animate: {
      backgroundPosition: "200% 0",
      transition: {
        repeat: Infinity,
        repeatType: "mirror",
        duration: 1.5,
        ease: "linear",
      },
    },
  };

  // Common shimmer styles
  const shimmerClass = "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-pulse";

  return (
    <div className="flex flex-col lg:flex-row bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      {/* Product Image Gallery Shimmer */}
      <div className="flex flex-col gap-4 items-center lg:w-1/2 p-6 bg-gray-50">
        <motion.div 
          className={`relative ${shimmerClass} rounded-md`}
          style={{ height: '400px', width: '309px' }}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />
        
        {/* Thumbnails Shimmer */}
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              className={`w-16 h-16 ${shimmerClass} rounded-sm`}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          ))}
        </div>
      </div>

      {/* Product Details Shimmer */}
      <div className="lg:w-1/2 p-6">
        {/* Product Title */}
        <motion.div
          className={`h-10 ${shimmerClass} rounded-md w-3/4 mb-2`}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />

        {/* Ratings */}
        <div className="flex items-center mb-4">
          <motion.div
            className={`h-4 ${shimmerClass} rounded-md w-24`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className={`h-4 ${shimmerClass} rounded-md w-16 ml-2`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </div>

        {/* Pricing Section */}
        <div className="flex pt-2 items-end gap-2 mb-3">
          <motion.div
            className={`h-8 ${shimmerClass} rounded-md w-20`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className={`h-8 ${shimmerClass} rounded-md w-20`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className={`h-8 ${shimmerClass} rounded-md w-16`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </div>

        {/* Size Selection */}
        <div className="mb-4 pt-4">
          <motion.div
            className={`h-6 ${shimmerClass} rounded-md w-32 mb-2`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                className={`h-8 ${shimmerClass} rounded-md w-10`}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <motion.div
            className={`h-6 ${shimmerClass} rounded-md w-32 mb-2`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                className={`w-6 h-6 md:w-8 md:h-8 ${shimmerClass} rounded-full`}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            ))}
          </div>
        </div>

        {/* Stock Status */}
        <motion.div
          className={`h-6 ${shimmerClass} rounded-md w-40 mb-4`}
          variants={shimmerVariants}
          initial="initial"
          animate="animate"
        />

        {/* Action Buttons */}
        <div className="flex items-center mb-6 gap-3">
          <motion.div
            className={`h-12 ${shimmerClass} rounded-md w-32`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className={`h-12 w-12 ${shimmerClass} rounded-full`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
          <motion.div
            className={`h-12 w-12 ${shimmerClass} rounded-full`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              className={`h-4 ${shimmerClass} rounded-md w-full`}
              variants={shimmerVariants}
              initial="initial"
              animate="animate"
            />
          ))}
        </div>

        {/* Product Features */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t pt-6 pb-3 border-gray-200 mt-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex gap-2 items-center">
              <motion.div
                className={`h-7 w-7 ${shimmerClass} rounded-md`}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
              <motion.div
                className={`h-5 ${shimmerClass} rounded-md w-24`}
                variants={shimmerVariants}
                initial="initial"
                animate="animate"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductShimmer;