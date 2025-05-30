import React, { useState, useEffect } from 'react';
import {
  Tag,
  Search,
  X,
  RefreshCw,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ChartColumnStacked,
} from 'lucide-react';
import CategoryCard from './CategoryCard';
import { fetchCategoriesService } from '../../../../services/categoryService';
import { CategoryCardShimmer } from './CategoryCard';
import Pagination from '../../../common/utils/Pagination';
import { useDebounce } from '../../../../../utils/useDebounce';
import toast from 'react-hot-toast';

const CategoryList = ({
  setShowAddCategory,
  setEditCategory,
  setShowRemovedCategory,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [categorieList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedValue = useDebounce(searchInput.trim(), 500);

  const fetchCategories = async (query = '', page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategoriesService(query, page);
      setCategoryList(data.categories);
      setTotalPages(data.totalPages);
      setCurrentPage(data.page);
    } catch (err) {
      setError('Failed to fetch categories. Please try again.');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setIsRefreshing(true);

    fetchCategories(debouncedValue, currentPage).finally(() => {
      setTimeout(() => setIsRefreshing(false), 500);
    });
  };

  useEffect(() => {
    setCurrentPage(1);

    fetchCategories('', 1);
  }, []);

  useEffect(() => {
    fetchCategories(debouncedValue, currentPage);
  }, [currentPage, debouncedValue]);

  const handleSearch = () => {
    setCurrentPage(1);

    fetchCategories(debouncedValue, 1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 pb-16 sm:pb-20 bg-gray-50 w-full min-h-screen">
      <div className="">
        <div className="mb-6 sm:mb-8 flex items-center">
          <div className="bg-black text-white p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
            <ChartColumnStacked size={20} sm:size={24} />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">Category Management</h1>
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
                  className="pl-10 pr-10 py-1 sm:py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70 text-sm sm:text-base"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput('');
                      setCurrentPage(1);
                      fetchCategories('', 1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setShowAddCategory(true)}
                className="bg-black text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md flex items-center transition-all hover:bg-gray-800 text-sm sm:text-base"
              >
                <Plus size={18} className="mr-2" />
                <span>Add Category</span>
              </button>
              <button
                onClick={() => setShowRemovedCategory(true)}
                className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md flex items-center transition-all hover:bg-red-600 text-sm sm:text-base"
              >
                <Trash2 size={18} className="mr-2" />
                <span>View Removed</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
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
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <CategoryCardShimmer key={index} />
                ))
              ) : categorieList.length > 0 ? (
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
                  <td
                    colSpan="2"
                    className="py-8 px-6 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Tag size={40} className="text-gray-300 mb-3" />
                      <p className="text-lg font-medium">No categories found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting your search or add a new category
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CategoryList;
