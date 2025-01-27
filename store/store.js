import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import profileReducer from "./slices/profile.slice"; // Import the profile slice

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer, // Add the profile slice here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
