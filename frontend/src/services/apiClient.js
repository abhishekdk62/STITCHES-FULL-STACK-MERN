import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent infinite loop of refresh token requests
let isRefreshing = false;
// Store failed requests to retry them after token refresh
let failedQueue = [];

// List of public endpoints that don't require authentication
const publicEndpoints = [
  "/user/products", 
  "/user/new-arrivals",
  "/user/categoryWiseProducs",
  "/user/getsimilarproducts",
  "/user/searchcategoriestofilter",
  "/user/getcategoryname",
  "/user/check",
  "/user/login",
  "/user/signup",
  "/user/send-otp",
  "/user/verify-otp",
  "/user/update-password",
  "/user/signupotp",
  "/user/verifysignupotp"
];

// Process the failed queue - either resolve or reject based on refresh success
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
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
    
    // Check if the failed request is for a public endpoint
    const isPublicRequest = publicEndpoints.some(endpoint => 
      originalRequest.url.includes(endpoint)
    );
    
    // If the error is 401 and it's not a refresh token request itself and we're not already refreshing
    // and it's not a public endpoint
    if (err.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('/refreshToken') &&
        !isRefreshing &&
        !isPublicRequest) {
      
      originalRequest._retry = true;
      isRefreshing = true;

      // Create a new promise that will be resolved/rejected after token refresh
      return new Promise((resolve, reject) => {
        try {
          apiClient.get("/user/refreshToken")
            .then(() => {
              isRefreshing = false;
              processQueue(null);
              resolve(apiClient(originalRequest)); // Retry the original request
            })
            .catch((refreshError) => {
              isRefreshing = false;
              processQueue(refreshError);
              console.log("Refresh token expired or invalid");
              
              // Instead of redirecting, just update localStorage to reflect logged out state
              // The App component will handle redirection based on auth state
              localStorage.removeItem("userId");
              localStorage.removeItem("role");
              
              // Dispatch logout action if we have access to store
              if (window.reduxStore) {
                window.reduxStore.dispatch({ type: 'auth/logout' });
              }
              
              reject(refreshError);
            });
        } catch (error) {
          isRefreshing = false;
          processQueue(error);
          console.log("Error in refresh token process");
          
          // Instead of redirecting, just update localStorage to reflect logged out state
          // The App component will handle redirection based on auth state
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          
          // Dispatch logout action if we have access to store
          if (window.reduxStore) {
            window.reduxStore.dispatch({ type: 'auth/logout' });
          }
          
          reject(error);
        }
      });
    }
    
    // For public endpoints or other errors, just reject without redirecting
    // This allows failed product page requests to be handled normally without login redirects
    return Promise.reject(err);
  }
);

export default apiClient;
