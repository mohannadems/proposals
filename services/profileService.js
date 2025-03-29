// api/profileService.js
import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const profileService = {
  fetchPersonalAttributes: async () => {
    try {
      const response = await api.get(ENDPOINTS.PERSONAL_ATTRIBUTES);
      return response.data;
    } catch (error) {
      console.error("Error fetching personal attributes:", error);
      throw error;
    }
  },

  fetchLifestyleInterests: async () => {
    try {
      const response = await api.get(ENDPOINTS.LIFESTYLE_INTERESTS);
      return response.data;
    } catch (error) {
      console.error("Error fetching lifestyle interests:", error);
      throw error;
    }
  },

  fetchProfessionalEducational: async () => {
    try {
      const response = await api.get(ENDPOINTS.PROFESSIONAL_EDUCATIONAL);
      return response.data;
    } catch (error) {
      console.error("Error fetching professional educational data:", error);
      throw error;
    }
  },

  fetchGeographic: async () => {
    try {
      const response = await api.get(ENDPOINTS.GEOGRAPHIC);
      return response.data;
    } catch (error) {
      console.error("Error fetching geographic data:", error);
      throw error;
    }
  },

  fetchCitiesByCountry: async (countryId) => {
    try {
      if (!countryId) {
        return [];
      }

      const response = await api.get(`/countries/${countryId}/cities`);
      return response.data.data || [];
    } catch (error) {
      console.error(
        `Error fetching cities for country ID ${countryId}:`,
        error
      );
      return [];
    }
  },

  fetchAllProfileData: async () => {
    try {
      const [
        personalAttributes,
        lifestyleInterests,
        professionalEducational,
        geographic,
      ] = await Promise.all([
        profileService.fetchPersonalAttributes(),
        profileService.fetchLifestyleInterests(),
        profileService.fetchProfessionalEducational(),
        profileService.fetchGeographic(),
      ]);

      return {
        personalAttributes,
        lifestyleInterests,
        professionalEducational,
        geographic,
      };
    } catch (error) {
      console.error("Error fetching all profile data:", error);
      throw error;
    }
  },
};

export default profileService;
