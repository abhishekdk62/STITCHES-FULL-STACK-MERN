import apiClient from './apiClient';

export const addCoupon = async (couponData) => {
  try {
    const response = await apiClient.post('/admin/addcoupon', couponData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCouponsService = async (searchQuery, page = 1) => {
  try {
    const limit = 10;
    const response = await apiClient.get(
      `/admin/searchcoupons/?q=${searchQuery}&page=${page}&limit=${limit}`
    );
    // Expected response structure: { coupon, totalPages }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Service function to perform a soft delete on a coupon.
export const softDeleteCouponService = async (id) => {
  try {
    const response = await apiClient.put(`/admin/softdeletecoupon/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const editCoupon = async (couponId, updateData) => {
  try {
    const response = await apiClient.post(
      `/admin/editcoupon/${couponId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDeletedCoupons = async (searchQuery = '', page = 1) => {
  try {
    const limit = 10;
    const response = await apiClient.get(
      `/admin/searchdeletedcoupons/?q=${searchQuery}&page=${page}&limit=${limit}`
    );
    // Expected response structure: { coupons, totalPages, ... }
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Service function to restore a coupon.
export const restoreCoupon = async (id) => {
  try {
    const response = await apiClient.put(`/admin/restorecoupon/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCoupons = async () => {
  try {
    const response = await apiClient.get('/user/coupons');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const appllyCouponApi = async (couponCode, finalTotal) => {
  try {
    const response = await apiClient.post('/user/coupon', {
      couponCode,
      finalTotal,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
