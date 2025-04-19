import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import searchReducer from "../slices/searchSlice";
import selectedTabReducer from "../slices/selectedTabSlice";
import checkoutReducer from "../slices/checkoutSlice";
import orderReducer from "../slices/orderSlice"; // Import the order slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    selectedTab: selectedTabReducer,
    checkout: checkoutReducer,
    order: orderReducer,
  },
});

export default store;
