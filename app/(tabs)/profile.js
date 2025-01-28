// app/(tabs)/profile.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";
import { fetchProfile } from "../../store/slices/profile.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../store/slices/auth.slice";

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

  const loadProfile = async () => {
    try {
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("BIOMETRIC_KEY");
      dispatch(logout());
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B65165" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={loadProfile}
          colors={[COLORS.primary]}
        />
      }
    >
      <LinearGradient colors={["#B65165", "#AB0CFB"]} style={styles.header}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialIcons name="person" size={40} color="#fff" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            <Text style={styles.first_name}>{profile?.first_name}</Text>{" "}
            <Text style={styles.last_name}>{profile?.last_name}</Text>
          </Text>

          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>
              {profile?.profile_status === "active" ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push("/(profile)/edit")}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Complete Your Profile</Text>
        </TouchableOpacity>

        <ProfileSection title="Account Information">
          <ProfileItem icon="email" label="Email" value={profile?.email} />
          <ProfileItem
            icon="phone"
            label="Phone Number"
            value={profile?.phone_number}
          />
          <ProfileItem icon="person" label="Gender" value={profile?.gender} />
          <ProfileItem icon="verified" label="Status" value={profile?.status} />
        </ProfileSection>

        <ProfileSection title="Verification Status">
          <ProfileItem
            icon="check-circle"
            label="Email Verification"
            value={profile?.email_verified_at ? "Verified" : "Not Verified"}
          />
          <ProfileItem
            icon="access-time"
            label="Member Since"
            value={formatDate(profile?.created_at)}
          />
          <ProfileItem
            icon="update"
            label="Last Updated"
            value={formatDate(profile?.updated_at)}
          />
          <ProfileItem
            icon="schedule"
            label="Last Active"
            value={
              profile?.last_active
                ? formatDate(profile?.last_active)
                : "Not available"
            }
          />
        </ProfileSection>

        {error && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error" size={24} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const formatDate = (dateString) => {
  if (!dateString) return "Not available";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 0,
    right: 20,
    padding: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#B65165",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },

  bioContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 12,
    maxWidth: "90%",
  },
  bioText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B65165",
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  profileItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  itemValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B3010",
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    flex: 1,
  },
});
