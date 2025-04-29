import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { fetchUsers, updateStatus } from '../../../services/userService';
import SearchBar from './elements/SearchBar';
import CustomerList from './elements/CustomerList';
import Pagination from './elements/Pagination';
import ShimmerUI from './elements/ShimmerUI';
import { useDebounce } from '../../../../utils/useDebounce';

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedValue = useDebounce(searchInput, 500);

  const getUsers = async (searchQuery = '', page = 1) => {
    setLoading(true);
    try {
      const data = await fetchUsers(searchQuery, page);
      setUserList(data.users);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setError('');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError('No users found');
          setUserList([]);
        } else {
          setError(err.response.data.message || 'Server error');
        }
      } else if (err.request) {
        setError('No response from server');
      } else {
        setError('Error fetching users');
      }
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers('', 1);
  }, []);

  useEffect(() => {
    getUsers(debouncedValue);
  }, [debouncedValue]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const data = await updateStatus(id, status);
      setUserList((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: data.updatedUser.status } : user
        )
      );
    } catch (err) {
      console.error(
        'Error updating status:',
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full mx-auto  pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <div className="md:text-xl text-sm font-bold text-black tracking-tight">
            <User size={24} />
          </div>
          <h1 className="md:text-2xl sm:text-xl font-bold">
            Customer Management
          </h1>
        </div>

        {/* Search Bar */}
        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          getUsers={getUsers}
        />

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

        {/* Customers Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 py-4 px-6">
            <h2 className="font-semibold text-lg">Customer List</h2>
          </div>

          {loading ? (
            <ShimmerUI />
          ) : (
            <CustomerList
              userList={userList}
              handleUpdateStatus={handleUpdateStatus}
            />
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          getUsers={getUsers}
          searchInput={searchInput}
        />
      </div>
    </div>
  );
};

export default UserList;
