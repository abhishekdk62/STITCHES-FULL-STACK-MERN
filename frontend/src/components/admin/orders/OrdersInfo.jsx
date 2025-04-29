import React, { useState } from 'react';
import ProductDetails from './elements/ProductDetails';
import DeliveryStatus from './elements/DeliveryStatus';
import CustomerDetails from './elements/CustomerDetails';
import PriceDetails from './elements/PriceDetails';
import OrderMetadata from './elements/OrderMetadata';
import { ArrowLeft, Package } from 'lucide-react';

const OrdersInfo = ({ setActiveTab }) => {
  const orderDetailsAdmin = localStorage.getItem('orderdetailsadmin');
  let data = null,
    data2 = null;
  if (orderDetailsAdmin) {
    try {
      const parsed = JSON.parse(orderDetailsAdmin);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        [data, data2] = parsed;
      }
    } catch (err) {
      console.error('Error parsing order details from localStorage', err);
    }
  }

  const [status, setStatus] = useState(data?.status);

  const selectedVariant = data?.product?.variants?.find(
    (v) => v._id === data.variant
  );

  const grandTotal = (
    data?.quantity * selectedVariant?.discount_price * 0.12 +
    (selectedVariant?.discount_price || 0) * (data?.quantity || 0) +
    (data2?.shippingPrice || 0)
  ).toFixed(2);

  return (
    <div className="bg-gray-50 max-w-7xl py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-3 px-4 sm:py-4 sm:px-6 flex  sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center space-x-2">
              <Package size={18} />
              <h1 className="font-semibold text-[0.8rem] sm:text-lg md:text-lg">
                Order Details
              </h1>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm text-gray-500">
                Order ID:
              </span>
              <span className="font-mono text-xs sm:text-sm font-medium">
                {data2?._id?.substring(0, 8) || 'N/A'}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('order')}
              className="mt-2 sm:mt-0 self-start sm:self-auto flex items-center text-sm sm:text-base text-gray-900 hover:text-black transition-colors font-medium"
            >
              <ArrowLeft size={16} className="mr-1 sm:mr-2" />
              Back
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
              {/* Left Column */}
              <div className="max-w-7xl md:w-2/5">
                <ProductDetails
                  selectedVariant={selectedVariant}
                  productName={data?.product?.name}
                  quantity={data?.quantity}
                  variantId={data?.variant}
                />
                <DeliveryStatus
                  status={status}
                  setStatus={setStatus}
                  orderId={data2?._id}
                  productId={data?.product?._id}
                  variantId={data?.variant}
                />
              </div>

              {/* Right Column */}
              <div className="max-w-7xl md:w-3/5">
                <CustomerDetails address={data2?.address} />
                <PriceDetails
                  basePrice={selectedVariant?.base_price}
                  discountPrice={selectedVariant?.discount_price}
                  quantity={data?.quantity}
                  shippingPrice={data2?.shippingPrice}
                  grandTotal={grandTotal}
                />
                <OrderMetadata
                  createdAt={data2?.createdAt}
                  paymentMethod={data2?.paymentMethod}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersInfo;
