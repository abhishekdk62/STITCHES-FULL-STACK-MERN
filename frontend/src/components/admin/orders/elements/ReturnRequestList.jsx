import React from 'react';
import ReturnRequestTable from './ReturnRequestTable';
import { Package, RefreshCw, AlertCircle, ShoppingCart } from 'lucide-react';

const ReturnRequestList = ({
  returnRequests,
  loading,
  error,
  handleApproveRequest,
  handleRejectRequest,
}) => {
  return (
    <div
      className="bg-gray-50 
    w-full
    max-w-7xl p-4 sm:p-6 pb-16 sm:pb-20
    min-h-screen"
    >
      <div
        className=""
      >
        {/* Header */}
 
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <ShoppingCart size={20} sm:size={24} />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">Return Requests</h1>
        </div>



        {/* Error Message */}
        {error && (
          <div
            className="mb-4 sm:mb-6 md:mb-8
                        p-3 sm:p-4 md:p-5
                        bg-red-50 border border-red-200
                        text-red-700 rounded-lg
                        flex items-center
                        text-sm sm:text-base md:text-lg"
          >
            <AlertCircle size={18} className="mr-2 sm:mr-3 md:mr-4" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div
            className="bg-white rounded-lg 
                        p-6 sm:p-8 md:p-10 lg:p-12"
          >
            <div
              className="flex flex-col items-center justify-center
                          py-10 sm:py-12 md:py-14 lg:py-16"
            >
              <div className="animate-spin mb-3 sm:mb-4 md:mb-5">
                <RefreshCw size={28} className="text-gray-400" />
              </div>
              <p
                className="text-gray-600 font-medium
                          text-base sm:text-lg md:text-xl lg:text-2xl"
              >
                Loading return requests...
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <ReturnRequestTable
              returnRequests={returnRequests}
              handleApproveRequest={handleApproveRequest}
              handleRejectRequest={handleRejectRequest}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReturnRequestList;
