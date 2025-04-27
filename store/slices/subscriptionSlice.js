import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionService } from "../../services/subscriptionService";

export const fetchSubscriptionCards = createAsyncThunk(
  "subscription/fetchCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.getSubscriptionCards();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptionCards: [],
    loading: false,
    error: null,
    selectedPlan: null,
  },
  reducers: {
    selectPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionCards.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptionCards = action.payload;
      })
      .addCase(fetchSubscriptionCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { selectPlan, clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
