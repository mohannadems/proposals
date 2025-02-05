import api from "./api";

export const profileService = {
  getProfile: async () => {
    try {
      const timestamp = new Date().getTime();
      const [basicProfile, detailedProfile] = await Promise.all([
        api.get(`/me?_t=${timestamp}`),
        api.get(`/profile?_t=${timestamp}`),
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
  updateProfilePhoto: async (formData) => {
    try {
      const response = await api.post("/user/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
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
