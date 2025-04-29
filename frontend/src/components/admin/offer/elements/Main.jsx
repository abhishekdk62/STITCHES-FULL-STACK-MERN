import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BadgeDollarSign,
  ChartBarStacked,
  Package,
  CircleArrowLeft,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { applyCatOffer } from '../../../../services/offerServices';
import { fetchCategoriesAdmin } from '../../../../services/categoryService';

const Main = ({ setTab, setSelectedCatId }) => {
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState();
  const [listOpen, setListOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [offer, setOffer] = useState('');
  const [err, setErr] = useState('');

  const getCategories = async () => {
    try {
      const response = await fetchCategoriesAdmin();
      setCategories(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const applyOffers = async () => {
    if (offer <= 0 || offer >= 100) {
      setErr('Please enter a valid offer value');
      return;
    }
    try {
      await applyCatOffer(catId, offer);
      toast.success('Offer applied successfully!');
      setErr('');
      setOffer('');
      getCategories();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || 'Failed to apply offer');
    }
    setModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 bg-opacity-50"
          >
            <div className="bg-white text-black w-72 sm:w-80 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-700">
              <h2 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-center">
                Set Offer Percentage
              </h2>
              <input
                type="number"
                placeholder="Enter %"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-full px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-sm sm:text-base font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {err && (
                <p className="text-red-500 text-xs sm:text-sm text-center">
                  {err}
                </p>
              )}
              <div className="mt-4 sm:mt-6 flex justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setErr('');
                    setModal(false);
                  }}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={applyOffers}
                  className="px-3 sm:px-4 py-1 sm:py-2 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition text-xs sm:text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 pb-16 sm:pb-20">
        <div className="mb-6 sm:mb-8 flex justify-between">
          <div className="flex items-center">
            <div className="bg-black text-white p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
              <Package size={20} sm:size={24} />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold">
              Products Management
            </h1>
          </div>
          <button onClick={() => setTab('main')}>
            <CircleArrowLeft
              size={28}
              sm:size={32}
              className="cursor-pointer"
            />
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Category List</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div
                key={category._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-black text-white p-1.5 rounded-full">
                      <ChartBarStacked size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {category._id}
                      </p>
                      <p className="text-xs text-gray-500">
                        Discount Percentage: {category.discount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedCatId(category._id);
                        setTab('prods');
                      }}
                      className="text-xs bg-yellow-400 text-white p-2 rounded-md hover:bg-yellow-500 transition-colors"
                    >
                      Apply Product Offer
                    </button>
                    <button
                      onClick={() => {
                        setCatId(category._id);
                        setModal(true);
                      }}
                      className="text-xs bg-green-400 text-white p-2 rounded-md hover:bg-green-500 transition-colors"
                    >
                      Apply Category Offer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
