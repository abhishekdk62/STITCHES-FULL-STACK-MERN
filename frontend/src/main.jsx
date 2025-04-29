import { createRoot } from 'react-dom/client';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter as Router } from 'react-router-dom';
import authReducer from '../slices/authSlice';
import searchReducer from '../slices/searchSlice';
import cartReducer from '../slices/cartSlice';
import selectedTabReducer from '../slices/selectedTabSlice';
import orderReducer from '../slices/orderSlice';
import checkoutReducer from '../slices/checkoutSlice';
import './index.css';
import App from './App.jsx';
import { Toaster } from 'react-hot-toast';

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    cart: cartReducer,
    selectedTab: selectedTabReducer,
    checkout: checkoutReducer,
    order: orderReducer,
  },
});

// Expose store to window for use in apiClient.js
window.reduxStore = store;

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Router>
      <Toaster
        toastOptions={{
          duration: 2400,
        }}
      />
      <App />
    </Router>
  </Provider>
);
