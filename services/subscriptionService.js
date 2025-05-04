// services/subscriptionService.js
import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const subscriptionService = {
  getSubscriptionCards: async () => {
    try {
      const response = await api.get(ENDPOINTS.SUBSCRIPTION_CARDS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  revealContact: async (matchedUserId) => {
    try {
      const lang = (await AsyncStorage.getItem("userLanguage")) || "en";
      const response = await api.post(
        ENDPOINTS.REVEAL_CONTACT,
        { matchedUserId },
        {
          headers: {
            "Accept-Language": lang,
          },
        }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};
