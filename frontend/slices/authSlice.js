import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  userId: null,
  role: null,
  user: null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { userId, role,user } = action.payload;
      state.isAuthenticated = true;
      state.userId = userId;
      state.role = role;
      state.user=user;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;
      state.user = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload; 
    },

  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
