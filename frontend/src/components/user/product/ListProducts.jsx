import React, { useEffect,useRef, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import axios from "axios";
import { Heart, X, ListFilter,ArrowUpAZ   } from "lucide-react";
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
import ProducsListShimmer from "./elements/ProducsListShimmer";

const ListProducts = ({ selectedCategory, setSelectedCategory }) => {
  const searchTerm = useSelector((state) => state.search.searchTerm);
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(200);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratings, setRatings] = useState([]);

  const dedbouncedValue = useDebounce(searchTerm, 500);
  const handlePriceChange = ([min, max]) => {
    setMinPrice(min);
    setMaxPrice(max);
  };
  const dropdownRef = useRef(null);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



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
      console.log(data);

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
  const getSortLabel = (value) => {
    switch(value) {
      case "priceAsc": return "Lowest Price";
      case "priceDesc": return "Highest Price";
      case "nameAsc": return "A-Z";
      case "nameDesc": return "Z-A";
      default: return "Sort By";
    }
  };

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
  const handleSortChange = (value) => {
    setSortBy(value);
    setIsOpen(false);
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
  const [showFilters, setShowFilters] = useState(false);

  // Filter sidebar content - reused in both desktop and mobile views
  const FiltersContent = () => (
    <>
          <h2 className="text-xl hidden lg:block font-bold tracking-widest text-gray-800 mb-3">Filters</h2>

      <hr className="mb-4 text-gray-200" />

      <div className="mb-6">
        <h3 className="text-xs lg:text-[1rem] sm:text-[0.9rem]  text-gray-800 font-semibold mb-3">
          Categories
        </h3>
        <ul className="  sm:space-y-1">
          {categoryList.map((category, indx) => (
            <li
              key={indx}
              onClick={() => {
                setSelectedCategory(category._id);
                if (window.innerWidth < 1024) setShowFilters(false);
              }}
              className={`py-1 px-2  rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${
                category._id === selectedCategory
                  ? "bg-gray-100 font-medium"
                  : ""
              }`}
            >
              <span
                style={{ fontWeight: 400 }}
                className="text-[0.7rem] lg:text-[0.8rem]  text-gray-700"
              >
                {category.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <hr className="mb-4 text-gray-200" />

      <div className="mb-6">

        <PriceRangeSlider
      initialMin={minPrice}
      initialMax={maxPrice}
      onChange={handlePriceChange}
    />

      </div>
      <hr className="mb-4 text-gray-200" />

      <div className="mb-6">
        <h3 className="text-xs sm:text-[0.9rem] lg:text-[1rem] font-semibold mb-3">Size</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"].map(
            (size) => (
              <button
                key={size}
                className="border border-gray-300 rounded-lg py-1 text-[0.6rem] lg:text-[0.7rem] hover:bg-gray-100 transition-colors font-medium"
              >
                {size}
              </button>
            )
          )}
        </div>
      </div>
      <hr className="mb-4 text-gray-200" />

    </>
  );

  return (
    <div className="container text-gray-800 mx-auto p-4 pb-20">
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <h1 className="md:text-xl text-sm text-gray-800 font-semibold">
          Explore Collections
        </h1>
        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 py-1 px-2 sm:px-3 sm:py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ListFilter  className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm  font-medium">Filters</span>
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-black/20 bg-opacity-50"
              onClick={() => setShowFilters(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 sm:max-w-xs max-w-[50vw] w-full bg-white shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-4 h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base sm:text-lg  font-semibold">
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FiltersContent />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar - visible only on lg and above */}
        <div className="hidden lg:block w-65 p-4 bg-white sticky top-4 h-fit font-sans">
          <FiltersContent />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            {/* Title - hidden on mobile because we moved it above the filter button */}
            <h1 className="hidden lg:block text-xl text-gray-800 font-semibold">
              Explore Collections
            </h1>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {error && (
                <p className="text-red-500 text-xs font-medium">{error}</p>
              )}
                 <div className="hidden lg:block w-full sm:w-auto">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg md:py-1.5 md:px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer w-full sm:w-auto"
        >
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">A-Z</option>
          <option value="nameDesc">Z-A</option>
        </select>
      </div>
      
      {/* Icon with dropdown for smaller screens */}
      <div className="lg:hidden relative" ref={dropdownRef}>
        <div 
          className="flex items-center gap-1 cursor-pointer border border-gray-300 rounded-lg py-1.5 px-3 text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-xs md:text-sm">{getSortLabel(sortBy)}</span>
          <ArrowUpAZ size={16} />
        </div>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <div 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs md:text-sm"
              onClick={() => handleSortChange("")}
            >
              Sort By
            </div>
            <div 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs md:text-sm"
              onClick={() => handleSortChange("priceAsc")}
            >
              Lowest Price
            </div>
            <div 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs md:text-sm"
              onClick={() => handleSortChange("priceDesc")}
            >
              Highest Price
            </div>
            <div 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs md:text-sm"
              onClick={() => handleSortChange("nameAsc")}
            >
              A-Z
            </div>
            <div 
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-xs md:text-sm"
              onClick={() => handleSortChange("nameDesc")}
            >
              Z-A
            </div>
          </div>
        )}
      </div>

            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
            {loading
              ? Array(10)
                  .fill(0)
                  .map((_, index) => <ProducsListShimmer key={index} />)
              : products.map((product) => {
                  const ratingData = ratings.find(
                    (rating) => rating._id === product._id
                  );
                  const averageRating = ratingData
                    ? ratingData.averageRating.toFixed(1)
                    : "";
                  const ratingDisplay = ratingData ? (
                    <div className="bg-[#0f8417] space-x-1 text-white px-1.5 py-0.5 rounded flex justify-center content-center items-center">
                      <span className="text-xs mr-0.5">{averageRating}</span>
                      <Star className="h-2 w-2 fill-white stroke-white" />
                    </div>
                  ) : null;

                  return (
                    <div key={product._id} className="relative group">
                      <div
                        onClick={() => handleProductView(product)}
                        className="p-0 cursor-pointer"
                      >
                        <div className="flex items-center justify-center">
                          <div
                            className="md:w-100 md:h-100 w-50 h-50
                          
                        
      

                          
                          
                          relative"
                          >
                            {/* rating stays put */}
                            <div className="absolute xl:ml-50 xl:mt-2 lg:ml-32 lg:h-4 lg:w-10 xl:h-6 xl:w-12 md:h-2 md:w-10 h-2 w-10 text-xs sm:text-lg  ml-16 mt-2 lg:mt-2 md:ml-37 md:mt-2 ">
                              {ratingDisplay}
                            </div>

                            {/* only dim on md+ hover */}
                            <img
                              src={product.variants[0].productImages?.[0]}
                              alt={product.name}
                              className="w-full h-full object-cover transition duration-300 ease-in-out lg:group-hover:brightness-80"
                            />

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWishlist(
                                  product._id,
                                  product.variants[0]
                                );
                              }}
                              className="
    absolute top-1/2 left-1/2
    transform -translate-x-1/2 -translate-y-1/2
    transition duration-300 opacity-100 lg:opacity-0 group-hover:opacity-100
  "
                            >
                              <Heart className="w-8 h-8 text-white bg-black/50 p-1 rounded-full hover:scale-110 transition" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* product info */}
                      <div className="flex flex-col mt-2 items-center">
                        <p
                          style={{
                            fontFamily: "'Cambay', sans-serif",
                            fontWeight: 400,
                          }}
                          className="text-center text-xs md:text-sm text-gray-700"
                        >
                          {/* Mobile (<md): only first 3 words + ellipsis */}
                          <span className="block md:hidden">
                            {`${product.name} – ${product.brand}`
                              .split(" ")
                              .slice(0, 3)
                              .join(" ")}
                            …
                          </span>

                          {/* Desktop (>=md): full text */}
                          <span className="hidden md:block">
                            {product.name} – {product.brand}
                          </span>
                        </p>

                        <div className="flex items-center justify-center space-x-2 mt-0">
                          <div className="text-black font-medium md:text-sm text-[0.6rem]">
                            RS.{product.variants[0].discount_price}.00
                          </div>
                          <div className="text-gray-700 text-[0.6rem] md:text-sm line-through">
                            RS.{product.variants[0].base_price}.00
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {/* Pagination - stays fixed at bottom */}
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

export default ListProducts;


import { Range } from 'react-range';

const PriceRangeSlider = ({ initialMin = 200, initialMax = 50000, onChange }) => {
  const [values, setValues] = useState([initialMin, initialMax]);
  
  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [values, onChange]);

  return (
    <div className="mb-6">
      <h3 className="text-xs sm:text-[0.9rem] lg:text-[1rem] font-semibold mb-3">Price Range</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[0.7rem] sm:text-[0.8rem] lg:text-[0.9rem] font-medium">₹{values[0]}</span>
        <span className="text-[0.7rem] sm:text-[0.8rem] lg:text-[0.9rem] font-medium">₹{values[1]}</span>
      </div>
      <div className="py-4">
        <Range
          step={1000}
          min={200}
          max={50000}
          values={values}
          onChange={(newValues) => setValues(newValues)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="w-full h-1.5 rounded-full bg-gray-300"
              style={{
                ...props.style,
              }}
            >
              <div
                className="h-full rounded-full bg-gray-400"
                style={{
                  position: 'absolute',
                  left: `${props.style.left || 0}px`,
                  width: `${props.style.width || 0}px`
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-4 w-4 bg-gray-400 border-2 border-white shadow-md rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
              style={{
                ...props.style,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            />
          )}
        />
      </div>
    </div>
  );
};
