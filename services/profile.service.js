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
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, value);
        }
      });

      const response = await api.post("/profile", formData, {
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
