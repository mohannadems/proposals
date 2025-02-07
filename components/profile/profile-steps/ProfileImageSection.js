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
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import Feather from "react-native-vector-icons/Feather";
import { COLORS } from "../../../constants/colors";
import { updateProfilePhoto } from "../../../store/slices/profile.slice";
import Reanimated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedView = Reanimated.createAnimatedComponent(View);
const AnimatedTouchableOpacity =
  Reanimated.createAnimatedComponent(TouchableOpacity);

const SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 200,
};

const CardHeader = ({ title, subtitle }) => (
  <AnimatedView
    entering={FadeInDown.duration(600).springify()}
    style={styles.headerContainer}
  >
    <Text style={styles.headerTitle}>{title}</Text>
    <Text style={styles.headerSubtitle}>{subtitle}</Text>
  </AnimatedView>
);
const ProfileImageSection = () => {
  const dispatch = useDispatch();
  const { setValue, watch } = useFormContext();
  const profileImage = watch("profile_image");
  const [imageError, setImageError] = useState("");
  const scale = useSharedValue(1);

  const { loading, error } = useSelector((state) => state.profile);
  const currentAvatar = useSelector(
    (state) => state.profile.data.profile?.avatar_url
  );

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(scale.value, SPRING_CONFIG) }],
  }));

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

  const handleImageUpload = async (selectedImage) => {
    try {
      const formData = new FormData();
      formData.append("profile_photo", {
        uri: selectedImage.uri,
        type: "image/jpeg",
        name: "profile_photo.jpg",
      });

      const response = await dispatch(updateProfilePhoto(formData)).unwrap();
      if (response.error) {
        throw new Error(response.error);
      }
      setImageError("");

      // Add scale animation for feedback
      scale.value = withSpring(1.1, SPRING_CONFIG, () => {
        scale.value = withSpring(1, SPRING_CONFIG);
      });
    } catch (error) {
      console.error("Upload error:", error);
      setImageError(
        error.message ||
          error.errors?.profile_photo?.[0] ||
          "Failed to upload image. Please try again."
      );
    }
  };

  const pickImage = async (type) => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      let result;
      if (type === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission needed", "Camera permission is required");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        const selectedImage = result.assets[0];
        const imageSize = selectedImage.fileSize || 0;

        if (imageSize > 5 * 1024 * 1024) {
          setImageError("Image size should be less than 5MB");
          return;
        }

        setValue("profile_image", {
          uri: selectedImage.uri,
          type: selectedImage.type,
        });

        await handleImageUpload(selectedImage);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      setImageError("Failed to pick image. Please try again.");
    }
  };

  const removeImage = async () => {
    try {
      setValue("profile_image", null);
      setImageError("");

      const formData = new FormData();
      formData.append("profile_photo", null);

      const response = await dispatch(updateProfilePhoto(formData)).unwrap();
      if (response.error) {
        throw new Error(response.error);
      }

      scale.value = withSpring(0.9, SPRING_CONFIG, () => {
        scale.value = withSpring(1, SPRING_CONFIG);
      });
    } catch (error) {
      console.error("Remove image error:", error);
      setImageError(
        error.message ||
          error.errors?.profile_photo?.[0] ||
          "Failed to remove image. Please try again."
      );
    }
  };
  return (
    <AnimatedView
      entering={FadeInUp.duration(600).springify()}
      style={styles.container}
    >
      <CardHeader
        title="Profile Picture 📸"
        subtitle="Make a great first impression with your best photo"
      />

      <AnimatedView
        style={[styles.imagePickerContainer, animatedImageStyle]}
        entering={FadeIn.delay(300).duration(600)}
      >
        <TouchableOpacity
          onPress={() => pickImage("gallery")}
          style={styles.imagePreviewWrapper}
        >
          {profileImage || currentAvatar ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: profileImage?.uri || currentAvatar }}
                style={styles.profileImage}
              />
              <View style={styles.imageOverlay}>
                <Feather name="camera" size={24} color={COLORS.white} />
                <Text style={styles.overlayText}>Change Photo</Text>
              </View>
              <AnimatedTouchableOpacity
                entering={FadeIn.delay(400)}
                style={styles.removeImageButton}
                onPress={removeImage}
              >
                <Feather name="x" size={20} color={COLORS.white} />
              </AnimatedTouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Feather name="camera" size={50} color={COLORS.primary} />
              <Text style={styles.placeholderText}>
                Tap to add your profile picture ✨
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {(imageError || error) && (
          <AnimatedView
            entering={FadeIn.duration(300)}
            style={styles.errorContainer}
          >
            <Feather name="alert-circle" size={20} color={COLORS.error} />
            <Text style={styles.errorText}>{imageError || error}</Text>
          </AnimatedView>
        )}

        <View style={styles.buttonContainer}>
          <AnimatedTouchableOpacity
            entering={FadeInUp.delay(400).duration(600)}
            style={[
              styles.actionButton,
              styles.cameraButton,
              loading && styles.disabledButton,
            ]}
            onPress={() => pickImage("camera")}
            disabled={loading}
          >
            <Feather name="camera" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Take Photo</Text>
          </AnimatedTouchableOpacity>

          <AnimatedTouchableOpacity
            entering={FadeInUp.delay(500).duration(600)}
            style={[
              styles.actionButton,
              styles.galleryButton,
              loading && styles.disabledButton,
            ]}
            onPress={() => pickImage("gallery")}
            disabled={loading}
          >
            <Feather name="image" size={20} color={COLORS.white} />
            <Text style={styles.actionButtonText}>Choose from Gallery</Text>
          </AnimatedTouchableOpacity>
        </View>
      </AnimatedView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    marginBottom: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    textAlign: "center",
    lineHeight: 24,
  },
  imagePickerContainer: {
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  imagePreviewWrapper: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  imagePreviewContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    overflow: "hidden",
    position: "relative",
    borderWidth: 3,
    borderColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  overlayText: {
    color: COLORS.white,
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  removeImageButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: COLORS.error,
    borderRadius: 20,
    padding: 8,
    zIndex: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    backgroundColor: "rgba(65, 105, 225, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "600",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cameraButton: {
    backgroundColor: COLORS.primary,
  },
  galleryButton: {
    backgroundColor: COLORS.secondary,
  },
  actionButtonText: {
    color: COLORS.white,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    width: "100%",
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.6,
  },
  activityIndicator: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  // Touch feedback styles
  touchableContent: {
    opacity: 1,
  },
  touchableContentPressed: {
    opacity: 0.7,
  },
  // Platform-specific hover effects
  ...Platform.select({
    web: {
      imagePreviewContainer: {
        ":hover .imageOverlay": {
          opacity: 1,
        },
      },
      actionButton: {
        ":hover": {
          opacity: 0.9,
        },
      },
    },
  }),
});
export default ProfileImageSection;
