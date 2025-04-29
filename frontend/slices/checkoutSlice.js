import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedTab: 'myinfo',
  shippingAddress: null,
  shippingAddressEdit: null,
  billingAddress: null,
  paymentMethod: null,
  coupon: null,
  cart: { items: [], totalPrice: 0 }, // Added cart state to store cart details
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setShippingAddressEdit: (state, action) => {
      state.shippingAddressEdit = action.payload;
    },
    setBillingAddress: (state, action) => {
      state.billingAddress = action.payload;
    },
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    setCoupon: (state, action) => {
      state.coupon = action.payload;
    },
    setCart: (state, action) => {
      // Updates the cart data (items and totalPrice)
      state.cart = action.payload;
    },
    resetCheckout: (state) => {
      state.selectedTab = initialState.selectedTab;
      state.shippingAddress = null;
      state.shippingAddressEdit = null;
      state.billingAddress = null;
      state.paymentMethod = null;
      state.coupon = null;
      state.cart = initialState.cart;
    },
  },
});

export const {
  setSelectedTab,
  setShippingAddress,
  setShippingAddressEdit,
  setBillingAddress,
  setPaymentMethod,
  setCoupon,
  setCart,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
