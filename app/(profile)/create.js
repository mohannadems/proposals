import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function CreateProfileScreen() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log("Profile saved:", { name, bio, profilePicture });
    router.back(); // Navigate back to the previous screen
  };

  const handleUploadPicture = () => {
    // Logic to upload a profile picture
    console.log("Upload profile picture");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complete Your Profile</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Picture */}
        <TouchableOpacity
          style={styles.profilePictureContainer}
          onPress={handleUploadPicture}
        >
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <MaterialIcons
              name="add-a-photo"
              size={48}
              color={COLORS.primary}
            />
          )}
        </TouchableOpacity>

        {/* Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Bio */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Tell us about yourself"
            value={bio}
            onChangeText={setBio}
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginLeft: 16,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  profilePictureContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 24,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
