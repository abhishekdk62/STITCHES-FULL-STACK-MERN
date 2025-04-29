import React, { useState, useEffect } from 'react';
import OrderList from './elements/OrderList';
import { fetchOrdersAdmin } from '../../../services/orderServices';
import { useDebounce } from '../../../../utils/useDebounce';

const Orders = ({ setActiveTab }) => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const debouncedValue = useDebounce(searchInput.trim(), 500);

  const getOrders = async (search = '', page = 1) => {
    setLoading(true);
    try {
      const response = await fetchOrdersAdmin(search, page);
      setOrderList(response.data.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  useEffect(() => {
    getOrders(debouncedValue);
  }, [debouncedValue]);
  return (
    <OrderList
      orderList={orderList}
      loading={loading}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      getOrders={getOrders}
      error={error}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      setActiveTab={setActiveTab}
    />
  );
};

export default Orders;
