import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketService from "../../services/ticketService";

const initialState = {
  tickets: [],
  currentTicket: null,
  replies: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Get all tickets
export const getAllTickets = createAsyncThunk(
  "tickets/getAll",
  async (ticketId = null, thunkAPI) => {
    try {
      return await ticketService.getAllTickets(ticketId);
    } catch (error) {
      let message = "";
      if (error.response) {
        message = error.response.data?.message || "An error occurred";
      } else if (error.request) {
        message = "No response from server. Please check your connection.";
      } else {
        message = error.message || "An unknown error occurred";
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getTicketById = createAsyncThunk(
  "tickets/getById",
  async (ticketId, thunkAPI) => {
    try {
      return await ticketService.getTicketById(ticketId);
    } catch (error) {
      let message = "";
      if (error.response) {
        message = error.response.data?.message || "An error occurred";
      } else if (error.request) {
        message = "No response from server. Please check your connection.";
      } else {
        message = error.message || "An unknown error occurred";
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createTicket = createAsyncThunk(
  "tickets/create",
  async (ticketData, thunkAPI) => {
    try {
      return await ticketService.createTicket(ticketData);
    } catch (error) {
      let message = "";
      if (error.response) {
        message = error.response.data?.message || "An error occurred";
      } else if (error.request) {
        message = "No response from server. Please check your connection.";
      } else {
        message = error.message || "An unknown error occurred";
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const replyToTicket = createAsyncThunk(
  "tickets/reply",
  async ({ ticketId, message }, thunkAPI) => {
    try {
      return await ticketService.replyToTicket(ticketId, message);
    } catch (error) {
      let message = "";
      if (error.response) {
        message = error.response.data?.message || "An error occurred";
      } else if (error.request) {
        message = "No response from server. Please check your connection.";
      } else {
        message = error.message || "An unknown error occurred";
      }
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.replies = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTickets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload || [];
      })
      .addCase(getAllTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTicketById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentTicket = action.payload;
        if (action.payload && action.payload.replies) {
          state.replies = action.payload.replies;
        } else {
          state.replies = [];
        }
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (action.payload?.data) {
          state.tickets.push(action.payload.data);
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(replyToTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(replyToTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        if (action.payload?.data) {
          state.replies.push(action.payload.data);
        }
      })
      .addCase(replyToTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
