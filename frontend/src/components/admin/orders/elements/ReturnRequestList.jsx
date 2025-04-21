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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <Package size={24} />
          </div>
          <h1 className="text-3xl font-bold">Return Requests</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle size={20} className="mr-2" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin mb-4">
                <RefreshCw size={36} className="text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">Loading return requests...</p>
            </div>
          </div>
        ) : (
          <ReturnRequestTable
            returnRequests={returnRequests}
            handleApproveRequest={handleApproveRequest}
            handleRejectRequest={handleRejectRequest}
          />
        )}
      </div>
    </div>
  );
};

export default ReturnRequestList;