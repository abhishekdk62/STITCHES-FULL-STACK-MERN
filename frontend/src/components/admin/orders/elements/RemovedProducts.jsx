import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Trash2,
  CheckCircle,
  RefreshCw,
  ArrowLeft,
  ArrowRight ,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchProducts, restoreProduct } from "../../../../services/productService";
import { useDebounce } from "../../../../../utils/useDebounce";



const RemovedProducts = ({ setShowRemoved }) => {
  const [loading, setLoading] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedValue=useDebounce(searchInput.trim(),500)

  const fetchProductsHandler = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const data = await fetchProducts(query, page);
      setProductsList(data.data || []);
      setCurrentPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
      setError("");
    } catch (error) {
      console.log(error);
      setError("Failed to fetch removed products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (id) => {
    try {
      const response = await restoreProduct(id);
      if (response.status === 200) {
        toast.success("Product Activated!", {
          icon: (
            <img
              src="https://static.thenounproject.com/png/412945-200.png"
              className="animate-bounce"
              style={{ filter: "invert(1)" }}
              alt="Success Icon"
              width="30"
              height="30"
            />
          ),
          style: {
            border: "1px solid #0f5132",
            padding: "16px",
            color: "white",
            background: "black",
            fontSize: "14px",
            fontWeight: "bold",
          },
        });
  

        await fetchProductsHandler(searchInput.trim(), currentPage);
      }
    } catch (error) {
      console.log(error);

      toast.error("Failed to restore product", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/3941-200.png"
            className="animate-bounce"
            style={{ filter: "invert(1)" }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          padding: "16px",
          color: "white",
          background: "#ff6666",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });




    }
  };

 
  useEffect(() => {
    fetchProductsHandler("", 1);
  }, []);
  useEffect(()=>{
fetchProductsHandler(debouncedValue)
  },[debouncedValue])

  useEffect(() => {
    fetchProductsHandler(searchInput.trim(), currentPage);
  }, [currentPage]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <Trash2 size={24} />
          </div>
          <h1 className="text-3xl font-bold">Removed Products</h1>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search removed products..."
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      fetchProductsHandler("", 1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
         
            </div>
            <div className="flex gap-4 w-full md:w-auto">
            
              <button
                onClick={() => setShowRemoved(false)}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              >
                <CheckCircle size={18} className="mr-2" />
                <span>View Active</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Removed Product List</h2>
          </div>

          {loading ? (
            // Shimmer UI while loading
            <div className="divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-6 animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                </div>
              ))}
            </div>
          ) : productsList.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {productsList.map((product) => (
                <div key={product._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <div className="bg-black text-white p-1.5 rounded-full">
                        <Package size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">
                          ID: {product._id ? product._id.substring(0, 8) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                      ₹{product.discount_price || "0.00"} | {product.color || "N/A"} | {product.size || "N/A"}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleClick(product._id)}
                          className="p-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                          title="Restore Product"
                        >
                          <CheckCircle size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Trash2 size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No removed products found</h3>
              <p className="text-gray-500">All products are currently active or try refreshing the list.</p>
            </div>
          )}
        </div>

        {/* Fixed Pagination UI at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-center items-center space-x-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage <= 1}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>

            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage >= totalPages}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RemovedProducts;