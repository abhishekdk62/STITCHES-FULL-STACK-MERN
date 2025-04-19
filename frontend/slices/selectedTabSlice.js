import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTab: "myinfo",
};

const selectedTabSlice = createSlice({
  name: "selectedTab",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = selectedTabSlice.actions;
export default selectedTabSlice.reducer;
