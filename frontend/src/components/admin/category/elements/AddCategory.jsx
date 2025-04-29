import React, { useState } from 'react';
import { PlusCircle, AlertCircle, Check, X } from 'lucide-react';
import { addCategory } from '../../../../services/categoryService';

const AddCategory = ({ setShowAddCategory }) => {
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [visibilityStatus, setVisibilityStatus] = useState('Active');
  const [discount, setDiscount] = useState('10');
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: '',
  });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: '', type: '' }),
      3000
    );
  };

  const handleAddSubCategory = () => {
    if (
      subCategoryInput.toLowerCase().trim() !== '' &&
      !subCategories.includes(subCategoryInput.toLowerCase().trim())
    ) {
      setSubCategories([...subCategories, subCategoryInput.trim()]);
      setSubCategoryInput('');
    } else {
      showNotification('No duplicates allowed', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !description || !subCategories.length || !discount) {
      showNotification('All fields are required!', 'error');
      return;
    }
    try {
      await addCategory({
        categoryName,
        description,
        subCategories,
        discount,
      });
      showNotification('Category added successfully!', 'success');
      setCategoryName('');
      setSubCategoryInput('');
      setDescription('');
      setSubCategories([]);
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'An error occurred',
        'error'
      );
    }
  };

  const handleRemoveSubCategory = (index) => {
    const updatedSubCategories = subCategories.filter((_, i) => i !== index);
    setSubCategories(updatedSubCategories);
  };

  return (
    <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-black text-white p-2 rounded-md mr-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
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
        <div
          className={`mb-4 p-3 rounded-md flex items-center ${
            notification.type === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="mr-2" size={18} />
          ) : (
            <Check className="mr-2" size={18} />
          )}
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Category Name */}
            <div>
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="category-name"
              >
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
              <label
                className="block text-gray-700 font-semibold mb-2"
                htmlFor="sub-category"
              >
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
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddSubCategory())
                  }
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
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="category-description"
          >
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
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="visibility-status"
            >
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
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="discounts-offers"
            >
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
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                %
              </span>
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

export default AddCategory;
