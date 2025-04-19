import apiClient from "./apiClient";

export const fetchUsers = async (searchQuery = "", page = 1) => {
  try {
    const queryString = searchQuery
      ? `?q=${searchQuery}&page=${page}&limit=10`
      : `?page=${page}&limit=6`;
    const response = await apiClient.get(`/admin/searchusers${queryString}`);
    return response.data; // Expected to include { users, page, totalPages, ... }
  } catch (error) {
    throw error;
  }
};

export const updateStatus = async (id, status) => {
  try {
    const { data } = await apiClient.post("/user/update", { _id: id, status });
    return data; // Expected to include updatedUser or a confirmation message
  } catch (error) {
    throw error;
  }
};

export const sendOTP = async (email) => {
  try {
    const response = await apiClient.post("/user/send-otp", { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await apiClient.post("/user/verify-otp", { email, otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (email, password) => {
  try {
    const response = await apiClient.post("/user/update-password", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutAdmin = async () => {
  try {
    // Since apiClient already has withCredentials and base URL configured,
    // you don't need to include them here.
    const response = await apiClient.post("/user/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post("/user/login", { email, password });
    return response.data; // Expected to include { userId, role }
  } catch (error) {
    throw error;
  }
};

export const getRatingsService = async () => {
  try {
    const response = await apiClient.get("/user/ratings");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoriesForFilter = async (query = "") => {
  try {
    const response = await apiClient.get(
      `/user/searchcategoriestofilter?q=${query}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.post("/user/logout");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const sendSignupOTP = async (email) => {
  try {
    const response = await apiClient.post("/user/signupotp", { email });
    return response.data; // Expected to return OTP sending status/info
  } catch (error) {
    throw error;
  }
};

export const verifySignupOTP = async (email, otp) => {
  try {
    const response = await apiClient.post("/user/verifysignupotp", {
      email,
      otp,
    });
    return response.data; // Expected to indicate whether verification was successful
  } catch (error) {
    throw error;
  }
};

export const completeSignup = async (signupData) => {
  try {
    const response = await apiClient.post("/user/signup", signupData, {
      withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    throw error;
  }
};

export const addAddress = async (addressData) => {
  try {
    const respone = await apiClient.post("/user/address", addressData, {
      withCredentials: true,
    });

    return respone.data;
  } catch (error) {
    throw error;
  }
};
export const editAddress = async (addressData, id) => {
  try {
    const respone = await apiClient.put(`/user/address/${id}`, addressData, {
      withCredentials: true,
    });

    return respone.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await apiClient.delete(`/user/address/${id}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (updatedData) => {
  try {
    const respone = await apiClient.put("/user/userProfile", updatedData, {
      withCredentials: true,
    });

    return respone.data;
  } catch (error) {
    throw error;
  }
};

export const requestEmailChange = async (newEmail) => {
  try {
    const response = await apiClient.post(
      "/user/email",
      { newEmail }, // Ensure only newEmail is sent
      { withCredentials: true }
    );

    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to request email change." }
    );
  }
};

export const verifyEmailOTP = async (newEmail, otp) => {
  try {
    const response = await apiClient.post(
      "/user/email/verify",
      { newEmail, otp },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await apiClient.post(
      "/user/password",
      { oldPassword, newPassword },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToCartApi = async (pid, vid, quantity) => {
  try {
    const response = await apiClient.post(
      "/user/cart",
      { productId: pid, variantId: vid, quantity },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getCartItems = async () => {
  try {
    const respone = await apiClient.get("/user/cart");
    return respone.data;
  } catch (error) {
    throw error;
  }
};

export const changeQuantityApi = async (cid, pid, vid, quantity) => {
  try {
    const respone = await apiClient.put("/user/cart", {
      cid,
      pid,
      vid,
      quantity,
    });
    return respone;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (pid, cid) => {
  try {
    const respone = await apiClient.delete(`/user/cart`, {
      data: {
        itemId: pid,
        cartId: cid,
      },
    });
    return respone;
  } catch (error) {
    throw error;
  }
};
