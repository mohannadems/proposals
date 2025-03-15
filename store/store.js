import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "./slices/auth.slice";
import profileReducer from "./slices/profile.slice";
import profileCompletionReducer from "./slices/profileCompletionSlice";
import profileAttributesReducer from "./slices/profileAttributesSlice";
import searchReducer from "./slices/searchSlice";
import userMatchesReducer from "./slices/userMatchesSlice";
import persistedUserProfileReducer from "./slices/userProfileSlice";
// First create the persist configs
const profilePersistConfig = {
  key: "profile",
  storage: AsyncStorage,
};

const profileCompletionPersistConfig = {
  key: "profileCompletion",
  storage: AsyncStorage,
};

// Add persistence for search reducer
const searchPersistConfig = {
  key: "search",
  storage: AsyncStorage,
};

// Add persistence for user matches
const userMatchesPersistConfig = {
  key: "userMatches",
  storage: AsyncStorage,
  // Only persist certain parts of the userMatches state
  whitelist: ["spotlightUsers", "quickMatchUsers", "activeFilters"],
};

// Create persisted reducers for those you want to persist
const persistedProfileReducer = persistReducer(
  profilePersistConfig,
  profileReducer
);

const persistedProfileCompletionReducer = persistReducer(
  profileCompletionPersistConfig,
  profileCompletionReducer
);

// Add the persisted search reducer
const persistedSearchReducer = persistReducer(
  searchPersistConfig,
  searchReducer
);

// Add the persisted user matches reducer
const persistedUserMatchesReducer = persistReducer(
  userMatchesPersistConfig,
  userMatchesReducer
);

// Define all reducers
const appReducer = combineReducers({
  auth: authReducer,
  profile: persistedProfileReducer,
  profileCompletion: persistedProfileCompletionReducer,
  profileAttributes: profileAttributesReducer,
  search: persistedSearchReducer, // Use the persisted version
  userMatches: persistedUserMatchesReducer, // Use the persisted version
  userProfile: persistedUserProfileReducer,
});

// Create the root reducer that handles logout
const rootReducer = (state, action) => {
  // When logout action is dispatched, reset all state
  if (action.type === "auth/logout/fulfilled") {
    // Option 1: Reset everything (clear all state)
    state = undefined;

    // Option 2 (Uncomment to use): Keep search preferences even after logout
    // const { search } = state;
    // state = undefined;
    // return appReducer({ search }, action);
  }

  return appReducer(state, action);
};

// Use the root reducer in the store configuration
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
