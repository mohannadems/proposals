import axios from "axios";
import { BASE_URL } from "../constants/endpoints"; // Adjust the import path as needed

export const authService = {
  verifyOTP: async (verificationData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/verify-otp`,
        verificationData
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "OTP verification failed"
        );
      } else if (error.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error("Error processing OTP verification");
      }
    }
  },

  resendOTP: async (email) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/resend-verification-link`,
        {
          email,
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Failed to resend OTP");
      } else if (error.request) {
        throw new Error("No response received from server");
      } else {
        throw new Error("Error resending OTP");
      }
    }
  },
};
