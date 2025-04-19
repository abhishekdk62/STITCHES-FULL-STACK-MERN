import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderDetail: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderDetail: (state, action) => {
      state.orderDetail = action.payload;
    },
    clearOrderDetail: (state) => {
      state.orderDetail = null;
    },
  },
});

export const { setOrderDetail, clearOrderDetail } = orderSlice.actions;
export default orderSlice.reducer;
