import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000", // Your API base URL
  withCredentials: true, // Ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
