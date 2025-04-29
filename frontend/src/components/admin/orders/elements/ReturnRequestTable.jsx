import React from 'react';
import { Package, CheckCircle, XCircle } from 'lucide-react';

const ReturnRequestTable = ({
  returnRequests,
  handleApproveRequest,
  handleRejectRequest,
}) => {
  return (
    <div
      className="
    w-full
    bg-white rounded-lg shadow-md overflow-hidden"
    >
      {returnRequests.length === 0 ? (
        <div className="p-6 sm:p-8 text-center">
          <div className="inline-flex justify-center items-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-100 mb-3 sm:mb-4">
            <Package size={20} className="text-gray-400" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
            No Products Requested for Return
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            When customers request returns, they will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto sm:table-fixed">
            <thead className="bg-gray-50 text-gray-700 text-left">
              <tr>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm md:text-base font-medium w-16 sm:w-auto max-w-[4rem] sm:max-w-none">
                  Order ID
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm md:text-base font-medium w-24 sm:w-auto max-w-[6rem] sm:max-w-none">
                  Product
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm md:text-base font-medium w-20 sm:w-auto max-w-[5rem] sm:max-w-none">
                  Variant ID
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm md:text-base font-medium w-32 sm:w-auto max-w-[8rem] sm:max-w-none">
                  Reason
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm md:text-base font-medium w-20 sm:w-auto max-w-[5rem] sm:max-w-none">
                  Status
                </th>
                <th className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm md:text-base font-medium w-24 sm:w-auto max-w-[6rem] sm:max-w-none">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {returnRequests.map((req) => {
                const selectedVariant = req.productId.variants.find(
                  (v) => v._id === req.variantId
                );
                const rate =
                  (selectedVariant.discount_price * 0.12 +
                    selectedVariant.discount_price) *
                  req.quantity;

                return (
                  <tr key={req._id} className="hover:bg-gray-50">
                    <td
                      className="
      text-gray-900 

                       px-2 py-2 sm:px-4 sm:py-3 
      w-16 sm:w-auto 
      text-xs sm:text-sm 

      break-all     /* force breaks anywhere */
      whitespace-normal /* ensure wrapping is allowed */
"
                    >
                      {req.orderId}
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 w-24 sm:w-auto">
                      <div className="flex items-center">
                        {selectedVariant.productImages?.[0] ? (
                          <img
                            src={selectedVariant.productImages[0]}
                            alt="Product"
                            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md border border-gray-200 mr-2 sm:mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200 mr-2 sm:mr-3">
                            <Package size={18} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-gray-900">
                            {req.productId.name || 'Product Name N/A'}
                          </p>
                          <p className="text-2xs sm:text-xs text-gray-500">
                            Qty: {req.quantity}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-500 w-20 sm:w-auto">
                      <span className="font-mono">
                        {req.variantId.substring(0, 8)}…
                      </span>
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-700 w-32 sm:w-auto">
                      <div className="line-clamp-2">{req.reason}</div>
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 w-20 sm:w-auto">
                      <span className="px-1 py-1 sm:px-1 sm:py-1 rounded-full text-[0.5rem] font-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
                        {req.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 sm:px-4 sm:py-3 w-24 sm:w-auto">
                      <div
                        className="flex flex-col
                      gap-2
                      
                      
                      space-x-1 sm:space-x-2"
                      >
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
                          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium flex items-center transition-colors"
                        >
                          <CheckCircle
                            size={14}
                            className="mr-1 sm:text-sm text-green-600"
                          />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(req._id)}
                          className="bg-white border
                          
                          
                          
                          border-gray-300 text-gray-700 hover:bg-gray-50 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium flex items-center transition-colors"
                        >
                          <XCircle size={14} className="mr-1 text-red-600" />
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
  );
};

export default ReturnRequestTable;
