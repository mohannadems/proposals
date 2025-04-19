import React, { useState, useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/colors";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { fetchProfileCompletionData } from "../../store/slices/profileCompletionSlice";
import HomeScreen from "../../components/home/HomeScreen";
import { LanguageContext } from "../../contexts/LanguageContext";
export const isApiProfileComplete = (userData) => {
  const profile = userData.data?.profile || userData.profile;

  if (!profile) {
    console.log("No profile found in userData");
    return false;
  }

  const criticalFields = [
    "nationality",
    "language",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "educational_level",
    "marital_status",
    "employment_status",
    "job_title",
    "financial_status",
  ];

  const filledCount = criticalFields.filter(
    (field) =>
      profile[field] !== null &&
      profile[field] !== undefined &&
      profile[field] !== ""
  ).length;

  const hasPhotos =
    profile.photos &&
    Array.isArray(profile.photos) &&
    profile.photos.length > 0;

  const isComplete = filledCount >= criticalFields.length * 0.8 && hasPhotos;

  console.log("Profile Completion Check:", {
    filledCount,
    requiredFieldsCount: criticalFields.length,
    hasPhotos,
    isComplete,
    missingFields: criticalFields.filter(
      (field) =>
        profile[field] === null ||
        profile[field] === undefined ||
        profile[field] === ""
    ),
  });

  return isComplete;
};

export const isProfileEmpty = (userData) => {
  const profile = userData.data?.profile || userData.profile;

  if (!profile) return true;

  const requiredFields = [
    "nationality",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "age",
    "educational_level",
    "marital_status",
    "height",
    "weight",
  ];

  const emptyCount = requiredFields.filter(
    (field) =>
      profile[field] === null ||
      profile[field] === undefined ||
      profile[field] === ""
  ).length;

  return emptyCount > requiredFields.length * 0.7;
};

export const checkProfileCompletion = (userData) => {
  const profile = userData.data?.profile || userData.profile;

  if (!profile) {
    console.log("Profile data is missing or incomplete");
    return {
      isProfileComplete: false,
      missingFields: ["profile data missing"],
    };
  }

  const requiredFields = [
    "nationality",
    "language",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "age",
    "educational_level",
    "employment_status",
    "marital_status",
    "height",
    "weight",
  ];

  const requiredArrayFields = ["photos"];

  const missingFields = [];

  requiredFields.forEach((field) => {
    if (
      profile[field] === null ||
      profile[field] === undefined ||
      profile[field] === ""
    ) {
      missingFields.push(field);
    } else if (field === "employment_status" && profile[field] === 0) {
      missingFields.push(field);
    }
  });

  requiredArrayFields.forEach((field) => {
    if (
      !profile[field] ||
      !Array.isArray(profile[field]) ||
      profile[field].length === 0
    ) {
      missingFields.push(field);
    }
  });

  const isProfileComplete = missingFields.length === 0;

  console.log("Profile Completion Details:", {
    isProfileComplete,
    missingFields,
  });

  return {
    isProfileComplete,
    missingFields,
  };
};

const wrappedScreen = (WrappedComponent, ProfileCompletionScreen = null) => {
  return (props) => {
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.profile);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      dispatch(fetchProfileCompletionData());
    }, [dispatch]);

    const isProfileComplete = () => {
      if (!data) {
        console.log("No profile data available");
        return false;
      }

      const apiComplete = isApiProfileComplete(data);
      const serverProfileIsEmpty = isProfileEmpty(data);
      const { isProfileComplete: completeCheck } = checkProfileCompletion(data);

      const profileComplete =
        apiComplete ||
        completeCheck ||
        (!serverProfileIsEmpty && completeCheck);

      console.log("Final Profile Completion Check:", {
        apiComplete,
        serverProfileIsEmpty,
        completeCheck,
        profileComplete,
      });

      return profileComplete;
    };

    useEffect(() => {
      setIsLoading(false);
    }, [data]);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      );
    }

    if (!isProfileComplete()) {
      if (ProfileCompletionScreen) {
        return <ProfileCompletionScreen {...props} />;
      }

      return <HomeScreen />;
    }

    return <WrappedComponent {...props} />;
  };
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  incompleteProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  incompleteProfileText: {
    fontSize: 18,
    textAlign: "center",
    color: COLORS.primary,
  },
});

export default wrappedScreen;
