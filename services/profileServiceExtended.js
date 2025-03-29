import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const profileServiceExtended = {
  fetchSocialMediaPresences: async () => {
    try {
      const response = await api.get("/social-media-presences");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching social media presences:", error);
      // Return fallback data if API endpoint isn't available
      return [
        { id: 1, name: "Highly Active 📱" },
        { id: 2, name: "Moderately Active 🖥️" },
        { id: 3, name: "Rarely Active 📴" },
        { id: 4, name: "Inactive 🚫" },
      ];
    }
  },

  fetchJobTitles: async () => {
    try {
      const response = await api.get("/job-titles");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching job titles:", error);
      return [
        { id: 1, name: "Software Developer 💻" },
        { id: 2, name: "Data Scientist 📊" },
        { id: 3, name: "Cloud Engineer ☁️" },
        { id: 4, name: "AI/ML Specialist 🤖" },
        { id: 5, name: "Teacher 👨‍🏫" },
        { id: 6, name: "Doctor 👩‍⚕️" },
        { id: 7, name: "Engineer 👷‍♂️" },
        { id: 8, name: "Business Analyst 📈" },
        { id: 9, name: "Marketing Specialist 📣" },
        { id: 10, name: "Accountant 💼" },
      ];
    }
  },
};

export default profileServiceExtended;
