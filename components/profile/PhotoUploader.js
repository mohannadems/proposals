import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";
import { updateProfilePhoto } from "../../store/slices/profile.slice";
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { Feather } from "@expo/vector-icons";
const PhotoUploader = ({ currentPhotoUrl, onPhotoUpdate }) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant access to your photo library to upload photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        await handleUpload(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleUpload = async (uri) => {
    setUploading(true);
    try {
      // Create form data for the upload
      const formData = new FormData();

      // Get the file extension
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("photo", {
        uri,
        type,
        name: filename || "photo.jpg",
      });

      // Dispatch the update action
      const response = await dispatch(updateProfilePhoto(formData)).unwrap();

      if (response?.photos?.[0]?.photo_url) {
        onPhotoUpdate(response.photos[0].photo_url);
        Alert.alert("Success", "Profile photo updated successfully");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert(
        "Upload Failed",
        error?.message || "Unable to upload photo. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };
  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={uploading}
      style={styles.photoContainer}
    >
      <Image
        source={
          currentPhotoUrl
            ? { uri: currentPhotoUrl }
            : require("../../assets/images/wh.jpg")
        }
        style={styles.avatar}
      />
      <View style={styles.editContainer}>
        <View style={styles.editButton}>
          <Feather name="camera" size={14} color={COLORS.white} />
        </View>
      </View>
      {uploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  photoContainer: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  editContainer: {
    position: "absolute",
    bottom: 5,
    right: 0,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
  },
});
export default PhotoUploader;
