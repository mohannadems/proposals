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

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const {
    data: profile,
    loading,
    error,
  } = useSelector((state) => state.profile);
  const [refreshing, setRefreshing] = useState(false);

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

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {}}
          colors={[COLORS.primary]}
        />
      }
    >
      <LinearGradient colors={["#4169E1", "#D4AF37"]} style={styles.header}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <MaterialIcons name="person" size={40} color="#fff" />
              </View>
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>
              {profile.bio || "Add a bio to tell others about yourself"}
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

        <ProfileSection title="Basic Information">
          <ProfileItem icon="person" label="Gender" value={profile.gender} />
          <ProfileItem
            icon="cake"
            label="Date of Birth"
            value={profile.dateOfBirth}
          />
          <ProfileItem
            icon="flag"
            label="Nationality"
            value={profile.nationality}
          />
          <ProfileItem
            icon="person-pin"
            label="Origin"
            value={profile.origin}
          />
        </ProfileSection>

        <ProfileSection title="Location">
          <ProfileItem
            icon="location-on"
            label="Country"
            value={profile.countryOfResidence}
          />
          <ProfileItem
            icon="location-city"
            label="City"
            value={profile.cityOfResidence}
          />
          <ProfileItem icon="place" label="Area" value={profile.area} />
        </ProfileSection>

        <ProfileSection title="Education & Work">
          <ProfileItem
            icon="school"
            label="Education"
            value={profile.education}
          />
          <ProfileItem
            icon="work"
            label="Occupation"
            value={profile.occupation}
          />
          <ProfileItem
            icon="business"
            label="Work Sector"
            value={profile.workSector}
          />
          <ProfileItem
            icon="trending-up"
            label="Work Level"
            value={profile.workLevel}
          />
        </ProfileSection>

        <ProfileSection title="Lifestyle">
          <ProfileItem
            icon="favorite"
            label="Marital Status"
            value={profile.maritalStatus}
          />
          <ProfileItem
            icon="language"
            label="Languages"
            value={profile.languages?.join(", ")}
          />
          <ProfileItem
            icon="fitness-center"
            label="Exercise Habits"
            value={profile.exerciseHabits}
          />
          <ProfileItem icon="opacity" label="Smoking" value={profile.smoking} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "#4169E1",
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
    backgroundColor: "#4169E1",
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
