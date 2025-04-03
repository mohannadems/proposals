import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Service to handle matches-related API calls
export const matchesService = {
  // Get user preferences (for spotlight section)
  getUserMatches: async () => {
    try {
      const response = await api.get(ENDPOINTS.GET_USER_PREFERENCES);
      return response.data;
    } catch (error) {
      console.error("Error fetching user matches:", error);
      throw {
        message: error.response?.data?.message || "Error fetching user matches",
      };
    }
  },

  // Get filtered users (for quick matches section)
  getFilteredMatches: async (filterParams = {}) => {
    try {
      const response = await api.get(ENDPOINTS.FILTER_USERS, {
        params: filterParams,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching filtered matches:", error);
      throw {
        message:
          error.response?.data?.message || "Error fetching filtered matches",
      };
    }
  },

  // Store filter preferences locally
  saveFilterPreferences: async (filters) => {
    try {
      await AsyncStorage.setItem("match_filters", JSON.stringify(filters));
    } catch (error) {
      console.error("Error saving filter preferences:", error);
    }
  },

  // Get stored filter preferences
  getFilterPreferences: async () => {
    try {
      const filters = await AsyncStorage.getItem("match_filters");
      return filters ? JSON.parse(filters) : null;
    } catch (error) {
      console.error("Error getting filter preferences:", error);
      return null;
    }
  },

  checkForMatch: async (userId) => {
    if (userId === undefined || userId === null) {
      console.error("No user ID provided to checkForMatch");
      return { isMatch: false, error: "No user ID provided" };
    }

    try {
      const response = await api.get(ENDPOINTS.MATCHES);

      if (
        !response.data ||
        !response.data.matches ||
        !Array.isArray(response.data.matches)
      ) {
        console.error("Invalid matches response structure:", response.data);
        return { isMatch: false, error: "Invalid response structure" };
      }

      const userIdString = String(userId);

      const matchData = response.data.matches.find(
        (match) => String(match.matched_user_id) === userIdString
      );

      if (matchData) {
        return {
          isMatch: true,
          matchData,
        };
      }

      return { isMatch: false };
    } catch (error) {
      console.error("Error fetching mutual matches:", error);

      if (error.response) {
        console.error("Response error:", error.response.data);
      }

      if (__DEV__) {
        return {
          isMatch: true,
          matchData: {
            matched_user_id: userId,
            matched_user_name: "Test Match",
            matched_user_photo: null,
          },
        };
      }

      throw {
        message:
          error.response?.data?.message || "Error fetching mutual matches",
      };
    }
  },

  // Store liked user IDs locally for persistence
  saveLikedUserIds: async (userIds) => {
    try {
      await AsyncStorage.setItem("liked_user_ids", JSON.stringify(userIds));
    } catch (error) {
      console.error("Error saving liked user IDs:", error);
    }
  },

  // Get stored liked user IDs
  getLikedUserIds: async () => {
    try {
      const userIds = await AsyncStorage.getItem("liked_user_ids");
      return userIds ? JSON.parse(userIds) : [];
    } catch (error) {
      console.error("Error getting liked user IDs:", error);
      return [];
    }
  },

  // Add a user ID to the liked list
  addLikedUserId: async (userId) => {
    try {
      const existingIds = await matchesService.getLikedUserIds();
      if (!existingIds.includes(userId)) {
        const updatedIds = [...existingIds, userId];
        await matchesService.saveLikedUserIds(updatedIds);
      }
    } catch (error) {
      console.error("Error adding liked user ID:", error);
    }
  },
};
