import axios from 'axios';
import apiClient from './apiClient';

export const getTransactionsApi = async () => {
  try {
    const response = await apiClient.get(`/user/transactions`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addMoneyPaypalApi = async (data) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/paypal/add-money',
      data
    );

    return response.data;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
};

export const captureWalletPaymentApi = async (orderID, userId) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/paypal/capture-wallet-payment',
      {
        orderID,
        userId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchTransactionsService = async (query, page) => {
  try {
    const response = await apiClient.get(
      `/admin/transactions?query=${query}&page=${page}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};
