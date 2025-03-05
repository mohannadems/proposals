// services/searchService.js
import axios from "axios";
import { BASE_URL, ENDPOINTS } from "../constants/endpoints";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from storage or global state
    const accessToken = "26|8E7ALaj1f9lVOchUIcSwCjVPgkhIA9fWryivaMGZd7e3d9a5"; // Replace with your token management

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const searchService = {
  // Send user preferences to get matching profiles
  submitPreferences: async (preferences) => {
    try {
      const response = await api.post(
        `${ENDPOINTS.USER_PREFERENCES}`,
        preferences
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting preferences:", error);
      // Create a standardized error object
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error submitting preferences";
      throw { message: errorMessage };
    }
  },

  // Get saved user preferences if any
  getSavedPreferences: async () => {
    try {
      // Using POST instead of GET as the API requires
      const response = await api.post(`${ENDPOINTS.USER_PREFERENCES}`, {
        // Send an empty object or minimal required parameters
        language: 1,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting saved preferences:", error);
      // Create a standardized error object
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error getting saved preferences";
      throw { message: errorMessage };
    }
  },
};
