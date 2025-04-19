import React, { useState } from "react";
import { editProdDeliveryInfo } from "../../services/orderServices";
import { Package, ArrowLeft, Truck, MapPin, CreditCard, Tag, CheckCircle } from "lucide-react";

const OrdersInfo = ({ setActiveTab }) => {
  const orderDetailsAdmin = localStorage.getItem("orderdetailsadmin");
  let data = null,
    data2 = null;
  if (orderDetailsAdmin) {
    try {
      const parsed = JSON.parse(orderDetailsAdmin);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        [data, data2] = parsed;
      }
    } catch (err) {
      console.error("Error parsing order details from localStorage", err);
    }
  }

  const [status, setStatus] = useState(data?.status);
  
  const selectedVariant = data.product.variants.find(
    (v) => v._id == data.variant
  );

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    editProductDeliveryInfo(newStatus);
  };
  
  const editProductDeliveryInfo = async (newStatus) => {
    try {
      const response = await editProdDeliveryInfo(
        data2._id,
        data.product._id,
        data.variant,
        newStatus
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Returned":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={14} />;
      case "Shipped":
        return <Truck size={14} />;
      case "Processing":
        return <Package size={14} />;
      default:
        return null;
    }
  };

  // Calculate final price
  const grandTotal = (
    (data?.quantity*selectedVariant.discount_price*0.12) +
    (selectedVariant?.discount_price || 0) * (data?.quantity || 0) +
    (data2?.shippingPrice || 0)
  ).toFixed(2);

  return (
    <div className="bg-gray-50  py-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setActiveTab("order")}
            className="flex items-center text-gray-600 hover:text-black transition-colors font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Orders
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Package className="mr-2" size={20} />
              <h1 className="font-semibold text-lg">Order Details</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Order ID:</span>
              <span className="font-mono text-sm font-medium">{data2?._id?.substring(0, 8) || "N/A"}</span>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Product Details */}
              <div className="w-full md:w-2/5">
                <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                  {selectedVariant?.productImages?.[0] ? (
                    <img
                      src={selectedVariant.productImages[0]}
                      alt={data?.product?.name}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="font-bold text-xl mb-1">{data?.product?.name || "Product Name N/A"}</h2>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <Tag size={14} className="mr-1" />
                      <span>Variant ID: {data?.variant?.substring(0, 8) || "N/A"}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <span className="font-medium text-lg">${selectedVariant?.discount_price || "0.00"}</span>
                        {selectedVariant?.base_price > selectedVariant?.discount_price && (
                          <span className="text-gray-400 line-through ml-2 text-sm">${selectedVariant?.base_price}</span>
                        )}
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        Qty: {data?.quantity || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="mt-6 bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <Truck size={18} className="mr-2" />
                    Delivery Status
                  </h3>
                  
                  <div className="mb-4">
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span className={getStatusIcon(status) ? "ml-1.5" : ""}>{status}</span>
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
              </div>

              {/* Right Column - Customer and Order Details */}
              <div className="w-full md:w-3/5">
                {/* Customer Section */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 mb-6">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <MapPin size={18} className="mr-2" />
                    Delivery Address
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-800">
                      {data2?.address?.fullName || "N/A"}
                    </p>
                    <p className="text-gray-600">
                      {data2?.address?.street || "N/A"}{data2?.address?.street ? "," : ""} {data2?.address?.city || "N/A"}{data2?.address?.city ? "," : ""}
                    </p>
                    <p className="text-gray-600">
                      {data2?.address?.state || "N/A"} {data2?.address?.zipCode || ""}
                    </p>
                    <p className="text-gray-600">{data2?.address?.country || "N/A"}</p>
                    <p className="text-gray-600 flex items-center mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {data2?.address?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Price Details Section */}
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <CreditCard size={18} className="mr-2" />
                    Price Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-medium">${selectedVariant?.base_price?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-600">Discount Price</span>
                      <span className="font-medium">${selectedVariant?.discount_price?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-600">Quantity</span>
                      <span className="font-medium">{data?.quantity || 0}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-600">Item Subtotal</span>
                      <span className="font-medium">
                        ${((selectedVariant?.discount_price || 0) * (data?.quantity || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${data?.quantity*selectedVariant.discount_price*0.12}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${data2?.shippingPrice?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="border-t pt-3 mt-2 flex justify-between">
                      <span className="font-semibold text-black">Grand Total</span>
                      <span className="font-bold text-black">${grandTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Order Metadata Section */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Order Date:</span>
                      <span className="ml-2 font-medium">
                        {data2?.createdAt ? new Date(data2.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="ml-2 font-medium">
                        {data2?.paymentMethod || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersInfo;