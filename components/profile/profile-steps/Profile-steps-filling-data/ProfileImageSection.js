import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import Feather from "react-native-vector-icons/Feather";
import { COLORS } from "../../../../constants/colors";
import { updateProfilePhoto } from "../../../../store/slices/profile.slice";
import Reanimated, {
  FadeIn,
  FadeInDown,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LanguageContext } from "../../../../contexts/LanguageContext";

const AnimatedView = Reanimated.createAnimatedComponent(View);
const AnimatedTouchableOpacity =
  Reanimated.createAnimatedComponent(TouchableOpacity);

const ProfileImageSection = ({ isRTL = false, t }) => {
  const { isRTL: contextRTL, t: contextT } = useContext(LanguageContext) || {};
  const _isRTL = isRTL !== undefined ? isRTL : contextRTL;
  const _t = t || contextT;

  const dispatch = useDispatch();
  const { setValue, watch } = useFormContext();
  const profileImage = watch("profile_image");

  const isFirstRender = useRef(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false); // Track if user has interacted

  const profileState = useSelector((state) => state.profile) || {};

  const avatarUrl = profileState.data?.profile?.avatar_url;
  const currentAvatar =
    avatarUrl && typeof avatarUrl === "string" && avatarUrl.trim() !== ""
      ? avatarUrl
      : null;

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isFirstRender.current) {
      setError("");
      setImageLoadError(false);
      isFirstRender.current = false;
    }

    if (!hasInitialized) {
      setError("");
      setImageLoadError(false);
    }

    const avatarUrl = profileState.data?.profile?.avatar_url;

    if (
      !hasInitialized &&
      avatarUrl &&
      typeof avatarUrl === "string" &&
      avatarUrl.trim() !== ""
    ) {
      setValue("profile_image", { uri: avatarUrl });
      setHasInitialized(true);
    }

    opacity.value = withTiming(1, { duration: 500 });
  }, [profileState.data?.profile?.avatar_url, hasInitialized]);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const hasImage =
    !loading &&
    !imageLoadError &&
    ((profileImage?.uri && profileImage.uri.trim() !== "") ||
      (currentAvatar && currentAvatar.trim() !== ""));

  const requestPermissions = async (forCamera = false) => {
    if (Platform.OS !== "web") {
      let permissionResult;

      if (forCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.status !== "granted") {
        Alert.alert(
          _t ? _t("profile.images.permission_title") : "Permission Required",
          _t
            ? _t("profile.images.permission_message")
            : `Sorry, we need ${
                forCamera ? "camera" : "media library"
              } permissions to proceed!`
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const handleImageUpload = async (selectedImage) => {
    try {
      setLoading(true);
      setError("");
      setImageLoadError(false);

      if (!selectedImage || !selectedImage.uri) {
        throw new Error(
          _t ? _t("profile.images.invalid_image") : "Invalid image selection"
        );
      }

      const formData = new FormData();
      formData.append("profile_photo", {
        uri: selectedImage.uri,
        type: selectedImage.type || "image/jpeg",
        name: "profile_photo.jpg",
      });

      const response = await dispatch(
        updateProfilePhoto({ formData })
      ).unwrap();

      if (response.error) {
        throw new Error(response.error);
      }

      scale.value = withSpring(1.1, { damping: 15, stiffness: 200 }, () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      });

      return true;
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error.message ||
          error.errors?.profile_photo?.[0] ||
          (_t
            ? _t("profile.images.upload_error")
            : "Failed to upload image. Please try again.")
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (source) => {
    try {
      setUserInteracted(true);

      setError("");
      setImageLoadError(false);

      const hasPermission = await requestPermissions(source === "camera");
      if (!hasPermission) return;

      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];

        const imageSize = selectedImage.fileSize || 0;
        if (imageSize > 5 * 1024 * 1024) {
          setError(
            _t
              ? _t("profile.images.size_error")
              : "Image size should be less than 5MB"
          );
          return;
        }

        setValue("profile_image", {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg",
        });

        await handleImageUpload(selectedImage);
      }
    } catch (error) {
      console.error("Image picking error:", error);
      setError(
        _t
          ? _t("profile.images.pick_error")
          : "Failed to pick image. Please try again."
      );
    }
  };

  const removeImage = async () => {
    try {
      setUserInteracted(true);

      if (!hasImage) return;

      setLoading(true);
      setError("");
      setImageLoadError(false);

      const formData = new FormData();
      formData.append("remove_profile_photo", "true");

      const response = await dispatch(
        updateProfilePhoto({ formData })
      ).unwrap();

      if (response.error) {
        throw new Error(response.error);
      }

      setValue("profile_image", null);

      scale.value = withSpring(0.9, { damping: 15, stiffness: 200 }, () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 200 });
      });
    } catch (error) {
      console.error("Remove image error:", error);
      setError(
        error.message ||
          error.errors?.profile_photo?.[0] ||
          (_t
            ? _t("profile.images.remove_error")
            : "Failed to remove image. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedView
      entering={FadeInDown.duration(600).springify()}
      style={[styles.container, animatedContainerStyle]}
    >
      <View style={styles.headerContainer}>
        <Text
          style={[styles.headerTitle, { textAlign: _isRTL ? "right" : "left" }]}
        >
          {_t ? _t("profile.images.title") : "Profile Picture"}
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { textAlign: _isRTL ? "right" : "left" },
          ]}
        >
          {_t
            ? _t("profile.images.subtitle")
            : "Make a great first impression with your best photo"}
        </Text>
      </View>

      <AnimatedView
        style={[styles.imagePickerContainer, animatedImageStyle]}
        entering={ZoomIn.duration(400)}
      >
        <TouchableOpacity
          onPress={() => pickImage("gallery")}
          style={styles.imagePreviewWrapper}
          disabled={loading}
        >
          {hasImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: profileImage?.uri || currentAvatar }}
                style={styles.profileImage}
                onLoadStart={() => {
                  setImageLoadError(false);
                }}
                onError={() => {
                  setImageLoadError(true);

                  if (userInteracted && (profileImage?.uri || currentAvatar)) {
                    setError(
                      _t
                        ? _t("profile.images.load_error")
                        : "Failed to load image"
                    );
                  }
                  setValue("profile_image", null);
                }}
              />
              <View style={styles.imageOverlay}>
                <Feather name="camera" size={24} color={COLORS.white} />
                <Text style={styles.overlayText}>
                  {_t ? _t("profile.images.change_photo") : "Change Photo"}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Feather name="user" size={50} color={COLORS.primary} />
              <Text
                style={[
                  styles.placeholderText,
                  { textAlign: _isRTL ? "right" : "center" },
                ]}
              >
                {_t ? _t("profile.images.tap_to_add") : "Add Profile Picture"}
              </Text>
            </View>
          )}

          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          )}
        </TouchableOpacity>

        {error && userInteracted ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={18} color={COLORS.error} />
            <Text
              style={[
                styles.errorText,
                { textAlign: _isRTL ? "right" : "left" },
              ]}
            >
              {error}
            </Text>
          </View>
        ) : null}

        <View
          style={[
            styles.buttonsContainer,
            { flexDirection: _isRTL ? "row-reverse" : "row" },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.button,
              styles.cameraButton,
              loading && styles.disabledButton,
            ]}
            onPress={() => pickImage("camera")}
            disabled={loading}
          >
            <Feather name="camera" size={18} color={COLORS.white} />
            <Text style={styles.buttonText}>
              {_t ? _t("profile.images.take_photo") : "Camera"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.galleryButton,
              loading && styles.disabledButton,
            ]}
            onPress={() => pickImage("gallery")}
            disabled={loading}
          >
            <Feather name="image" size={18} color={COLORS.white} />
            <Text style={styles.buttonText}>
              {_t ? _t("profile.images.choose_gallery") : "Gallery"}
            </Text>
          </TouchableOpacity>
        </View>

        {hasImage && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.removeButton,
              loading && styles.disabledButton,
            ]}
            onPress={removeImage}
            disabled={loading}
          >
            <Feather name="trash-2" size={18} color={COLORS.white} />
            <Text style={styles.buttonText}>
              {_t ? _t("profile.images.remove_photo") : "Remove Photo"}
            </Text>
          </TouchableOpacity>
        )}
      </AnimatedView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    marginBottom: 20,
    backgroundColor: "white",
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
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    lineHeight: 22,
  },
  imagePickerContainer: {
    alignItems: "center",
    backgroundColor: "white",
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
    width: 180,
    height: 180,
    marginBottom: 24,
    position: "relative",
  },
  imagePreviewContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 90,
    overflow: "hidden",
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
  placeholderContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 90,
    backgroundColor: "rgba(65, 105, 225, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: "100%",
  },
  errorText: {
    color: COLORS.error,
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  buttonsContainer: {
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
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
  buttonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
    marginLeft: 8,
  },
  cameraButton: {
    backgroundColor: COLORS.primary,
  },
  galleryButton: {
    backgroundColor: COLORS.secondary,
  },
  removeButton: {
    backgroundColor: COLORS.error,
    width: "100%",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ProfileImageSection;
