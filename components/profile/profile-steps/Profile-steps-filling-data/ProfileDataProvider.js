import React, { createContext, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDynamicProfileData } from "../../../../services/dynamicProfileData";
import { fetchCitiesByCountry } from "../../../../store/slices/profileAttributesSlice";
import { View, ActivityIndicator, Text } from "react-native";
import { COLORS } from "../../../../constants/colors";

const ProfileDataContext = createContext();

export const useProfileData = () => {
  const context = useContext(ProfileDataContext);
  if (!context) {
    throw new Error("useProfileData must be used within a ProfileDataProvider");
  }
  return context;
};

export const ProfileDataProvider = ({ children, loadingFallback = true }) => {
  const dispatch = useDispatch();
  const { profileData, getCitiesByCountry, isLoading, hasErrors } =
    useDynamicProfileData();

  const fetchCities = (countryId) => {
    if (countryId) {
      dispatch(fetchCitiesByCountry(countryId));
    }
  };

  if (isLoading && loadingFallback) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile data...</Text>
      </View>
    );
  }

  return (
    <ProfileDataContext.Provider
      value={{
        PROFILE_DATA: profileData,
        fetchCities,
        getCitiesByCountry,
        isLoading,
        hasErrors,
      }}
    >
      {children}
    </ProfileDataContext.Provider>
  );
};

const styles = {
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
    marginTop: 10,
  },
};

export default ProfileDataProvider;
