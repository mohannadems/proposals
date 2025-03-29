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

  // Check if there's a mutual match with a user after liking them
  // Improved checkForMatch method
  // Updated checkForMatch method to handle actual API response format
  checkForMatch: async (userId) => {
    // Validate input
    if (userId === undefined || userId === null) {
      console.error("No user ID provided to checkForMatch");
      return { isMatch: false, error: "No user ID provided" };
    }

    try {
      // Use the standard MATCHES endpoint
      const response = await api.get(ENDPOINTS.MATCHES);

      // Log the response for debugging
      console.log("Matches response:", response.data);

      // Ensure we have data and it's in the expected format
      // The actual response has a 'matches' array instead of 'data.data'
      if (
        !response.data ||
        !response.data.matches ||
        !Array.isArray(response.data.matches)
      ) {
        console.error("Invalid matches response structure:", response.data);
        return { isMatch: false, error: "Invalid response structure" };
      }

      // Convert userId to a string for consistent comparison
      const userIdString = String(userId);

      // Find the match in the 'matches' array (not 'data.data')
      const matchData = response.data.matches.find(
        (match) => String(match.matched_user_id) === userIdString
      );

      // Return match result
      if (matchData) {
        console.log("Match found:", matchData);
        return {
          isMatch: true,
          matchData,
        };
      }

      // No match found
      console.log("No match found for userId:", userId);
      return { isMatch: false };
    } catch (error) {
      console.error("Error fetching mutual matches:", error);

      // Provide more detailed error logging
      if (error.response) {
        console.error("Response error:", error.response.data);
      }

      // For development/testing purposes, return a test match
      if (__DEV__) {
        console.log("DEV MODE: Returning test match result");
        return {
          isMatch: true,
          matchData: {
            matched_user_id: userId,
            matched_user_name: "Test Match",
            matched_user_photo: null,
          },
        };
      }

      // Throw a more informative error
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
