import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

const reportService = {
  reportUser: async (reportData) => {
    try {
      const response = await api.post(ENDPOINTS.REPORT_USER, reportData);
      return response.data;
    } catch (error) {
      console.error("[ReportService] Error reporting user:", error);
      throw error;
    }
  },
};

export default reportService;
