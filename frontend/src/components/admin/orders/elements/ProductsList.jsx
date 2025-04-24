import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Plus,
  ArrowLeft,
  ArrowRight,
  Package,
} from "lucide-react";

import toast from "react-hot-toast";
import { fetchProductsService, softDeleteProductService } from "../../../../services/productService";
import Pagination from "../../../common/utils/Pagination";
import { useDebounce } from "../../../../../utils/useDebounce";
const ProductsList = ({
  setShowAddProduct,
  setShowEditProduct,
  setShowRemoved,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [productsList, setProductsList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedValue=useDebounce(searchInput.trim(),500)

  const fetchProducts = async (query = "", page = 1) => {
    try {
      setLoading(true);
      const data = await fetchProductsService(query, page);
      setProductsList(data.products);

      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError("");
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };


  const [deleteProdId, setDeleteProdId] = useState();

  useEffect(() => {
    fetchProducts("", 1);
  }, []);

  useEffect(() => {
    fetchProducts(searchInput.trim(), currentPage);
  }, [currentPage]);



  useEffect(()=>{
fetchProducts(debouncedValue)
  },[debouncedValue])

  const softDelete = async () => {
    try {
      const response = await softDeleteProductService(deleteProdId);
      if (response.status === 200) {
        toast.success("Product deleted!", {
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
        setIsOpen(false);

        await fetchProducts(searchInput.trim(), currentPage);
      } else {
        toast.error("Failed to delete", {
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
    } catch (err) {
      console.error("Error deleting product:", err);

      toast.error(err?.response?.data?.message || "Something went wrong", {
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center 
      "
          >
            <div
              className="fixed text-sm top-6 left-1/2 transform -translate-x-1/2 w-96 bg-black
      border-gray-700 p-5 rounded-lg shadow-lg text-center"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <img
                  className="h-8 w-8 animate-bounce"
                  src="https://static.thenounproject.com/png/16960-200.png"
                  alt=""
                  style={{ filter: "invert(1)" }}
                />
                <p className="text-white font-bold text-sm">
                  Do you want to remove this product?
                </p>
              </div>

              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={softDelete}
                  className="bg-gray-200 px-3 py-1 rounded-md  text-black cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-red-500 px-4 py-2 rounded text-white font-bold hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <Package size={24} />
          </div>
          <h1 className="text-3xl font-bold">Products Management</h1>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products by name, ID or brand..."
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      fetchProducts("", 1);
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
                onClick={() => setShowAddProduct(true)}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              >
                <Plus size={18} className="mr-2" />
                <span>Add Product</span>
              </button>
              <button
                onClick={() => setShowRemoved(true)}
                className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-100 w-full md:w-auto justify-center"
              >
                <Trash2 size={18} className="mr-2" />
                <span>View Removed</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Product List</h2>
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
                <div
                  key={product._id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <div className="bg-black text-white p-1.5 rounded-full">
                        <Package size={16} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID:{" "}
                          {product._id ? product._id.substring(0, 8) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-600">
                        Brand: {product.brand || "N/A"}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowEditProduct(true);
                            localStorage.setItem("productId", product._id);
                          }}
                          className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteProdId(product._id);
                            setIsOpen(true);
                          }}
                          className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                          title="Remove Product"
                        >
                          <Trash2 size={16} />
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
                <Package size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or add a new product.
              </p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="mt-4 text-black font-medium hover:underline"
              >
                Add your first product
              </button>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    setCurrentPage={setCurrentPage}
  />
</div>

      </div>
    </div>
  );
};

export default ProductsList;
