import React, { useState, useEffect, useDebugValue } from 'react';
import {
  Trash2,
  Eye,
  Search,
  RefreshCw,
  X,
  Plus,
  Lightbulb,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchDeletedCoupons,
  restoreCoupon,
} from '../../../../services/couponService';
import { useDebounce } from '../../../../../utils/useDebounce';

const RemovedCoupons = ({ setSelectedTab }) => {
  const [coupons, setCoupons] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debouncedValue = useDebounce(search, 500);

  const fetchCoupon = async (searchQuery = '', page = 1) => {
    try {
      setLoading(true);
      const data = await fetchDeletedCoupons(searchQuery, page);
      setCoupons(data);
      setTotalPages(data.totalPages);
      setError('');
    } catch (error) {
      setError('Failed to load removed coupons');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupon('');
  }, []);

  useEffect(() => {
    fetchCoupon(debouncedValue);
  }, [debouncedValue]);

  const handleRestore = async (id) => {
    try {
      const data = await restoreCoupon(id);
      toast.success('Coupon restored!', {
        icon: (
          <img
            src="https://static.thenounproject.com/png/412945-200.png"
            className="animate-bounce"
            style={{ filter: 'invert(1)' }}
            alt="Success Icon"
            width="30"
            height="30"
          />
        ),
        style: {
          border: '1px solid #0f5132',
          padding: '16px',
          color: 'white',
          background: 'black',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      });

      fetchCoupon('');
    } catch (error) {
      console.log(
        error.response?.data || 'An error occurred during restoration'
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      
      <div className="max-w-7xl mx-auto p-6 pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="bg-black text-white p-3 rounded-full mr-4">
            <Trash2 size={20} sm:size={24}  />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold">Removed Coupons</h1>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-5 rounded-lg  mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by coupon name or code"
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/70"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch('');
                      fetchCoupon('', 1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedTab('add')}
                className="bg-black text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-gray-800"
              >
                <Plus size={18} className="mr-2" />
                <span>New Coupon</span>
              </button>
              <button
                onClick={() => setSelectedTab('view')}
                className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center transition-all hover:bg-green-600"
              >
                <Eye size={18} className="mr-2" />
                <span>View Active</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
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

        {/* Coupons Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Removed Coupon List</h2>
          </div>

          {loading ? (
            // Shimmer UI while loading
            <div className="p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse mb-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : coupons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-3 text-left font-medium text-gray-600">
                      Name
                    </th>
                    <th className="p-3 text-left font-medium text-gray-600">
                      Code
                    </th>
                    <th className="p-3 text-left font-medium text-gray-600">
                      Type
                    </th>
                    <th className="p-3 text-left font-medium text-gray-600">
                      Value
                    </th>
                    <th className="p-3 text-left font-medium text-gray-600">
                      Expires
                    </th>
                    <th className="p-3 text-left font-medium text-gray-600">
                      Limit
                    </th>
                    <th className="p-3 text-left font-medium text-gray-600">
                      Used
                    </th>
                    <th className="p-3 text-left font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50">
                      <td className="p-3">{coupon.couponName}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {coupon.code}
                        </span>
                      </td>
                      <td className="p-3">{coupon.discountType}</td>
                      <td className="p-3">{coupon.discountValue}</td>
                      <td className="p-3">{coupon.expiryDate}</td>
                      <td className="p-3">{coupon.usageLimit}</td>
                      <td className="p-3">{coupon.usedCount}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => handleRestore(coupon._id)}
                          className="p-1.5 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-md"
                          title="Restore"
                        >
                          <Lightbulb size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Trash2 size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No removed coupons found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or check active coupons.
              </p>
            </div>
          )}
        </div>

        {/* Fixed Pagination UI at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-center items-center space-x-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                if (currentPage > 1) {
                  const newPage = currentPage - 1;
                  setCurrentPage(newPage);
                  fetchCoupon(search.trim(), newPage);
                }
              }}
              disabled={currentPage <= 1}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Previous page"
            >
              <ArrowLeft size={18} />
            </button>

            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => {
                if (currentPage < totalPages) {
                  const newPage = currentPage + 1;
                  setCurrentPage(newPage);
                  fetchCoupon(search.trim(), newPage);
                }
              }}
              disabled={currentPage >= totalPages}
              className="h-10 w-10 flex items-center justify-center rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
              aria-label="Next page"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemovedCoupons;
