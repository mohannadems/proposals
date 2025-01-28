import axios from "axios";
import { BASE_URL } from "../constants/endpoints"; // Adjust the import path as needed

/**
 * Service for authentication-related API calls
 */
export const authService = {
  /**
   * Verify OTP for email authentication
   * @param {Object} verificationData - OTP verification details
   * @param {string} verificationData.email - User's email address
   * @param {string} verificationData.otp - One-time password
   * @returns {Promise<Object>} Verification response data
   */
  verifyOTP: async (verificationData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/verify-otp`,
        verificationData
      );
      return response.data;
    } catch (error) {
      // Standardize error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(
          error.response.data.message || "OTP verification failed"
        );
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response received from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error("Error processing OTP verification");
      }
    }
  },

  /**
   * Resend OTP to user's email
   * @param {string} email - User's email address
   * @returns {Promise<Object>} Resend OTP response data
   */
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
