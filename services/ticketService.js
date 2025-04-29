import api from "./api";
import { ENDPOINTS } from "../constants/endpoints";

export const ticketService = {
  // Get all tickets
  getAllTickets: async (ticketId = null) => {
    try {
      const payload = ticketId ? { ticket_id: ticketId } : {};
      const response = await api.get(ENDPOINTS.TICKETS, {
        params: payload, // Use params for GET requests, not data
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }
  },

  // Get ticket by ID
  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`${ENDPOINTS.TICKETS}/${ticketId}`, {
        params: { ticket_id: ticketId }, // Use params for GET requests
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ticket ${ticketId}:`, error);
      throw error;
    }
  },

  // Create a new ticket
  createTicket: async (ticketData) => {
    try {
      const response = await api.post(ENDPOINTS.TICKETS, ticketData);
      return response.data;
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  },

  // Reply to a ticket
  replyToTicket: async (ticketId, message) => {
    try {
      const response = await api.post(
        `${ENDPOINTS.TICKETS}/${ticketId}/reply`,
        { message }
      );
      return response.data;
    } catch (error) {
      console.error(`Error replying to ticket ${ticketId}:`, error);
      throw error;
    }
  },
};

export default ticketService;
