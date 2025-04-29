import apiClient from './apiClient';
import { debounce } from 'lodash';

export const addProduct = async (productData) => {
  try {
    const response = await apiClient.post('/admin/addProduct', productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProduct = async (id) => {
  try {
    const response = await apiClient.post(`/admin/getproduct/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await apiClient.get('/admin/searchdeletedproducts');
    return response;
  } catch (error) {
    throw error;
  }
};

// Function to restore a product
export const restoreProduct = async (id) => {
  try {
    const response = await apiClient.put('/admin/restoreprod', { id });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchMensProducts = async () => {
  try {
    const response = await apiClient.post('/user/categoryWiseProducs', {
      catName: 'Men',
    });
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};
export const fetchWomenProducts = async () => {
  try {
    const response = await apiClient.post('/user/categoryWiseProducs', {
      catName: 'Women',
    });
    return response.data.data || [];
  } catch (error) {
    throw error;
  }
};

export const getProductsService = async (requestBody) => {
  try {
    const response = await apiClient.post('/user/products', requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchProductsService = async (query = '', page = 1) => {
  try {
    const response = await apiClient.get(
      `/admin/searchproducts?q=${query}&page=${page}&limit=8`
    );
    // Expected response structure: { products: [...], page: number, totalPages: number }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const debouncedFetchProductsService = debounce(
  fetchProductsService,
  500 // Adjust the debounce delay (500ms)
);

// Soft delete a product by ID.
export const softDeleteProductService = async (id) => {
  try {
    const response = await apiClient.put(`/admin/softdeleteproduct/${id}`, {});
    return response;
  } catch (error) {
    throw error;
  }
};

export const editProductService = async (productId, payload) => {
  try {
    const response = await apiClient.put(
      `/admin/editproduct/${productId}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await apiClient.post(`/admin/getproduct/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Fetch reviews for a product
export const fetchProductReviews = async (productId) => {
  try {
    const response = await apiClient.post('/user/reviews', { productId });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Add a review for a product
export const addReview = async (newReview, productId, userId) => {
  try {
    const response = await apiClient.post('/user/review', {
      newReview,
      productId,
      userId,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Fetch category name by ID
export const getCategoryName = async (categoryId) => {
  try {
    const response = await apiClient.post('/user/getcategoryname', {
      id: categoryId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch similar products based on category ID
export const getSimilarProducts = async (categoryId) => {
  try {
    const response = await apiClient.post('/user/getsimilarproducts', {
      categoryId,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Fetch product rating
export const getProductRating = async (productId) => {
  try {
    const response = await apiClient.post('/user/rating', {
      id: productId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchNewArrivalsService = async () => {
  try {
    const response = await apiClient.get('/user/new-arrivals');
    // Adjust based on your response structure
    return response.data.data || response.data;
  } catch (error) {
    throw error;
  }
};
export const checkInCartApi = async (pid, vid) => {
  try {
    const response = await apiClient.post('/user/checkincart', { pid, vid });
    // Adjust based on your response structure
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductsByCatApi = async (cid) => {
  try {
    const response = await apiClient.get(`/admin/productsbycat/${cid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
