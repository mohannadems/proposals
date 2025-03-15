import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const userProfileService = {
  // Get user profile using query parameters
  getUserProfile: async (userId) => {
    try {
      // Use a query parameter approach
      const response = await api.get(
        `${ENDPOINTS.USER_PROFILE}?user_id=${userId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw {
        message: error.response?.data?.message || "Error fetching user profile",
      };
    }
  },

  // Like a user
  likeUser: async (likedUserId) => {
    try {
      const response = await api.post(ENDPOINTS.LIKE_USER, {
        liked_user_id: likedUserId,
      });
      return response.data;
    } catch (error) {
      console.error("Error liking user:", error);
      throw {
        message: error.response?.data?.message || "Error liking user",
      };
    }
  },

  // Dislike a user
  dislikeUser: async (dislikedUserId) => {
    try {
      const response = await api.post(ENDPOINTS.DISLIKE_USER, {
        disliked_user_id: dislikedUserId,
      });
      return response.data;
    } catch (error) {
      console.error("Error disliking user:", error);
      throw {
        message: error.response?.data?.message || "Error disliking user",
      };
    }
  },
};
