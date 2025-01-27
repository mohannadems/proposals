import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const authService = {
  login: async (credentials) => {
    const response = await api.post(ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post(ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  verifyOTP: async (otpData) => {
    const response = await api.post(ENDPOINTS.VERIFY_OTP, otpData);
    return response.data;
  },
};
