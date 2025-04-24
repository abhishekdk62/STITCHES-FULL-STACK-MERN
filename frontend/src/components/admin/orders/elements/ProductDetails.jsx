import React from "react";
import { Package, Tag } from "lucide-react";

const ProductDetails = ({ selectedVariant, productName, quantity, variantId }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      {selectedVariant?.productImages?.[0] ? (
        <img
          src={selectedVariant.productImages[0]}
          alt={productName}
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <Package size={48} className="text-gray-400" />
        </div>
      )}
      <div className="p-4">
        <h2 className="font-bold text-xl mb-1">{productName || "Product Name N/A"}</h2>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <Tag size={14} className="mr-1" />
          <span>Variant ID: {variantId?.substring(0, 8) || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <span className="font-medium text-lg">
            ₹{selectedVariant?.discount_price || "0.00"}
            </span>
            {selectedVariant?.base_price > selectedVariant?.discount_price && (
              <span className="text-gray-400 line-through ml-2 text-sm">
                ₹{selectedVariant?.base_price}
              </span>
            )}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            Qty: {quantity || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;