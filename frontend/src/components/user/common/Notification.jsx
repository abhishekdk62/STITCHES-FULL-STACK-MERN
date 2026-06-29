import React from 'react';
import { motion } from 'framer-motion';

const Notification = ({
  p1,
  p2,
  icon,
  shape = false,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}) => {
  return (
    <div
      className={`w-full min-h-[50vh] flex flex-col justify-center ${shape ? '' : 'h-full'} items-center px-4`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center flex flex-col items-center justify-center gap-5 p-8 max-w-md"
      >
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          {React.isValidElement(icon)
            ? React.cloneElement(icon, {
                className: 'w-10 h-10 text-gray-400',
                size: undefined,
              })
            : icon}
        </div>
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            {p1}
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            {p2}
          </p>
        </div>
        {(actionLabel || secondaryLabel) && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            {actionLabel && (
              <button
                onClick={onAction}
                className="w-full sm:w-auto px-6 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                {actionLabel}
              </button>
            )}
            {secondaryLabel && (
              <button
                onClick={onSecondary}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Notification;
