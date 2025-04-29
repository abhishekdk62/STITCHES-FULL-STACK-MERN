import apiClient from './apiClient';

export const restoreCategory = async (id) => {
  try {
    const response = await apiClient.put('/admin/restorecat', { id });

    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addCategory = async ({
  categoryName,
  description,
  subCategories,
  discount,
}) => {
  try {
    const response = await apiClient.post('/admin/addcategorys', {
      categoryName,
      description,
      subCategories,
      discount,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const editCategories = async ({
  categoryId,
  categoryName,
  description,
  subCategories,
  discount,
  visibilityStatus,
}) => {
  try {
    const response = await apiClient.post('/admin/editcategories', {
      id: categoryId,
      name: categoryName,
      description,
      subCategories,
      discount,
      visibilityStatus,
    });
    return response.data; // Return response data so the component can use it
  } catch (error) {
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await apiClient.get('/admin/searchdeletedcat');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoriesAdmin = async () => {
  try {
    const response = await apiClient.get('/admin/searchcategories?q=');
    return response.data.categories;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    // Call the soft-delete endpoint for the given category id
    const response = await apiClient.put(`/admin/softdelete/${id}`, {
      isDeleted: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoriesService = async (query = '', page = 1) => {
  try {
    const response = await apiClient.get(
      `/admin/searchcategories?q=${query}&page=${page}&limit=10`
    );
    // Expected backend response: { categories, total, page, totalPages }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryService = async (id) => {
  try {
    const response = await apiClient.post(`/admin/getcategory/${id}`);
    return response.data.data; // Expected to return the category data
  } catch (error) {
    throw error;
  }
};
