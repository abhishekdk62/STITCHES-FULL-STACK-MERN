import React from "react";
import { Calendar, CreditCard } from "lucide-react";

const OrderMetadata = ({ createdAt, paymentMethod }) => {
  return (
    <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Order Date:</span>
          <span className="ml-2 font-medium">
            {createdAt ? new Date(createdAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Payment Method:</span>
          <span className="ml-2 font-medium">{paymentMethod || "N/A"}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderMetadata;