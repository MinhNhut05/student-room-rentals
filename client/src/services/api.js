import axios from "axios";

// Create axios instance with base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
// Dòng comment để ép deploy lại, ngày 19/06/2025
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.url}`,
      config.data instanceof FormData ? "FormData" : config.data
    );

    // Do NOT set Content-Type for FormData - axios will set it with boundary
    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Improve error logging
    if (error.response) {
      console.error(`API Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
