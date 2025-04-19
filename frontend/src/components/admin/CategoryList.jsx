import axios from "axios";
import React, { useEffect, useState } from "react";
import { X,Tag, Search, Edit, Trash2, RefreshCw, Plus, Archive, TagIcon, ArrowLeft, ArrowRight, CheckCircle, Trash } from "lucide-react";
import { PlusCircle, Upload, AlertCircle, Check } from 'lucide-react';
import { Save, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import {toast} from'react-hot-toast'
import {
  addCategory,
  deleteCategory,
  editCategories,
  fetchCategories,
  fetchCategoriesService,
  getCategoryService,
  restoreCategory,
} from "../../services/categoryService";

//!  Category card

// Enhanced Category Card Component
const CategoryCard = ({
  id,
  fetchCategoriesHandler,
  name,
  fetchCategories,
  setEditCategory,
  showRemovedCategory,
}) => {

const [isOpen,setIsOpen]=useState(false)
  const handleDeleteCategory = async () => {
      try {
        const data = await deleteCategory(id);
        toast.success(data.message, {
          icon: (
            <img
              src="https://static.thenounproject.com/png/247537-200.png"
              className="animate-spin"
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
          autoClose: 5000,
        });
        fetchCategories("");
      } catch (error) {

        toast.error(error?.response?.data?.message, {
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
      setIsOpen(false)
    }
  

  const handleEdit = () => {
    localStorage.setItem("categoryId", id);
    setEditCategory(true);
  };

  // Generate a consistent color based on category name
  const getCategoryColor = () => {
    const colors = ["bg-black"];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };


  const handleRestoreCategory = async () => {
    try {
      const response=await restoreCategory(id);

      if (response.status === 200) {
        toast.success("Category restored!", {
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
  
     
      }


      fetchCategoriesHandler();
    } catch (error) {
      console.log("Failed to restore category:", error);
    }
  };


  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${getCategoryColor()}`}>
            <TagIcon size={18} className="text-white" />
          </div>
          <span className="font-medium text-gray-800">{name}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        {showRemovedCategory ? (
          <button
            onClick={handleRestoreCategory}
            className="flex items-center justify-end px-3 py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
          >
            <CheckCircle size={16} className="mr-2" />
            Restore
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="flex items-center px-3 py-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            <button
              onClick={()=>setIsOpen(true)}
              className="flex items-center px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              <Trash2 size={16} className="mr-2" />
              Remove
            </button>
          </div>
        )}
      </td>
      {
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
                  Do you want to delete this category?
                </p>
              </div>

              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={handleDeleteCategory}
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
}
    </tr>
  );
};

// Enhanced Shimmer Card
const CategoryCardShimmer = () => {
  return (
    <tr className="border-b">
      <td className="py-4 px-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse mr-3"></div>
          <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex space-x-2">
          <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-9 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </td>
    </tr>
  );
};

// Enhanced Category List Component
const CategoryList = ({
  setShowAddCategory,
  setEditCategory,
  setShowRemovedCategory,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [categorieList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch categories with optional search query and page number.
  const fetchCategories = async (query = "", page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategoriesService(query, page);
      setCategoryList(data.categories);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (err) {
      setError("Failed to fetch categories. Please try again.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setIsRefreshing(true);
    fetchCategories(searchInput.trim(), currentPage).finally(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  useEffect(() => {
    fetchCategories("");
  }, []);

  // Handle search button click.
  const handleSearch = () => {
    fetchCategories(searchInput.trim(), 1);
  };

  // Handle key press for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Refetch whenever the current page changes.
  useEffect(() => {
    fetchCategories(searchInput.trim(), currentPage);
  }, [currentPage]);

  return (
    <div className="bg-gray-50 min-h-screen">

      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <Tag size={24} />
          </div>
          <h1 className="text-3xl font-bold">Category Management</h1>
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
                  placeholder="Search by category name"
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput("");
                      fetchCategories("", 1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800 w-full md:w-auto justify-center"
              >
                <Search size={18} className="mr-2" />
                <span>Search</span>
              </button>
              <button
                onClick={refreshData}
                className="bg-white text-black border border-gray-300 px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-100 w-full md:w-auto justify-center"
              >
                <RefreshCw size={18} className="mr-2" />
                <span>Refresh</span>
              </button>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddCategory(true)}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800"
              >
                <Plus size={18} className="mr-2" />
                <span>Add Category</span>
              </button>
              <button
                onClick={() => setShowRemovedCategory(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-red-600"
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
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}



        {/* Categories Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <CategoryCardShimmer key={index} />
                  ))
                : categorieList.length > 0 ? (
                    categorieList.map((category) => (
                      <CategoryCard
                        key={category._id}
                        id={category._id}
                        name={category.name}
                        fetchCategories={fetchCategories}
                        fetchCategoriesHandler={refreshData}
                        setEditCategory={setEditCategory}
                        showRemovedCategory={false}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="py-8 px-6 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <TagIcon size={40} className="text-gray-300 mb-3" />
                          <p className="text-lg font-medium">No categories found</p>
                          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or add a new category</p>
                        </div>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination UI - Keeping the original functionality */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white shadow-md py-3">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              disabled={currentPage <= 1}
              className="h-8 w-8 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Page number buttons */}
            {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = idx + 1;
              } else if (currentPage <= 3) {
                pageNum = idx + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx;
              } else {
                pageNum = currentPage - 2 + idx;
              }
              
              // Only show if pageNum is valid
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              disabled={currentPage >= totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

//!  Add Category


const AddCategory = ({ setShowAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState("Active");
  const [discount, setDiscount] = useState("10");
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryInput, setSubCategoryInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

 

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleAddSubCategory = () => {
    if (
      subCategoryInput.toLowerCase().trim() !== "" &&
      !subCategories.includes(subCategoryInput.toLowerCase().trim())
    ) {
      setSubCategories([...subCategories, subCategoryInput.trim()]);
      setSubCategoryInput("");
    } else {
      showNotification("No duplicates allowed", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !description || !subCategories.length || !discount) {
      showNotification("All fields are required!", "error");
      return;
    }
    try {
      await addCategory({
        categoryName,
        description,
        subCategories,
        discount,
      });
      showNotification("Category added successfully!", "success");
      setCategoryName("");
      setSubCategoryInput("");
      setDescription("");
      setSubCategories([]);
    } catch (error) {
      showNotification(error.response?.data?.message || "An error occurred", "error");
    }
  };

  const handleRemoveSubCategory = (index) => {
    const updatedSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(updatedSubCategories);
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      {/* Header with Logo */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-black text-white p-2 rounded-md mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Add New Category</h1>
        </div>
        <button 
          onClick={() => setShowAddCategory(false)} 
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-3 rounded-md flex items-center ${
          notification.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {notification.type === "error" ? 
            <AlertCircle className="mr-2" size={18} /> : 
            <Check className="mr-2" size={18} />
          }
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="category-name">
                Category Name
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                id="category-name"
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>

            {/* Sub Categories */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="sub-category">
                Sub Categories
              </label>
              <div className="flex">
                <input
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  id="sub-category"
                  type="text"
                  placeholder="Add sub-category"
                  value={subCategoryInput}
                  onChange={(e) => setSubCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubCategory())}
                />
                <button
                  type="button"
                  className="bg-black text-white py-3 px-5 rounded-r-lg hover:bg-gray-800 transition-colors flex items-center"
                  onClick={handleAddSubCategory}
                >
                  <PlusCircle size={18} className="mr-2" />
                  Add
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {subCategories.map((sub, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-2 rounded-md text-sm flex items-center border border-gray-200"
                  >
                    {sub}
                    <button
                      type="button"
                      className="ml-2 cursor-pointer text-gray-500 hover:text-black"
                      onClick={() => handleRemoveSubCategory(index)}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Category Description */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="category-description">
            Category Description
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            id="category-description"
            placeholder="Write your description here..."
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Visibility Status and Discounts/Offers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="visibility-status">
              Visibility Status
            </label>
            <select
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none cursor-pointer"
              id="visibility-status"
              value={visibilityStatus}
              onChange={(e) => setVisibilityStatus(e.target.value)}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Draft</option>
              <option>Scheduled</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="discounts-offers">
              Discount (%)
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                id="discounts-offers"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
          <button
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            type="button"
            onClick={() => setShowAddCategory(false)}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            type="submit"
          >
            <PlusCircle size={18} className="mr-2" />
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
};

//!  Edit category

const EditCategory = ({ setEditCategory }) => {
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState("Active");
  const [discount, setDiscount] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const fetchCategory = async () => {
      const id = localStorage.getItem("categoryId"); // Get categoryId from localStorage
      setCategoryId(id);
      if (!id) return; // Prevent request if id is missing

      try {
        const category = await getCategoryService(id);
        setCategoryName(category.name);
        setDescription(category.description);
        setSubCategories(category?.subCategories || []);
        setDiscount(category.discount);
      
      } catch (error) {
        showNotification("Error fetching category: " + error.message, "error");
        console.error("Error fetching category:", error.message);
      }
    };

    fetchCategory();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !categoryId ||
      !categoryName ||
      !description ||
      !subCategories ||
      !discount ||
      !visibilityStatus
    ) {
      showNotification("All fields are required!", "error");
      return;
    }
    try {
      const data = await editCategories({
        categoryId,
        categoryName,
        description,
        subCategories,
        discount,
        visibilityStatus,
      });
      showNotification(data.message || "Category updated successfully", "success");
    } catch (error) {
      showNotification(error.response?.data?.message || "Update failed", "error");
    }
  };

  const handleSubCatDelete = (ind) => {
    const result = window.confirm("Do you want to remove this subcategory?");
    if (result) {
      const filteredCategory = subCategories.filter((cat, id) => id !== ind);
      setSubCategories(filteredCategory);
    }
  };


  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

 
  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      {/* Header with Logo */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-black text-white p-2 rounded-md mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Edit Category</h1>
        </div>
        <button 
          onClick={() => {
            localStorage.removeItem("categoryId");
            setEditCategory(false);
          }} 
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`mb-4 p-3 rounded-md flex items-center ${
          notification.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
        }`}>
          {notification.type === "error" ? 
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg> : 
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          }
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section - Main information */}
          <div className="md:col-span-2 space-y-6">
            {/* Category Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="category-name">
                Category Name
              </label>
              <input
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
              />
            </div>

            {/* Category Description */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="category-description">
                Category Description
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                id="category-description"
                placeholder="Write your description here..."
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

      
        </div>

        {/* Subcategories Section */}
        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="subcategories">
            Subcategories
          </label>
          <div className="flex mb-3">
            <input
              type="text"
              placeholder="Enter new subcategory"
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const trimmedSubCat = newSubCategory.trim();
                  if (trimmedSubCat && !subCategories.some(subCat => subCat.toLowerCase() === trimmedSubCat.toLowerCase())) {
                    setSubCategories([...subCategories, trimmedSubCat]);
                    setNewSubCategory("");
                  } else if (trimmedSubCat) {
                    showNotification("Duplicate subcategories not allowed", "error");
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const trimmedSubCat = newSubCategory.trim();
                if (trimmedSubCat) {
                  if (!subCategories.some(subCat => subCat.toLowerCase() === trimmedSubCat.toLowerCase())) {
                    setSubCategories([...subCategories, trimmedSubCat]);
                    setNewSubCategory("");
                  } else {
                    showNotification("Duplicate subcategories not allowed", "error");
                  }
                }
              }}
              className="bg-black text-white px-6 py-3 rounded-r-lg hover:bg-gray-800 transition-colors flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            {subCategories.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {subCategories.map((subcat, ind) => (
                  <div
                    key={ind}
                    className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-300 hover:border-gray-400 group transition-colors"
                  >
                    <input
                      className="border-none focus:ring-0 bg-transparent outline-none"
                      type="text"
                      value={subcat}
                      onChange={(e) => {
                        const newSubCategories = [...subCategories];
                        newSubCategories[ind] = e.target.value;
                        setSubCategories(newSubCategories);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleSubCatDelete(ind)}
                      className="ml-2 text-gray-400 hover:text-black transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No subcategories added yet.</p>
            )}
          </div>
        </div>

        {/* Settings Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="visibility-status">
              Visibility Status
            </label>
            <select
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent appearance-none cursor-pointer"
              id="visibility-status"
              value={visibilityStatus}
              onChange={(e) => setVisibilityStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Draft">Draft</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="discount">
              Discount (%)
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                id="discount"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Enter discount percentage"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
          <button
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            type="button"
            onClick={() => {
              localStorage.removeItem("categoryId");
              setEditCategory(false);
            }}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center"
            type="submit"
          >
            <Save size={18} className="mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

const RemovedCategory = ({ setShowRemovedCategory, showRemovedCategory }) => {
  const [loading, setLoading] = useState(true);
  const [categorieList, setCategoryList] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

  // Define fetchCategories outside useEffect so it can be used by child components
  const fetchCategoriesHandler = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories(); // Using the same function name
      setCategoryList(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesHandler();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <Trash size={24} />
          </div>
          <h1 className="text-3xl font-bold">Removed Categories</h1>
        </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowRemovedCategory(false)}
              className="bg-black text-white w-[140px] h-[40px] rounded-md flex justify-center items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add
            </button>
            <button
              onClick={() => setShowRemovedCategory(false)}
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <i className="fa-solid fa-user mr-2"></i>
              <span>Active</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Product ID</th>
              <th className="py-3 px-4 text-left">owner</th>
              <th className="py-3 px-4 text-left">Brand</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {" "}
            {loading
              ? [...Array(8)].map((_, index) => (
                  <CategoryCardShimmer key={index} />
                ))
              : categorieList.map((category) => (
                  <CategoryCard
                    key={category._id}
                    id={category._id}
                    name={category.name}
                    fetchCategories={fetchCategories}
                    fetchCategoriesHandler={fetchCategoriesHandler}
                    setEditCategory={setEditCategory}
                    showRemovedCategory={showRemovedCategory}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
//!  Category
const Category = () => {
  const [showAddCategory, setShowAddCategory] = useState(
    localStorage.getItem("showAddCategory") === "true"
  );
  const [editCategory, setEditCategory] = useState(
    localStorage.getItem("editCategory") === "true"
  ); // Track the category being edited
  const [showRemovedCategory, setShowRemovedCategory] = useState(
    localStorage.getItem("showRemovedCategory") === "true"
  ); // Track the category being edited

  useEffect(() => {
    localStorage.setItem("showAddCategory", showAddCategory);
    localStorage.setItem("editCategory", editCategory);
    localStorage.setItem("showRemovedCategory", showRemovedCategory);
  }, [showAddCategory, editCategory]);

  return editCategory ? (
    <EditCategory setEditCategory={setEditCategory} />
  ) : showAddCategory ? (
    <AddCategory setShowAddCategory={setShowAddCategory} />
  ) : showRemovedCategory ? (
    <RemovedCategory
      setShowRemovedCategory={setShowRemovedCategory}
      showRemovedCategory={showRemovedCategory}
    />
  ) : (
    <CategoryList
      setEditCategory={setEditCategory}
      setShowAddCategory={setShowAddCategory}
      setShowRemovedCategory={setShowRemovedCategory}
    />
  );
};

export default Category;
