import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const userProfileService = {
  getUserProfile: async (userId) => {
    try {
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
