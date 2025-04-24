import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import CategoryCard, { CategoryCardShimmer } from "./CategoryCard";
import { fetchCategories } from "../../../../services/categoryService";

const RemovedCategory = ({ setShowRemovedCategory, showRemovedCategory }) => {
  const [loading, setLoading] = useState(true);
  const [categorieList, setCategoryList] = useState([]);
  

  const fetchCategoriesHandler = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategoryList(data);
    } catch (error) {
      console.error("Error fetching removed categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesHandler();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="mb-8 flex items-center">
            <div className="bg-black text-white p-3 rounded-full mr-4">
              <Trash size={24} />
            </div>
            <h1 className="text-3xl font-bold">Removed Categories</h1>
          </div>
          <button
            onClick={() => setShowRemovedCategory(false)}
            className="bg-black text-white w-[140px] h-[40px] rounded-md flex justify-center items-center"
          >
            Back
          </button>
        </div>

        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-3 px-4 text-left">Category Name</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {loading
              ? [...Array(8)].map((_, index) => <CategoryCardShimmer key={index} />)
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
  );
};

export default RemovedCategory;