import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

import { TagIcon, Edit, Trash2, CheckCircle } from 'lucide-react';
import {
  deleteCategory,
  restoreCategory,
} from '../../../../services/categoryService';

const CategoryCard = ({
  id,
  fetchCategoriesHandler,
  name,
  fetchCategories,
  setEditCategory,
  showRemovedCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteCategory = async () => {
    try {
      const data = await deleteCategory(id);
      toast.success(data.message);
      fetchCategories('');
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to delete category'
      );
    }
    setIsOpen(false);
  };

  const handleEdit = () => {
    localStorage.setItem('categoryId', id);
    setEditCategory(true);
  };

  const getCategoryColor = () => {
    const colors = ['bg-black'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleRestoreCategory = async () => {
    try {
      const response = await restoreCategory(id);
      if (response.status === 200) {
        toast.success('Category restored!');
      }
      fetchCategoriesHandler();
    } catch (error) {
      console.error('Failed to restore category:', error);
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex items-center">
          <div
            className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg flex items-center justify-center mr-2 sm:mr-3 ${getCategoryColor()}`}
          >
            <TagIcon size={16} sm:size={18} className="text-white" />
          </div>
          <span className="font-medium text-sm sm:text-base text-gray-800">
            {name}
          </span>
        </div>
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6">
        {showRemovedCategory ? (
          <button
            onClick={handleRestoreCategory}
            className="flex items-center justify-end px-2 sm:px-3 py-1 sm:py-2 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors text-xs sm:text-sm"
          >
            <CheckCircle size={14} sm:size={16} className="mr-1 sm:mr-2" />
            Restore
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 transition-colors text-xs sm:text-sm"
            >
              <Edit size={14} sm:size={16} className="mr-1 sm:mr-2" />
              Edit
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center px-2 sm:px-3 py-1 sm:py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-xs sm:text-sm"
            >
              <Trash2 size={14} sm:size={16} className="mr-1 sm:mr-2" />
              Remove
            </button>
          </div>
        )}
      </td>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="fixed text-xs sm:text-sm top-6 left-1/2 transform -translate-x-1/2 w-80 sm:w-96 bg-black border-gray-700 p-4 sm:p-5 rounded-lg shadow-lg text-center">
              <div className="flex flex-col items-center justify-center gap-2">
                <img
                  className="h-6 sm:h-8 w-6 sm:w-8 animate-bounce"
                  src="https://static.thenounproject.com/png/16960-200.png"
                  alt=""
                  style={{ filter: 'invert(1)' }}
                />
                <p className="text-white font-bold text-xs sm:text-sm">
                  Do you want to delete this category?
                </p>
              </div>
              <div className="mt-3 sm:mt-4 flex justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleDeleteCategory}
                  className="bg-gray-200 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm text-black cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-red-500 px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm text-white font-bold hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </tr>
  );
};

export default CategoryCard;

export const CategoryCardShimmer = () => (
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
