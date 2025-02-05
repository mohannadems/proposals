import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Animated,
  RefreshControl,
  Platform,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { fetchProfile } from "../../store/slices/profile.slice";
import { logout } from "../../store/slices/auth.slice";
import styles from "../../styles/ProfileScreenStyles";
import { useRouter } from "expo-router";
import PhotoUploader from "../../components/profile/PhotoUploader";
import * as ImageManipulator from "expo-image-manipulator";
import { updateProfilePhoto } from "../../store/slices/profile.slice";
import * as ImagePicker from "expo-image-picker";

// Utility function to get color based on completion percentage
const getProgressColor = (value) => {
  if (value >= 100) return COLORS.primary || "#4CAF50";
  if (value >= 70) return COLORS.info || "#2196F3";
  if (value >= 40) return COLORS.warning || "#FFC107";
  return COLORS.error || "#FF5722";
};

// Enhanced ProfileSection component with completion tracking
const ProfileSection = ({ title, children, fields, profile }) => {
  const calculateSectionCompletion = () => {
    if (!profile) return 0;
    const filledFields = fields.filter((field) => {
      const value = field.includes(".")
        ? profile.profile?.[field.split(".")[1]]
        : profile[field];
      return value !== null && value !== undefined && value !== "";
    });
    return Math.round((filledFields.length / fields.length) * 100);
  };

  const completion = calculateSectionCompletion();

  return (
    <View
      style={[
        styles.section,
        completion >= 100 && {
          borderLeftWidth: 4,
          borderLeftColor: COLORS.primary,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        {completion > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: getProgressColor(completion),
                marginRight: 8,
                fontSize: 12,
                fontWeight: "500",
              }}
            >
              {completion}%
            </Text>
            {completion >= 100 && (
              <MaterialIcons
                name="check-circle"
                size={20}
                color={COLORS.primary}
              />
            )}
          </View>
        )}
      </View>
      {children}
    </View>
  );
};

// Enhanced ProfileItem component with improved validation
const ProfileItem = ({ icon, label, value, isRequired = false }) => {
  const isComplete = value !== null && value !== undefined && value !== "";
  const isArray = Array.isArray(value);
  const displayValue = isArray ? value.join(", ") : value;

  return (
    <View
      style={[
        styles.profileItem,
        isComplete && { backgroundColor: COLORS.primary + "10" },
      ]}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={isComplete ? COLORS.primary : COLORS.primary}
      />
      <View style={styles.profileItemContent}>
        <Text style={styles.itemLabel}>
          {label}
          {isRequired && <Text style={{ color: COLORS.error }}> *</Text>}
        </Text>
        <Text
          style={[styles.itemValue, isComplete && { color: COLORS.primary }]}
        >
          {displayValue || "Not provided"}
        </Text>
      </View>
      {isComplete && (
        <MaterialIcons
          name="check"
          size={16}
          color={COLORS.primary}
          style={{ marginLeft: 8 }}
        />
      )}
    </View>
  );
};

export default function ProfileScreen() {
  const [photoUploadError, setPhotoUploadError] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    data: profile,
    loading,
    error,
  } = useSelector((state) => state.profile);

  const [refreshing, setRefreshing] = useState(false);
  const progressAnimation = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
  const onRefresh = useCallback(
    async (retries = 3) => {
      setRefreshing(true);
      try {
        const updatedProfile = await dispatch(fetchProfile()).unwrap();

        // Extract profile photo URL
        const photoUrl =
          updatedProfile?.profile?.photo_url ||
          updatedProfile?.data?.profile?.photo_url;

        if (photoUrl) {
          console.log("Updated profile photo URL:", photoUrl);
        }

        setRefreshing(false);
      } catch (error) {
        console.error("Profile refresh error:", error);
        if (retries > 0) {
          console.log(
            `Retrying profile refresh. Attempts left: ${retries - 1}`
          );
          setTimeout(() => onRefresh(retries - 1), 1000);
        } else {
          setRefreshing(false);
          Alert.alert(
            "Error",
            "Failed to refresh profile. Please try again later."
          );
        }
      }
    },
    [dispatch]
  );
  const handleLogout = useCallback(() => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(logout()).unwrap();

            setTimeout(() => {
              router.push("/(auth)/login");
            }, 100);
          } catch (error) {
            Alert.alert(
              "Logout Failed",
              error?.message || "Unable to logout. Please try again."
            );
          }
        },
      },
    ]);
  }, [dispatch, router]);
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Section field definitions for tracking completion
  const sectionFields = {
    basic: ["first_name", "last_name", "email", "phone_number", "gender"],
    demographics: [
      "profile.nationality",
      "profile.origin",
      "profile.religion",
      "profile.country_of_residence",
      "profile.city",
      "profile.date_of_birth",
      "profile.zodiac_sign",
    ],
    professional: [
      "profile.educational_level",
      "profile.specialization",
      "profile.employment_status",
      "profile.job_title",
      "profile.position_level",
    ],
    personal: [
      "profile.financial_status",
      "profile.housing_status",
      "profile.car_ownership",
      "profile.height",
      "profile.weight",
      "profile.marital_status",
      "profile.children",
    ],
    appearance: [
      "profile.skin_color",
      "profile.hair_color",
      "profile.hijab_status",
    ],
    lifestyle: [
      "profile.smoking_status",
      "profile.drinking_status",
      "profile.sports_activity",
      "profile.social_media_presence",
      "profile.hobbies",
      "profile.pets",
    ],
    contact: ["profile.guardian_contact"],
  };

  const calculateProgress = () => {
    if (!profile) return 0;
    const allFields = Object.values(sectionFields).flat();
    const filledFields = allFields.filter((field) => {
      const [section, key] = field.includes(".")
        ? field.split(".")
        : ["", field];
      const value =
        section === "profile" ? profile.profile?.[key] : profile[field];
      return value !== null && value !== undefined && value !== "";
    });
    return Math.round((filledFields.length / allFields.length) * 100);
  };

  useEffect(() => {
    if (profile) {
      const progress = calculateProgress();
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [profile]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (error) {
    // Navigate to login after 100ms delay
    setTimeout(() => {
      router.push("/(auth)/login");
    }, 200);

    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>An error occurred: {error}</Text>
        <TouchableOpacity
          onPress={() => dispatch(fetchProfile())}
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="person-off" size={48} color={COLORS.text} />
        <Text style={styles.errorText}>No profile data available.</Text>
      </View>
    );
  }

  const progress = calculateProgress();
  const handlePhotoUpdate = async (formData) => {
    setIsUploading(true);
    setPhotoUploadError(null);

    try {
      const response = await dispatch(updateProfilePhoto(formData)).unwrap();
      console.log("Photo update response:", JSON.stringify(response, null, 2));

      if (
        response &&
        (response.success || response.message === "Image updated successfully.")
      ) {
        console.log("Photo update successful, refreshing profile");
        onRefresh();
      } else {
        console.log("Photo update failed with response:", response);
        throw new Error(response.message || "Failed to update profile photo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setPhotoUploadError("Failed to update profile photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        // Ensure RefreshControl works correctly on both iOS and Android
        paddingTop: Platform.OS === "ios" ? 0 : -50,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
          title="Pull to refresh"
          titleColor={COLORS.primary}
          progressViewOffset={Platform.OS === "ios" ? 50 : 50}
        />
      }
    >
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.profileHeader} accessibilityLabel="Profile Header">
          <PhotoUploader
            currentPhotoUrl={profile.profile?.photos?.[0]?.photo_url}
            onPhotoUpdate={handlePhotoUpdate}
            onError={(errorMessage) => {
              setPhotoUploadError(errorMessage);
            }}
            isUploading={isUploading}
            uploadError={photoUploadError}
            accessibilityLabel="Update profile photo"
            accessibilityHint="Double tap to choose a new profile photo"
          />
          <Text style={styles.userName}>
            {profile.first_name} {profile.last_name}
            {profile.progress === 100 && " ✓"}
          </Text>
          <View style={styles.statusContainer}>
            <View
              style={
                profile.profile_status === "Active"
                  ? styles.greenDot
                  : styles.grayDot
              }
            />
            <Text style={styles.userStatus}>{profile.profile_status}</Text>
          </View>
          {profile.profile?.bio && (
            <Text style={styles.userBio}>{profile.profile.bio}</Text>
          )}
          {photoUploadError && (
            <Text style={styles.errorText}>{photoUploadError}</Text>
          )}
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Profile Completion: {progress}%{progress === 100 && " ✨"}
          </Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                  backgroundColor: getProgressColor(progress),
                },
              ]}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <ProfileSection
          title="Basic Information"
          fields={sectionFields.basic}
          profile={profile}
        >
          <ProfileItem
            icon="person"
            label="First Name"
            value={profile.first_name}
            isRequired={true}
          />
          <ProfileItem
            icon="person-outline"
            label="Last Name"
            value={profile.last_name}
            isRequired={true}
          />
          <ProfileItem
            icon="email"
            label="Email"
            value={profile.email}
            isRequired={true}
          />
          <ProfileItem
            icon="phone"
            label="Phone Number"
            value={profile.phone_number}
            isRequired={true}
          />
          <ProfileItem
            icon="wc"
            label="Gender"
            value={profile.gender}
            isRequired={true}
          />
        </ProfileSection>

        <ProfileSection
          title="Demographics"
          fields={sectionFields.demographics}
          profile={profile}
        >
          <ProfileItem
            icon="flag"
            label="Nationality"
            value={profile.profile?.nationality}
            isRequired={true}
          />
          <ProfileItem
            icon="public"
            label="Origin"
            value={profile.profile?.origin}
          />
          <ProfileItem
            icon="church"
            label="Religion"
            value={profile.profile?.religion}
            isRequired={true}
          />
          <ProfileItem
            icon="location-city"
            label="Country"
            value={profile.profile?.country_of_residence}
            isRequired={true}
          />
          <ProfileItem
            icon="location-on"
            label="City"
            value={profile.profile?.city}
            isRequired={true}
          />
          <ProfileItem
            icon="cake"
            label="Date of Birth"
            value={profile.profile?.date_of_birth}
            isRequired={true}
          />
          <ProfileItem
            icon="stars"
            label="Zodiac Sign"
            value={profile.profile?.zodiac_sign}
          />
        </ProfileSection>

        <ProfileSection
          title="Professional Information"
          fields={sectionFields.professional}
          profile={profile}
        >
          <ProfileItem
            icon="school"
            label="Education"
            value={profile.profile?.educational_level}
            isRequired={true}
          />
          <ProfileItem
            icon="work"
            label="Specialization"
            value={profile.profile?.specialization}
          />
          <ProfileItem
            icon="business-center"
            label="Employment Status"
            value={
              profile.profile?.employment_status ? "Employed" : "Not Employed"
            }
            isRequired={true}
          />
          <ProfileItem
            icon="badge"
            label="Job Title"
            value={profile.profile?.job_title}
          />
          <ProfileItem
            icon="trending-up"
            label="Position Level"
            value={profile.profile?.position_level}
          />
        </ProfileSection>

        <ProfileSection
          title="Personal Details"
          fields={sectionFields.personal}
          profile={profile}
        >
          <ProfileItem
            icon="account-balance-wallet"
            label="Financial Status"
            value={profile.profile?.financial_status}
            isRequired={true}
          />
          <ProfileItem
            icon="home"
            label="Housing Status"
            value={profile.profile?.housing_status}
          />
          <ProfileItem
            icon="directions-car"
            label="Car Ownership"
            value={profile.profile?.car_ownership ? "Yes" : "No"}
          />
          <ProfileItem
            icon="straighten"
            label="Height"
            value={profile.profile?.height}
            isRequired={true}
          />
          <ProfileItem
            icon="fitness-center"
            label="Weight"
            value={profile.profile?.weight}
            isRequired={true}
          />
          <ProfileItem
            icon="favorite"
            label="Marital Status"
            value={profile.profile?.marital_status}
            isRequired={true}
          />
          <ProfileItem
            icon="child-care"
            label="Children"
            value={profile.profile?.children?.toString()}
          />
        </ProfileSection>

        <ProfileSection
          title="Appearance"
          fields={sectionFields.appearance.filter(
            (field) =>
              profile.gender === "Female" || field !== "profile.hijab_status"
          )}
          profile={profile}
        >
          <ProfileItem
            icon="palette"
            label="Skin Color"
            value={profile.profile?.skin_color}
            isRequired={true}
          />
          <ProfileItem
            icon="brush"
            label="Hair Color"
            value={profile.profile?.hair_color}
            isRequired={true}
          />
          {profile.gender === "Female" && (
            <ProfileItem
              icon="face"
              label="Hijab Status"
              value={profile.profile?.hijab_status ? "Yes" : "No"}
              isRequired={true}
            />
          )}
        </ProfileSection>

        <ProfileSection
          title="Lifestyle"
          fields={sectionFields.lifestyle}
          profile={profile}
        >
          <ProfileItem
            icon="smoking-rooms"
            label="Smoking Status"
            value={profile.profile?.smoking_status ? "Yes" : "No"}
            isRequired={true}
          />
          <ProfileItem
            icon="local-bar"
            label="Drinking Status"
            value={profile.profile?.drinking_status}
            isRequired={true}
          />
          <ProfileItem
            icon="directions-run"
            label="Sports Activity"
            value={profile.profile?.sports_activity}
          />
          <ProfileItem
            icon="public"
            label="Social Media"
            value={profile.profile?.social_media_presence}
          />
          <ProfileItem
            icon="local-activity"
            label="Hobbies"
            value={profile.profile?.hobbies}
          />
          <ProfileItem icon="pets" label="Pets" value={profile.profile?.pets} />
        </ProfileSection>

        <ProfileSection
          title="Contact"
          fields={sectionFields.contact}
          profile={profile}
        >
          <ProfileItem
            icon="contact-phone"
            label="Guardian Contact"
            value={profile.profile?.guardian_contact}
            isRequired={true}
          />
        </ProfileSection>

        {progress === 100 && (
          <View
            style={{
              backgroundColor: COLORS.primary + "15",
              padding: 16,
              borderRadius: 12,
              marginTop: 8,
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name="check-circle"
              size={24}
              color={COLORS.primary}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 16,
                fontWeight: "500",
              }}
            >
              Profile Complete! ✨
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
