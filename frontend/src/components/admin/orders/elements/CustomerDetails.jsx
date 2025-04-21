import React from "react";
import { MapPin } from "lucide-react";

const CustomerDetails = ({ address }) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 mb-6">
      <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
        <MapPin size={18} className="mr-2" />
        Delivery Address
      </h3>
      <div className="space-y-2">
        <p className="font-medium text-gray-800">{address?.fullName || "N/A"}</p>
        <p className="text-gray-600">
          {address?.street || "N/A"}
          {address?.street ? "," : ""} {address?.city || "N/A"}
          {address?.city ? "," : ""}
        </p>
        <p className="text-gray-600">
          {address?.state || "N/A"} {address?.zipCode || ""}
        </p>
        <p className="text-gray-600">{address?.country || "N/A"}</p>
        <p className="text-gray-600 flex items-center mt-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          {address?.phone || "N/A"}
        </p>
      </div>
    </div>
  );
};

export default CustomerDetails;