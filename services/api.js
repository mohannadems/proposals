import axios from "axios";
import { BASE_URL } from "../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

api.interceptors.request.use(
  async (config) => {
    try {
      const language = (await AsyncStorage.getItem("userLanguage")) || "en";
      config.headers["Accept-Language"] = language;
    } catch (error) {
      console.error("Error setting language header:", error);
    }
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
      //////////ask mohammad what login to put here
    }
    return Promise.reject(error);
  }
);

export default api;
