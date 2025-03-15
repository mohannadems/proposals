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
};
