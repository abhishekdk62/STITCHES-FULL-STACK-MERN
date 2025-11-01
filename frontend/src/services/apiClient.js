import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent infinite loop of refresh token requests
let isRefreshing = false;
// Store failed requests to retry them after token refresh
let failedQueue = [];

const publicEndpoints = [
  '/user/products',
  '/user/new-arrivals',
  '/user/categoryWiseProducs',
  '/user/getsimilarproducts',
  '/user/searchcategoriestofilter',
  '/user/getcategoryname',
  '/user/check',
  '/user/login',
  '/user/signup',
  '/user/send-otp',
  '/user/verify-otp',
  '/user/update-password',
  '/user/signupotp',
  '/user/verifysignupotp',
];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    const isPublicRequest = publicEndpoints.some((endpoint) =>
      originalRequest.url.includes(endpoint)
    );

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/refreshToken') &&
      !isPublicRequest
    ) {
      if (isRefreshing) {
        // Add to queue and wait for refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return apiClient
        .get('/user/refreshToken')
        .then(() => {
          processQueue(null);
          return apiClient(originalRequest);
        })
        .catch((refreshError) => {
          processQueue(refreshError);
          console.log('Refresh token expired or invalid');

          localStorage.removeItem('userId');
          localStorage.removeItem('role');

          if (window.reduxStore) {
            window.reduxStore.dispatch({ type: 'auth/logout' });
          }

          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    return Promise.reject(err);
  }
);

export default apiClient;
