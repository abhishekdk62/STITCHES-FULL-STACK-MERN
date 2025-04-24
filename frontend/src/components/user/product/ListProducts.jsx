import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Heart } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDebounce } from "../../../../utils/useDebounce";
import { useNavigate } from "react-router-dom";
import ReactSlider from "react-slider";
import { ChevronLeft, Star, ChevronRight, Weight } from "lucide-react";
import { getProductsService } from "../../../services/productService";
import {
  fetchCategoriesForFilter,
  getRatingsService,
} from "../../../services/userService";
import { addToWishlist } from "../../../services/wishlistService";

const ListProducts = ({ selectedCategory, setSelectedCategory }) => {
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratings, setRatings] = useState([]);

  const dedbouncedValue = useDebounce(searchTerm, 500);

  const getProducts = async (search) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(location.search);
      const categoryFromURL = params.get("category");

      const requestBody = {
        search,
        category: categoryFromURL || selectedCategory,
        minPrice,
        maxPrice,
        sortBy,
        page: currentPage,
        limit: 10,
      };

      const data = await getProductsService(requestBody);
      setProducts(data.products);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError("");
    } catch (error) {
      console.error(error);
      setError(error.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };
  const userDetails = useSelector((state) => state.auth.user);
  useEffect(() => {
    setCurrentPage(1);
  }, [dedbouncedValue, minPrice, maxPrice, sortBy, selectedCategory]);

  useEffect(() => {
    getProducts(dedbouncedValue);
  }, [
    currentPage,
    dedbouncedValue,
    minPrice,
    maxPrice,
    sortBy,
    selectedCategory,
  ]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getRatingsService();
        setRatings(data);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };
    fetchRatings();
  }, []);

  // Fetch categories for filter sidebar on component mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategoriesForFilter("");
        setCategoryList(data);
      } catch (error) {
        console.error("Failed to fetch categories. Please try again", error);
      }
    };
    getCategories();
  }, []);

  // Handle viewing a product
  const handleProductView = (product) => {
    localStorage.setItem("productInfo", JSON.stringify(product));
    navigate(`/product/${product._id}`);
  };

  const handleWishlist = async (pid, selectedVariant) => {
    if (!userDetails) {
      toast.success("Please login", {
        icon: (
          <img
            src="https://static.thenounproject.com/png/3941-200.png"
            className="animate-pulse"
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
      return;
    }
    try {
      const response = await addToWishlist(pid, selectedVariant);

      toast.success(response.data.message, {
        icon: (
          <img
            src="https://static.thenounproject.com/png/29520-200.png"
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

      console.log(response);
    } catch (error) {
      toast.error(error.response.data.message, {
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

      console.log(error);
    }
  };

  return (
    <div className="container text-gray-800 mx-auto p-4 pb-20">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-65 p-4 bg-white sticky top-4 h-fit font-sans">
          <h2 className="text-xl tracking-widest text-gray-800  mb-3">
            Filters
          </h2>
          <hr className="mb-4 text-gray-200" />

          <div className="mb-6">
            <h3 className="text-base text-gray-800 font-semibold mb-3">
              Categories
            </h3>
            <ul className="space-y-1">
              {categoryList.map((category, indx) => (
                <li
                  key={indx}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`py-1 px-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${
                    category._id === selectedCategory
                      ? "bg-gray-100 font-medium"
                      : ""
                  }`}
                >
                  <span
                    style={{ fontWeight: 400 }}
                    className="text-sm text-gray-700"
                  >
                    {category.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <hr className="mb-4 text-gray-200" />

          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Price Range</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">₹{minPrice}</span>
              <span className="text-sm font-medium">₹{maxPrice}</span>
            </div>
            <ReactSlider
              value={[minPrice, maxPrice]}
              min={200}
              step={1000}
              max={50000}
              onChange={(values) => {
                setMinPrice(values[0]);
                setMaxPrice(values[1]);
              }}
              className="w-full mt-2"
              thumbClassName="h-4 w-4 bg-gray-400 border-2 border-white shadow-md rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              trackClassName="h-1.5 rounded-full bg-gray-400"
              pearling
              minDistance={10}
            />
          </div>
          <hr className="mb-4 text-gray-200" />

          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(
                (size) => (
                  <button
                    key={size}
                    className="border border-gray-300 rounded-lg py-1 text-xs hover:bg-gray-100 transition-colors font-medium"
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          </div>
          <hr className="mb-4 text-gray-200" />

          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3">Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                "purple-500",
                "black",
                "red-500",
                "orange-500",
                "blue-500",
                "green-500",
                "yellow-500",
                "gray-500",
                "pink-500",
                "blue-500",
                "green-500",
                "blue-500",
              ].map((color, indx) => (
                <div
                  key={indx}
                  className={`w-6 h-6 bg-${color} rounded-full cursor-pointer border border-gray-200 hover:scale-110 transition-transform shadow-sm`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h1 className="text-xl text-gray-800 font-semibold">
              Explore Collections
            </h1>
            <div className="flex items-center gap-3">
              {error && (
                <p className="text-red-500 text-xs font-medium">{error}</p>
              )}
              <select
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value="">Sort By</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">A-Z</option>
                <option value="nameDesc">Z-A</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <ProductListShimmer />
            ) : (
              products.map((product) => {
                const ratingData = ratings.find(
                  (rating) => rating._id === product._id
                );
                const averageRating = ratingData
                  ? ratingData.averageRating.toFixed(1)
                  : "";
                const ratingDisplay = ratingData ? (
                  <div className="bg-[#0b5c10] space-x-1 text-white px-1.5 py-0.5 rounded flex justify-center content-center items-center">
                    <span className="text-xs mr-0.5">{averageRating}</span>
                    <Star className="h-2 w-2 fill-white stroke-white" />
                  </div>
                ) : null;

                return (
                  <div key={product._id} className="relative">
                    <div
                      onClick={() => handleProductView(product)}
                      className="p-0 group cursor-pointer"
                    >
                      <div className="flex items-center justify-center">
                        <div className="w-100 h-100 relative">
                          <div className="absolute ml-63 mt-2">
                            {ratingDisplay}
                          </div>
                          <img
                            src={product.variants[0].productImages?.[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition duration-300 ease-in-out group-hover:brightness-75"
                          />
                          <button
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
             opacity-0 group-hover:opacity-100 transition duration-300"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents triggering handleProductView
                              handleWishlist(product._id, product.variants[0]);
                            }}
                          >
                            <Heart className="w-8 h-8 text-white bg-black/50 p-1 rounded-full hover:scale-110 transition" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col mt-2 items-center">
                      <p
                        style={{
                          fontFamily: "'Cambay', sans-serif",
                          fontWeight: 400,
                        }}
                        className="text-center text-gray-700 text-sm"
                      >
                        {product.name} - {product.brand}
                      </p>
                      <div className="flex items-center justify-center space-x-2 mt-0">
                        <div className="text-black font-medium text-sm">
                          RS.{product.variants[0].discount_price}.00
                        </div>
                        <div className="text-gray-700 text-sm line-through">
                          RS.{product.variants[0].base_price}.00
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-md border-t border-gray-200 z-10">
        <div className="flex justify-center items-center space-x-4 max-w-xs mx-auto">
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            disabled={currentPage <= 1}
            className="h-10 w-10 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
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
            className="h-10 w-10 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 transition-colors"
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductListShimmer = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 animate-pulse"></div>
      <div className="flex justify-between items-center mb-2">
        <div className="h-6 w-1/2 bg-gray-300 rounded animate-pulse"></div>
        <div className="h-6 w-6 bg-gray-300 rounded-full animate-pulse"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded mb-2 animate-pulse"></div>
      <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
};

export default ListProducts;
