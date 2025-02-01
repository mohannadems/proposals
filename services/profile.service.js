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

      Object.keys(profileData).forEach((key) => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          if (key === "date_of_birth") {
            formData.append(key, profileData[key].toISOString().split("T")[0]);
          } else if (typeof profileData[key] === "boolean") {
            formData.append(key, profileData[key] ? "1" : "0");
          } else {
            formData.append(key, String(profileData[key]));
          }
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
