import React, { useEffect, useState } from "react";
import {
  fetchReturnReqAPI,
  approveReturnAPI,
  rejectReturnAPI,
} from "../../services/orderServices";
import { Package, CheckCircle, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
const AdminReturnRequests = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReturnRequests = async () => {
      try {
        setLoading(true);
        const response = await fetchReturnReqAPI();
        setReturnRequests(response);
        console.log(response);
      } catch (err) {
        setError("Failed to fetch return requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchReturnRequests();
  }, []);

  const handleApproveRequest = async (
    requestId,
    userId,
    rate,
    quantity,
    pid,
    vid
  ) => {
    try {
      await approveReturnAPI(requestId, userId, rate, quantity, pid, vid);
      setReturnRequests((prev) => prev.filter((req) => req._id !== requestId));

      toast.success("Return aproved", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/247537-200.png"
            className="animate-spin"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "black",
          fontSize: "14px",
          fontWeight: "bold",
        },
        autoClose: 5000,
      });



    } catch (err) {
      console.error("Error approving return request:", err);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await rejectReturnAPI(requestId);
      setReturnRequests((prev) => prev.filter((req) => req._id !== requestId));
      toast.success("eturn rejected!", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/412945-200.png"
            className="animate-bounce"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: "1px solid #0f5132",
          padding: "16px",
          color: "white",
          background: "black",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });

    } catch (err) {
      console.error("Error rejecting return request:", err);
    }
  };

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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
              <h2 className="font-semibold text-lg">Pending Return Requests</h2>
            </div>

            {returnRequests.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Package size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Products Requested for Return</h3>
                <p className="text-gray-500">When customers request returns, they will appear here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-700 text-left text-sm">
                    <tr>
                      <th className="p-4 font-medium">Order ID</th>
                      <th className="p-4 font-medium">Product</th>
                      <th className="p-4 font-medium">Variant ID</th>
                      <th className="p-4 font-medium">Reason</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {returnRequests?.map((req) => {
                      const selectedVariant = req.productId.variants.find(
                        (v) => v._id == req.variantId
                      );
                      const rate =
                        (selectedVariant.discount_price * 0.12 +
                          selectedVariant.discount_price) *
                        req.quantity;
                      
                      return (
                        <tr key={req._id} className="hover:bg-gray-50">
                          <td className="p-4 text-sm text-gray-900">{req.orderId}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              {selectedVariant.productImages && selectedVariant.productImages[0] ? (
                                <img 
                                  src={selectedVariant.productImages[0]} 
                                  alt="Product" 
                                  className="w-12 h-12 object-cover rounded-md border border-gray-200 mr-3"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200 mr-3">
                                  <Package size={20} className="text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {req.productId.name || "Product Name N/A"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {req.quantity}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-500">
                            <span className="font-mono">{req.variantId.substring(0, 8)}...</span>
                          </td>
                          <td className="p-4 text-sm text-gray-700 max-w-xs">
                            <div className="line-clamp-2">{req.reason}</div>
                          </td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleApproveRequest(
                                    req._id,
                                    req.userId,
                                    rate,
                                    req.quantity,
                                    req.productId._id,
                                    req.variantId
                                  )
                                }
                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors"
                              >
                                <CheckCircle size={16} className="mr-1.5 text-green-600" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRequest(req._id)}
                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-colors"
                              >
                                <XCircle size={16} className="mr-1.5 text-red-600" />
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReturnRequests;