// src/redux/profileCompletionSlice.js
import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";

const profilePersistConfig = {
  key: "profileCompletion",
  storage: AsyncStorage,
  whitelist: ["completedSteps", "missingFields"],
};

const profileCompletionSlice = createSlice({
  name: "profileCompletion",
  initialState: {
    completedSteps: [],
    lastCompletedStep: null,
    missingFields: [],
  },
  reducers: {
    updateCompletedStep: (state, action) => {
      const step = action.payload;
      if (!state.completedSteps.includes(step)) {
        state.completedSteps.push(step);
        state.lastCompletedStep = step;
      }
    },
    setMissingFields: (state, action) => {
      state.missingFields = action.payload;
    },
    resetProfileCompletion: () => ({
      completedSteps: [],
      lastCompletedStep: null,
      missingFields: [],
    }),
  },
});

export const { updateCompletedStep, setMissingFields, resetProfileCompletion } =
  profileCompletionSlice.actions;

export default persistReducer(
  profilePersistConfig,
  profileCompletionSlice.reducer
);
