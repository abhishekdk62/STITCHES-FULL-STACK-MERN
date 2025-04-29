import React from 'react';
import { Calendar, CreditCard } from 'lucide-react';

const OrderMetadata = ({ createdAt, paymentMethod }) => {
  return (
    <div className="mt-6 text-xs sm:text-sm md:text-[0.7rem] bg-gray-50 p-2 sm:p-3 md:p-3 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 md:gap-6">
        <div>
          <span className="text-gray-500 text-xs sm:text-sm md:text-[0.7rem]">
            Order Date:
          </span>
          <span className="ml-2 font-medium text-xs sm:text-sm md:text-[0.7rem]">
            {createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-gray-500 text-xs sm:text-sm md:text-[0.7rem]">
            Payment Method:
          </span>
          <span className="ml-2 font-medium text-xs sm:text-sm md:text-[0.7rem]">
            {paymentMethod || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderMetadata;
