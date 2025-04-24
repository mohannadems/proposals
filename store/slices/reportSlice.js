import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "../../services/reportService";

const initialState = {
  loading: false,
  error: null,
  success: false,
  reportReasons: [
    {
      id: 1,
      value: "harassment",
      label_en: "Harassment",
      label_ar: "تحرش",
    },
    {
      id: 2,
      value: "fake_profile",
      label_en: "Fake Profile",
      label_ar: "حساب مزيف",
    },
    {
      id: 3,
      value: "inappropriate_content",
      label_en: "Inappropriate Content",
      label_ar: "محتوى غير لائق",
    },

    {
      id: 5,
      value: "other",
      label_en: "Other",
      label_ar: "أخرى",
    },
  ],
};

// Define the async thunk for reporting a user
export const reportUser = createAsyncThunk(
  "report/reportUser",
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await reportService.reportUser(reportData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to report user"
      );
    }
  }
);

// Create the slice
const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    resetReportState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reportUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(reportUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(reportUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// Export actions and reducer
export const { resetReportState } = reportSlice.actions;
export default reportSlice.reducer;

// Selectors
export const selectReportLoading = (state) => state.report.loading;
export const selectReportError = (state) => state.report.error;
export const selectReportSuccess = (state) => state.report.success;
export const selectReportReasons = (state) => state.report.reportReasons;
