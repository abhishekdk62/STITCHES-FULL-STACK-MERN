import React from 'react';
import { CreditCard } from 'lucide-react';

const PriceDetails = ({
  basePrice,
  discountPrice,
  quantity,
  shippingPrice,
  grandTotal,
}) => {
  const itemSubtotal = (discountPrice || 0) * (quantity || 0);
  const tax = quantity * discountPrice * 0.12;

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
        <CreditCard size={18} className="mr-2" />
        Price Details
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between pb-2">
          <span className="text-gray-600">Base Price</span>
          <span className="font-medium">
            ₹{basePrice?.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-gray-600">Discount Price</span>
          <span className="font-medium">
            ₹{discountPrice?.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-gray-600">Quantity</span>
          <span className="font-medium">{quantity || 0}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-gray-600">Item Subtotal</span>
          <span className="font-medium">₹{itemSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            ₹{shippingPrice?.toFixed(2) || '0.00'}
          </span>
        </div>
        <div className="border-t pt-3 mt-2 flex justify-between">
          <span className="font-semibold text-black">Grand Total</span>
          <span className="font-bold text-black">₹{grandTotal}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceDetails;
