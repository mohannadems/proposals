import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { matchesService } from "../../services/matchesService";

export const fetchLikes = createAsyncThunk(
  "likes/fetchLikes",
  async (_, { rejectWithValue }) => {
    try {
      const likes = await matchesService.getLikes();
      return likes;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const likesSlice = createSlice({
  name: "likes",
  initialState: {
    likes: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLikesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLikes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikes.fulfilled, (state, action) => {
        state.loading = false;
        state.likes = action.payload;
      })
      .addCase(fetchLikes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearLikesError } = likesSlice.actions;
export default likesSlice.reducer;
