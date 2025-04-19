import { useState, useEffect } from "react";
import { fetchOrders } from "../../services/orderServices";
import { useDispatch } from "react-redux";
import { setSelectedTab } from "../../../slices/selectedTabSlice";
import { setOrderDetail } from "../../../slices/orderSlice";
import { Package, Search, Calendar, ChevronRight } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const dispatch = useDispatch();

  // Fetch all orders on component mount (or based on sort/filter criteria)
  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        // Call without any status parameter
        const fetchedOrders = await fetchOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [sortBy]); // Optionally refetch if sortBy changes

  const handleViewDetails = (order, item, selectedVariant) => {
    dispatch(setOrderDetail({ order, item, selectedVariant }));
    dispatch(setSelectedTab("orderinfo"));
  };

  
  const filteredOrders = orders.filter(order => {
    const orderIdMatch =
      order.orderID?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order._id && order._id.substring(0, 8).toLowerCase().includes(searchTerm.toLowerCase()));
    const customerMatch = order.address?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    return searchTerm === "" || orderIdMatch || customerMatch;
  });

  const getStatusBadge = (status) => {
    const statusStyles = {
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Processing": "bg-blue-100 text-blue-800 border-blue-200",
      "Shipped": "bg-purple-100 text-purple-800 border-purple-200",
      "Delivered": "bg-green-100 text-green-800 border-green-200",
      "Returned": "bg-orange-100 text-orange-800 border-orange-200",
      "Cancelled": "bg-red-100 text-red-800 border-red-200"
    };

    return `${statusStyles[status] || "bg-gray-100 text-gray-800 border-gray-200"} px-2 py-1 rounded-full text-xs font-medium border`;
  };

  return (
    <div className="bg-white p-8 w-4xl ">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center">
          <Package className="mr-2" />
          Orders Management
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search orders..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center  bg-white p-8 w-full mx-auto items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gray-50 border w-full border-gray-200 p-12 text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-600">No orders found</p>
          <p className="text-gray-500 mt-2">Try changing your search criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-500">Order ID:</div>
                    <div className="ml-2 font-bold">
                      {order.orderID || (order._id ? order._id.substring(0, 8) : "N/A")}
                    </div>
                  </div>

{order.discount!==0?<div className="text-gray-700 font-medium">{`discount:${order.discount} Rs`}</div>:null}

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      <span className="text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  
                  </div>
                </div>
              </div>
              
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => {
                  // Find the variant object matching the item.variant id
                  const selectedVariant =
                    item.product &&
                    item.product.variants &&
                    item.product.variants.find(
                      (variant) => variant._id === item.variant
                    );

                  const productName =
                    typeof item.product === "object" && item.product.name
                      ? item.product.name
                      : "N/A";

                  const productImage =
                    typeof item.product === "object" &&
                    selectedVariant &&
                    selectedVariant.productImages &&
                    selectedVariant.productImages.length > 0
                      ? selectedVariant.productImages[0]
                      : "/placeholder.svg?height=80&width=80";

                  return (
                    <div
                      key={index}
                      className={`flex items-center p-6 ${index !== order.items.length - 1 ? "border-b border-gray-100" : ""}`}
                    >
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded overflow-hidden">
                        <img
                          src={productImage}
                          alt={productName}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      
                      <div className="ml-6 flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{productName}</h3>
                            <p className="text-gray-500 text-sm mt-1">
                              Customer: {order.address && order.address.fullName ? order.address.fullName : "N/A"}
                            </p>
                          </div>
                          <span className={getStatusBadge(item.status)}>
                            {item.status}
                          </span>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-end">
                          <button
                            onClick={() => handleViewDetails(order, item, selectedVariant)}
                            className="flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                          >
                            View Details
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No items found in this order.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
