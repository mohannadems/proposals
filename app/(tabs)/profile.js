import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import { fetchProfile } from "../../store/slices/profile.slice";
import { logout } from "../../store/slices/auth.slice";
import styles from "../../styles/ProfileScreenStyles";

const ProfileSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ProfileItem = ({ icon, label, value }) => (
  <View style={styles.profileItem}>
    <MaterialIcons name={icon} size={24} color={COLORS.primary} />
    <View style={styles.profileItemContent}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value || "Not provided"}</Text>
    </View>
  </View>
);

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const {
    data: profile,
    loading,
    error,
  } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const calculateProgress = () => {
    if (!profile) return 0;
    const fields = [
      "first_name",
      "last_name",
      "birth_date",
      "gender",
      "height",
      "weight",
      "hair_color",
      "skin_color",
      "marital_status",
      "hobbies",
      "pets",
      "sports_activities",
      "smoking_tool",
      "drinking_status",
      "specialization",
      "position_level",
      "education_level",
      "country",
      "nationality",
      "housing_status",
      "financial_status",
    ];
    const filledFields = fields.filter((field) => profile[field]);
    return Math.round((filledFields.length / fields.length) * 100);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>An error occurred: {error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No profile data available.</Text>
      </View>
    );
  }

  const progress = calculateProgress();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
      >
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.profileHeader}>
          <Image
            source={
              profile.profile?.avatar_url
                ? { uri: profile.profile.avatar_url }
                : require("../../assets/images/wh.jpg")
            }
            style={styles.avatar}
          />
          <Text style={styles.userName}>
            {profile.first_name} {profile.last_name}
          </Text>
          <Text style={styles.userStatus}>{profile.profile_status}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Profile Completion: {progress}%
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <ProfileSection title="Information">
          <ProfileItem
            icon="person"
            label="First Name"
            value={profile.first_name}
          />
          <ProfileItem
            icon="person-outline"
            label="Last Name"
            value={profile.last_name}
          />
          <ProfileItem icon="email" label="Email" value={profile.email} />
          <ProfileItem
            icon="phone"
            label="Phone Number"
            value={profile.phone_number}
          />
          <ProfileItem icon="wc" label="Gender" value={profile.gender} />
        </ProfileSection>
        <ProfileSection title="Personal Information">
          <ProfileItem
            icon="cake"
            label="Date of Birth"
            value={profile.profile?.date_of_birth}
          />
          <ProfileItem
            icon="height"
            label="Height"
            value={profile.profile?.height}
          />
          <ProfileItem
            icon="fitness-center"
            label="Weight"
            value={profile.profile?.weight}
          />
          <ProfileItem
            icon="color-lens"
            label="Hair Color"
            value={profile.profile?.hair_color}
          />
          <ProfileItem
            icon="palette"
            label="Skin Color"
            value={profile.profile?.skin_color}
          />
          <ProfileItem
            icon="favorite"
            label="Marital Status"
            value={profile.profile?.marital_status}
          />
        </ProfileSection>

        <ProfileSection title="Lifestyle & Interests">
          <ProfileItem
            icon="local-activity"
            label="Hobbies"
            value={profile.profile?.hobbies?.join(", ")}
          />
          <ProfileItem
            icon="pets"
            label="Pets"
            value={profile.profile?.pets?.join(", ")}
          />
          <ProfileItem
            icon="directions-run"
            label="Sports Activities"
            value={profile.profile?.sports_activity}
          />
          <ProfileItem
            icon="smoking-rooms"
            label="Smoking"
            value={profile.profile?.smoking_status ? "Yes" : "No"}
          />
          <ProfileItem
            icon="local-bar"
            label="Drinking"
            value={profile.profile?.drinking_status}
          />
        </ProfileSection>

        <ProfileSection title="Professional & Education">
          <ProfileItem
            icon="work"
            label="Specialization"
            value={profile.profile?.specialization}
          />
          <ProfileItem
            icon="assignment"
            label="Position Level"
            value={profile.profile?.position_level}
          />
          <ProfileItem
            icon="school"
            label="Education Level"
            value={profile.profile?.educational_level}
          />
        </ProfileSection>

        <ProfileSection title="Location & Background">
          <ProfileItem
            icon="place"
            label="Country"
            value={profile.profile?.country_of_residence}
          />
          <ProfileItem
            icon="flag"
            label="Nationality"
            value={profile.profile?.nationality}
          />
          <ProfileItem
            icon="home"
            label="Housing Status"
            value={profile.profile?.housing_status}
          />
          <ProfileItem
            icon="account-balance-wallet"
            label="Financial Status"
            value={profile.profile?.financial_status}
          />
        </ProfileSection>
      </View>
    </ScrollView>
  );
}
