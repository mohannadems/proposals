import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionService } from "../../services/subscriptionService";
import { showMessage } from "react-native-flash-message";

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

// Add the reveal contact thunk
export const revealContact = createAsyncThunk(
  "subscription/revealContact",
  async (matchedUserId, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.revealContact(matchedUserId);
      return { matchedUserId, data: response.data };
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
    revealedContacts: {},
    revealingContact: false,
    revealError: null,
  },
  reducers: {
    selectPlan: (state, action) => {
      state.selectedPlan = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRevealError: (state) => {
      state.revealError = null;
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
      })
      .addCase(revealContact.pending, (state) => {
        state.revealingContact = true;
        state.revealError = null;
      })
      .addCase(revealContact.fulfilled, (state, action) => {
        state.revealingContact = false;
        const { matchedUserId, data } = action.payload;
        state.revealedContacts[matchedUserId] = data;
      })
      .addCase(revealContact.rejected, (state, action) => {
        state.revealingContact = false;
        state.revealError = action.payload;
        showMessage({
          message: "Error",
          description: action.payload || "Failed to reveal contact info",
          type: "danger",
        });
      });
  },
});

export const { selectPlan, clearError, clearRevealError } =
  subscriptionSlice.actions;

export const selectRevealedContact = (state, userId) =>
  state.subscription.revealedContacts[userId];
export const selectIsRevealingContact = (state) =>
  state.subscription.revealingContact;
export const selectRevealError = (state) => state.subscription.revealError;

export default subscriptionSlice.reducer;
