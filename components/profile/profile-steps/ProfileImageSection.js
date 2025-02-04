import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useFormContext } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import Feather from "react-native-vector-icons/Feather";
import { COLORS } from "../../../constants/colors";

const ProfileImageSection = () => {
  const { setValue, watch } = useFormContext();
  const profileImage = watch("profile_image");
  const [imageError, setImageError] = useState("");

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to make this work!"
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const pickImage = async (type) => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      let result;
      if (type === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
          base64: true,
        });
      }

      if (!result.canceled) {
        const selectedImage = result.assets[0];

        const imageSize = selectedImage.fileSize || 0;
        if (imageSize > 5 * 1024 * 1024) {
          setImageError("Image size should be less than 5MB");
          return;
        }

        setImageError("");

        setValue("profile_image", {
          uri: selectedImage.uri,
          base64: selectedImage.base64,
          type: selectedImage.type,
        });
      }
    } catch (error) {
      console.error("Image picking error:", error);
      setImageError("Failed to pick image. Please try again.");
    }
  };

  const removeImage = () => {
    setValue("profile_image", null);
    setImageError("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Profile Picture</Text>
        <Text style={styles.subtitle}>
          Upload a clear, recent photo of yourself
        </Text>
      </View>

      <View style={styles.imagePickerContainer}>
        {profileImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: profileImage.uri }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={removeImage}
            >
              <Feather name="x" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <Feather name="camera" size={50} color={COLORS.primary} />
            <Text style={styles.placeholderText}>
              No profile picture selected
            </Text>
          </View>
        )}

        {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.cameraButton]}
            onPress={() => pickImage("camera")}
          >
            <Feather name="camera" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.galleryButton]}
            onPress={() => pickImage("gallery")}
          >
            <Feather name="image" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  imagePickerContainer: {
    alignItems: "center",
  },
  imagePreviewContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    position: "relative",
    marginBottom: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeImageButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.error,
    borderRadius: 20,
    padding: 5,
  },
  placeholderContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  placeholderText: {
    marginTop: 10,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  cameraButton: {
    backgroundColor: COLORS.primary,
  },
  galleryButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.white,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  errorText: {
    color: COLORS.error,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default ProfileImageSection;
