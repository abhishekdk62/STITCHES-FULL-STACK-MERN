import React from 'react';
import { Package, FileText, ArrowRight } from 'lucide-react';

const OrderDetails = ({
  orderList,
  expandedOrder,
  toggleOrderExpansion,
  setActiveTab,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {orderList.map((order) => (
        <div key={order._id} className="transition-all duration-200">
          <div
            className={`p-4 hover:bg-gray-50 cursor-pointer ${
              expandedOrder === order._id ? 'bg-gray-50' : ''
            }`}
            onClick={() => toggleOrderExpansion(order._id)}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center gap-3 mb-2 md:mb-0">
                <div className="bg-black text-white p-1.5 rounded-full">
                  <FileText size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {order.orderID || order._id.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.address?.fullName || 'Customer: N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">{order.items?.length} item(s)</span>
                <ArrowRight
                  size={16}
                  className={`transform transition-transform ${
                    expandedOrder === order._id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Expanded Order Details */}
          {expandedOrder === order._id && (
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              {order.items?.length ? (
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setActiveTab('orderInfo');
                        localStorage.setItem(
                          'orderdetailsadmin',
                          JSON.stringify([item, order])
                        );
                      }}
                      className="flex flex-col md:flex-row justify-between items-start border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-center gap-4 mb-3 md:mb-0">
                        {typeof item.product === 'object' &&
                        item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center border border-gray-200">
                            <Package size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {typeof item.product === 'object'
                              ? item.product.name
                              : item.product}
                          </h4>
                          <p className="text-sm text-gray-500">
                            ID: {item._id?.substring(0, 8)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center w-full md:w-auto">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm w-full md:w-auto">
                          <div className="text-gray-500">Price:</div>
                          <div className="font-medium">
                            ₹{item.price?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-gray-500">Quantity:</div>
                          <div className="font-medium">{item.quantity}</div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No items found for this order.
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;
