import axios from "axios";
import { BASE_URL } from "../constants/endpoints";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    // Add the "Bearer" prefix and ensure proper spacing
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // For debugging
    console.log("Setting auth token:", ` Bearer ${token})`);
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
api.interceptors.request.use(
  (config) => {
    // Log the headers for debugging
    console.log("Request headers:", config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized request:", error.config.url);
    }
    return Promise.reject(error);
  }
);
export default api;
