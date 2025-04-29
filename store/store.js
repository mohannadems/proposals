import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import ticketReducer from "./slices/ticketSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import subscriptionReducer from "./slices/subscriptionSlice";
import authReducer from "./slices/auth.slice";
import profileReducer from "./slices/profile.slice";
import profileCompletionReducer from "./slices/profileCompletionSlice";
import profileAttributesReducer from "./slices/profileAttributesSlice";
import searchReducer from "./slices/searchSlice";
import userMatchesReducer from "./slices/userMatchesSlice";
import userProfileReducer from "./slices/userProfileSlice";
import reportReducer from "./slices/reportSlice";
const STORAGE_KEYS = {
  PROFILE: "profile",
  PROFILE_COMPLETION: "profileCompletion",
  SEARCH: "search",
  USER_MATCHES: "userMatches",
  USER_PROFILE: "userProfile",
};

const createPersistConfig = (key, whitelist = null) => ({
  key,
  storage: AsyncStorage,
  ...(whitelist ? { whitelist } : {}),
});

const persistConfigs = {
  profile: createPersistConfig(STORAGE_KEYS.PROFILE),
  profileCompletion: createPersistConfig(STORAGE_KEYS.PROFILE_COMPLETION),
  search: createPersistConfig(STORAGE_KEYS.SEARCH),
  userMatches: createPersistConfig(STORAGE_KEYS.USER_MATCHES, [
    "spotlightUsers",
    "quickMatchUsers",
    "activeFilters",
    "likedUsers",
  ]),
  userProfile: createPersistConfig(STORAGE_KEYS.USER_PROFILE, [
    "likedUsers",
    "dislikedUsers",
  ]),
};

const persistedReducers = {
  profile: persistReducer(persistConfigs.profile, profileReducer),
  profileCompletion: persistReducer(
    persistConfigs.profileCompletion,
    profileCompletionReducer
  ),
  search: persistReducer(persistConfigs.search, searchReducer),
  userMatches: persistReducer(persistConfigs.userMatches, userMatchesReducer),
  userProfile: persistReducer(persistConfigs.userProfile, userProfileReducer),
};

const appReducer = combineReducers({
  auth: authReducer,
  profile: persistedReducers.profile,
  profileCompletion: persistedReducers.profileCompletion,
  profileAttributes: profileAttributesReducer,
  search: persistedReducers.search,
  userMatches: persistedReducers.userMatches,
  userProfile: persistedReducers.userProfile,
  report: reportReducer,
  subscription: subscriptionReducer,
  ticket: ticketReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout/fulfilled") {
    // Option 1: Reset everything (clear all state)
    state = undefined;

    // Option 2: Uncomment to keep search preferences after logout
    /*
    const { search } = state;
    state = undefined;
    return appReducer({ search }, action);
    */
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
