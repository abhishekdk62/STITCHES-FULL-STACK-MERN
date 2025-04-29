import React from 'react';
import { Truck, CheckCircle, Package } from 'lucide-react';
import { editProdDeliveryInfo } from '../../../../services/orderServices';

const DeliveryStatus = ({
  status,
  setStatus,
  orderId,
  productId,
  variantId,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Returned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle size={14} />;
      case 'Shipped':
        return <Truck size={14} />;
      case 'Processing':
        return <Package size={14} />;
      default:
        return null;
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await editProdDeliveryInfo(orderId, productId, variantId, newStatus);
    } catch (error) {
      console.error('Error updating delivery status:', error);
    }
  };

  return (
    <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
        <Truck size={18} className="mr-2" />
        Delivery Status
      </h3>

      <div className="mb-4">
        <div
          className={`px-3 py-1.5 rounded-full text-xs sm:text-sm md:text-[0.9rem] lg-xl font-medium inline-flex items-center ${getStatusColor(
            status
          )}`}
        >
          {getStatusIcon(status)}
          <span className={getStatusIcon(status) ? 'ml-1.5' : ''}>
            {status}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Update Status
        </label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-black/70"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Returned">Returned</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default DeliveryStatus;
