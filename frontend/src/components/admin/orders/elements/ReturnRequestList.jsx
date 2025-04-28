import React from "react";
import ReturnRequestTable from "./ReturnRequestTable";
import { Package, RefreshCw, AlertCircle } from "lucide-react";

const ReturnRequestList = ({
  returnRequests,
  loading,
  error,
  handleApproveRequest,
  handleRejectRequest,
}) => {
  return (
    <div className="bg-gray-50 
    w-full
    min-h-screen">
    <div className=" mx-auto
                    px-4 sm:px-6 md:px-8 lg:px-8 xl:px-10 2xl:px-12
                    py-6 sm:py-8 md:py-10 lg:py-12 pb-20">
      {/* Header */}
      <div className="mb-6 sm:mb-8 md:mb-10 flex items-center">
        <div className="bg-black text-white
                        p-2 sm:p-3 md:p-4
                        rounded-full
                        mr-3 sm:mr-4 md:mr-6">
          <Package size={20} className="md:size-5" />
        </div>
        <h1 className="font-bold
                       text-[1rem] lg:text-2xl md:text-xl ">
          Return Requests
        </h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 sm:mb-6 md:mb-8
                        p-3 sm:p-4 md:p-5
                        bg-red-50 border border-red-200
                        text-red-700 rounded-lg
                        flex items-center
                        text-sm sm:text-base md:text-lg">
          <AlertCircle size={18} className="mr-2 sm:mr-3 md:mr-4" />
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md
                        p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="flex flex-col items-center justify-center
                          py-10 sm:py-12 md:py-14 lg:py-16">
            <div className="animate-spin mb-3 sm:mb-4 md:mb-5">
              <RefreshCw size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium
                          text-base sm:text-lg md:text-xl lg:text-2xl">
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