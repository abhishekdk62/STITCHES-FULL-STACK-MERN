import React, { useEffect, useState } from 'react';
import { Trash } from 'lucide-react';
import CategoryCard, { CategoryCardShimmer } from './CategoryCard';
import { fetchCategories } from '../../../../services/categoryService';

const RemovedCategory = ({ setShowRemovedCategory, showRemovedCategory }) => {
  const [loading, setLoading] = useState(true);
  const [categorieList, setCategoryList] = useState([]);

  const fetchCategoriesHandler = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategoryList(data);
    } catch (error) {
      console.error('Error fetching removed categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesHandler();
  }, []);

  return (
    <div className="w-full mx-auto max-w-7xl p-4 sm:p-6 pb-16 sm:pb-20 bg-white rounded-lg shadow-lg border border-gray-100 ">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center">
            <div className="bg-black text-white p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
              <Trash size={20} sm:size={24} />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold">
              Removed Categories
            </h1>
          </div>
          <button
            onClick={() => setShowRemovedCategory(false)}
            className="bg-black text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md flex justify-center items-center text-sm sm:text-base"
          >
            Back
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 text-black">
              <tr>
                <th className="py-2 sm:py-3 px-3 sm:px-4 text-left text-sm sm:text-base">
                  Category Name
                </th>
                <th className="py-2 sm:py-3 px-3 sm:px-4 text-left text-sm sm:text-base">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {loading
                ? [...Array(8)].map((_, index) => (
                    <CategoryCardShimmer key={index} />
                  ))
                : categorieList.map((category) => (
                    <CategoryCard
                      key={category._id}
                      id={category._id}
                      name={category.name}
                      fetchCategoriesHandler={fetchCategoriesHandler}
                      showRemovedCategory={showRemovedCategory}
                    />
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RemovedCategory;
