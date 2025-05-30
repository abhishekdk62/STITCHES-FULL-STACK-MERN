import React, { useState, useEffect } from 'react';
import { Save, Plus, X, Tag, ChartColumnStacked } from 'lucide-react';
import {
  editCategories,
  getCategoryService,
} from '../../../../services/categoryService';

const EditCategory = ({ setEditCategory }) => {
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [visibilityStatus, setVisibilityStatus] = useState('Active');
  const [discount, setDiscount] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [newSubCategory, setNewSubCategory] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });

  useEffect(() => {
    const fetchCategory = async () => {
      const id = localStorage.getItem('categoryId');
      setCategoryId(id);
      if (!id) return;

      try {
        const category = await getCategoryService(id);
        setCategoryName(category.name);
        setDescription(category.description);
        setSubCategories(category?.subCategories || []);
        setDiscount(category.discount);
      } catch (error) {
        showNotification('Error fetching category: ' + error.message, 'error');
      }
    };

    fetchCategory();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: '', type: '' }),
      3000
    );
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
      showNotification('All fields are required!', 'error');
      return;
    }

    const uniqueSubcats = new Set(subCategories.map(s => s.toLowerCase()));
    if (uniqueSubcats.size !== subCategories.length) {
      showNotification("Please remove duplicate subcategories before submitting.",'error');
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
      showNotification(
        data.message || 'Category updated successfully',
        'success'
      );
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Update failed',
        'error'
      );
    }
  };

  const handleSubCatDelete = (ind) => {
    const filteredCategory = subCategories.filter((_, id) => id !== ind);
    setSubCategories(filteredCategory);
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6 pb-16 sm:pb-20 bg-gray-50 w-full min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center">
       
          <div className="mb-6 sm:mb-8 flex items-center">
          <div className="bg-black text-white p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
            <ChartColumnStacked size={20} sm:size={24} />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">Edit Category</h1>
        </div>

        </div>
        <button
          onClick={() => {
            localStorage.removeItem('categoryId');
            setEditCategory(false);
          }}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Notification */}
      {notification.show && (
        <div
          className={`mb-4 p-3 sm:p-4 rounded-md flex items-center ${
            notification.type === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {notification.type === 'error' ? (
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="mb-4 sm:mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
            htmlFor="category-name"
          >
            Category Name
          </label>
          <input
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm sm:text-base"
            id="category-name"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>

        {/* Subcategories */}
        <div className="mb-4 sm:mb-6">
          <label
            className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base"
            htmlFor="subcategories"
          >
            Subcategories
          </label>
          <div className="flex mb-3">
            <input
              type="text"
              placeholder="Enter new subcategory"
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
              className="flex-grow px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-l-lg text-sm sm:text-base"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const trimmed = newSubCategory.trim();
                  if (trimmed && !subCategories.includes(trimmed)) {
                    setSubCategories([...subCategories, trimmed]);
                    setNewSubCategory('');
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={() => {
                const trimmed = newSubCategory.trim();
                if (trimmed && !subCategories.includes(trimmed)) {
                  setSubCategories([...subCategories, trimmed]);
                  setNewSubCategory('');
                }
              }}
              className="bg-black text-white px-4 sm:px-6 py-2 sm:py-3 rounded-r-lg text-sm sm:text-base"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {subCategories.map((subcat, index) => (
              <div
                key={index}
                className="flex items-center bg-white px-3 py-2 rounded-lg border border-gray-300"
              >
                <input
                  type="text"
                  value={subcat}
                  onChange={(e) => {
                    const updated = [...subCategories];
                    updated[index] = e.target.value;
                    setSubCategories(updated);
                  }}
                  className="border-none focus:ring-0 bg-transparent text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => handleSubCatDelete(index)}
                  className="ml-2 text-gray-400 hover:text-black"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('categoryId');
              setEditCategory(false);
            }}
            className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 sm:px-6 flex py-2 sm:py-3 bg-black text-white rounded-lg text-sm sm:text-base"
          >
            <Save size={18} className="mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
