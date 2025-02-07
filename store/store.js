import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "./slices/auth.slice";
import profileReducer from "./slices/profile.slice";
import profileCompletionReducer from "./slices/profileCompletionSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["profile", "profileCompletion"], // Specify reducers to persist
};

const persistedProfileReducer = persistReducer(persistConfig, profileReducer);
const persistedProfileCompletionReducer = persistReducer(
  persistConfig,
  profileCompletionReducer
);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: persistedProfileReducer,
    profileCompletion: persistedProfileCompletionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export const persistor = persistStore(store);
