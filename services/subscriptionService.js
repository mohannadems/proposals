// services/subscriptionService.js
import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const subscriptionService = {
  getSubscriptionCards: async () => {
    try {
      const response = await api.get(ENDPOINTS.SUBSCRIPTION_CARDS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
