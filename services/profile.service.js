import api from "./api";

export const profileService = {
  getProfile: async () => {
    try {
      const response = await api.get("/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
