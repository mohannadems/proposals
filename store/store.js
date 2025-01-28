import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import profileReducer from "./slices/profile.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
