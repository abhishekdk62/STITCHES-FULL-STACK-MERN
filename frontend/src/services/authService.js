import apiClient from './apiClient';

export const verifyUser = async () => {
  try {
    const res = await apiClient.get('/user/check');
    return res.data;
  } catch (err) {
    if (err.response?.status === 403) {
      throw new Error('User blocked');
    }
    throw err;
  }
};
