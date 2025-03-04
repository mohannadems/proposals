// api/profileService.js
import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

// Profile data services
export const profileService = {
  // Fetch personal attributes (hair color, height, weight, etc.)
  fetchPersonalAttributes: async () => {
    try {
      const response = await api.get(ENDPOINTS.PERSONAL_ATTRIBUTES);
      return response.data;
    } catch (error) {
      console.error("Error fetching personal attributes:", error);
      throw error;
    }
  },

  // Fetch lifestyle and interests data (hobbies, pets, sports, etc.)
  fetchLifestyleInterests: async () => {
    try {
      const response = await api.get(ENDPOINTS.LIFESTYLE_INTERESTS);
      return response.data;
    } catch (error) {
      console.error("Error fetching lifestyle interests:", error);
      throw error;
    }
  },

  // Fetch professional and educational data
  fetchProfessionalEducational: async () => {
    try {
      const response = await api.get(ENDPOINTS.PROFESSIONAL_EDUCATIONAL);
      return response.data;
    } catch (error) {
      console.error("Error fetching professional educational data:", error);
      throw error;
    }
  },

  // Fetch geographic data (countries, cities, etc.)
  fetchGeographic: async () => {
    try {
      const response = await api.get(ENDPOINTS.GEOGRAPHIC);
      return response.data;
    } catch (error) {
      console.error("Error fetching geographic data:", error);
      throw error;
    }
  },

  // Fetch cities by country ID - UPDATED with correct endpoint
  fetchCitiesByCountry: async (countryId) => {
    try {
      if (!countryId) {
        return [];
      }

      // Use the correct endpoint format: api/countries/{countryId}/cities
      const response = await api.get(`/countries/${countryId}/cities`);
      return response.data.data || [];
    } catch (error) {
      console.error(
        `Error fetching cities for country ID ${countryId}:`,
        error
      );
      // Return empty array if there's an error
      return [];
    }
  },

  // Fetch all profile attribute data in parallel
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
