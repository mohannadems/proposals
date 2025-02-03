import api from "./api";

export const profileService = {
  getProfile: async () => {
    try {
      const [basicProfile, detailedProfile] = await Promise.all([
        api.get("/me"),
        api.get("/profile"),
      ]);

      return {
        success: true,
        data: {
          ...basicProfile.data.data,
          profile: detailedProfile.data.data.profile,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.post("/profile", profileData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      throw error;
    }
  },
};
