import apiClient from './apiClient';

export const getWishlistApi = async () => {
  try {
    const respone = await apiClient.get('/user/wishlist');
    return respone;
  } catch (error) {
    throw error;
  }
};
export const addToWishlist = async (pid, selectedVariant) => {
  try {
    const response = apiClient.post('/user/wishlist', {
      productId: pid,
      selectedVariant,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const removeWishlistItem = async (id) => {
  try {
    const response = await apiClient.delete(`/user/wishlist/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};
