import React from "react";

const CustomerList = ({ userList, handleUpdateStatus }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Blocked":
        return "bg-red-100 text-red-800 border-red-200";
      case "Inactive":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="divide-y divide-gray-200">
      {userList.map((customer) => (
        <div key={customer._id} className="p-4 hover:bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <div className="bg-black text-white p-2 rounded-full w-10 h-10 flex items-center justify-center">
                {getInitials(customer.firstname)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {customer.firstname} {customer.lastname || ""}
                </h3>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="text-sm">${customer.balance || 0} spent</div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  customer.status
                )}`}
              >
                {customer.status}
              </div>
              <button
                onClick={() => {
                  const confirmChange = window.confirm(
                    `Are you sure you want to ${
                      customer.status === "Active" ? "Block" : "Unblock"
                    } ${customer.firstname}?`
                  );
                  if (confirmChange) {
                    handleUpdateStatus(
                      customer._id,
                      customer.status === "Active" ? "Blocked" : "Active"
                    );
                  }
                }}
                className={`px-3 py-1 rounded-md text-white text-sm font-medium ${
                  customer.status === "Active"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {customer.status === "Active" ? "Block" : "Unblock"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;