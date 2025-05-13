import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  RefreshControl,
  Platform,
  Alert,
  I18nManager,
} from "react-native";
import { Updates } from "expo-updates";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";
import ProfileDropdownMenu from "../../components/profile/ProfileDropdownMenu";
import {
  fetchProfile,
  updateProfilePhoto,
} from "../../store/slices/profile.slice";
import { logout } from "../../store/slices/auth.slice";
import styles from "../../styles/ProfileScreenStyles";
import { useRouter } from "expo-router";
import PhotoUploader from "../../components/profile/PhotoUploader";
import ModernLoadingScreen from "../../components/common/ModernLoader";
import LanguageSelector from "../../components/Language/LanguageSelector";
import RTLWrapper from "../../components/common/RTLWrapper";
import { LanguageContext } from "../../contexts/LanguageContext";
const getTextAlign = (isRTL) => (isRTL ? "right" : "left");

const getFlexDirection = (isRTL) => (isRTL ? "row-reverse" : "row");

const getMargins = (isRTL, value) => ({
  marginLeft: isRTL ? 0 : value,
  marginRight: isRTL ? value : 0,
});

const getBorders = (isRTL, width = 1, color = COLORS.border) => ({
  borderLeftWidth: isRTL ? 0 : width,
  borderRightWidth: isRTL ? width : 0,
  borderLeftColor: color,
  borderRightColor: color,
});

const getPaddings = (isRTL, left = 15, right = 0) => ({
  paddingLeft: isRTL ? right : left,
  paddingRight: isRTL ? left : right,
});
const getProgressColor = (value) => {
  if (value >= 100) return COLORS.primary || "#4CAF50";
  if (value >= 70) return COLORS.info || "#2196F3";
  if (value >= 40) return COLORS.warning || "#FFC107";
  return COLORS.error || "#FF5722";
};

const ProfileItem = ({ icon, label, value, isRequired = false }) => {
  const { isRTL, t } = useContext(LanguageContext);
  const isComplete = value !== null && value !== undefined && value !== "";
  const isArray = Array.isArray(value);
  const displayValue = isArray ? value.join(", ") : value;
  const labelText = t
    ? t(`profile.${label.toLowerCase().replace(/\s+/g, "_")}`) || label
    : label;
  const valueText =
    displayValue || (t ? t("profile.not_provided") : "Not provided");

  return (
    <View
      style={[
        styles.profileItem,
        isComplete && { backgroundColor: COLORS.primary + "10" },
      ]}
    >
      <View
        style={{
          flexDirection: getFlexDirection(isRTL),
          alignItems: "center",
          width: "100%",
        }}
      >
        <MaterialIcons
          name={icon}
          size={24}
          color={isComplete ? COLORS.primary : COLORS.primary}
        />
        <View
          style={[
            styles.profileItemContent,
            {
              ...getMargins(isRTL, 15),
              ...getBorders(isRTL),
              ...getPaddings(isRTL),
              flex: 1,
            },
          ]}
        >
          <Text style={[styles.itemLabel, { textAlign: getTextAlign(isRTL) }]}>
            {labelText}
            {isRequired && <Text style={{ color: COLORS.error }}> *</Text>}
          </Text>
          <Text
            style={[
              styles.itemValue,
              isComplete && { color: COLORS.primary },
              { textAlign: getTextAlign(isRTL) },
            ]}
          >
            {valueText}
          </Text>
        </View>
        {isComplete && (
          <MaterialIcons
            name="check"
            size={16}
            color={COLORS.primary}
            style={getMargins(isRTL, 8)}
          />
        )}
      </View>
    </View>
  );
};
const ProfileSection = ({ title, children, fields, profile }) => {
  const { isRTL, t } = useContext(LanguageContext);

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
          ...getMargins(isRTL, 15),
          ...getBorders(isRTL, 4, COLORS.primary),
        },
      ]}
    >
      <View
        style={{
          flexDirection: getFlexDirection(isRTL),
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text style={[styles.sectionTitle, { textAlign: getTextAlign(isRTL) }]}>
          {title}
        </Text>
        {completion > 0 && (
          <View
            style={{
              flexDirection: getFlexDirection(isRTL),
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: getProgressColor(completion),
                ...getMargins(isRTL, 8),
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

const ProfileScreen = () => {
  const { isRTL, t, locale, changeLanguage } = useContext(LanguageContext);

  const fetchedRef = useRef(false);
  const isFirstMount = useRef(true);

  const [photoUploadError, setPhotoUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    data: profile,
    loading,
    error,
  } = useSelector((state) => state.profile);

  const [refreshing, setRefreshing] = useState(false);
  const progressAnimation = useMemo(() => new Animated.Value(0), []);

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
      "profile.eye_color",
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

  useEffect(() => {
    if (isFirstMount.current && !fetchedRef.current) {
      fetchedRef.current = true;
      dispatch(fetchProfile());
      isFirstMount.current = false;
    }
  }, [dispatch]);

  const onRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Profile refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, refreshing]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      t ? t("profile.logout_title") : "Logout",
      t ? t("profile.logout_message") : "Are you sure you want to log out?",
      [
        {
          text: t ? t("common.cancel") : "Cancel",
          style: "cancel",
        },
        {
          text: t ? t("profile.logout") : "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await dispatch(logout()).unwrap();
              setTimeout(() => {
                router.push("/(auth)/login");
              }, 100);
            } catch (error) {
              Alert.alert(
                t ? t("profile.logout_failed") : "Logout Failed",
                error?.message ||
                  (t
                    ? t("profile.logout_error")
                    : "Unable to logout. Please try again.")
              );
            }
          },
        },
      ]
    );
  }, [dispatch, router, t]);
  const handleLanguageChange = async (newLanguage) => {
    try {
      await changeLanguage(newLanguage);

      return true;
    } catch (error) {
      console.error("Error changing language:", error);
      throw error;
    }
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

  const animatedOnce = useRef(false);
  useEffect(() => {
    if (profile && !animatedOnce.current) {
      animatedOnce.current = true;
      const progress = calculateProgress();
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [profile, progressAnimation]);

  const handlePhotoUpdate = async (formData) => {
    setIsUploading(true);
    setPhotoUploadError(null);

    try {
      const response = await dispatch(updateProfilePhoto(formData)).unwrap();

      if (
        response &&
        (response.success || response.message === "Image updated successfully.")
      ) {
        onRefresh();
      } else {
        throw new Error(response.message || "Failed to update profile photo");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setPhotoUploadError(
        t
          ? t("profile.photo_upload_error")
          : "Failed to update profile photo. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  if (loading && !refreshing && !profile) {
    return <ModernLoadingScreen />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>
          {t ? t("profile.error_occurred") : "An error occurred:"} {error}
        </Text>
        <TouchableOpacity
          onPress={() => {
            fetchedRef.current = false;
            dispatch(fetchProfile());
          }}
          style={styles.retryButton}
        >
          <Text
            style={styles.retryButtonText}
            onPress={() => router.push("/(auth)/login")}
          >
            {t ? t("common.retry") : "Retry"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="person-off" size={48} color={COLORS.text} />
        <Text style={styles.errorText}>
          {t ? t("profile.no_data") : "No profile data available."}
        </Text>
      </View>
    );
  }

  const progress = calculateProgress();

  return (
    <>
      <ScrollView
        style={[styles.container]}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: Platform.OS === "ios" ? 0 : -50,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
            title={t ? t("common.pull_to_refresh") : "Pull to refresh"}
            titleColor={COLORS.primary}
            progressViewOffset={Platform.OS === "ios" ? 50 : 50}
          />
        }
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={styles.header}
        >
          <View
            style={{
              position: "absolute",
              top: Platform.OS === "ios" ? 50 : 20,
              right: isRTL ? undefined : 20,
              left: isRTL ? 20 : undefined,
              zIndex: 10,
              alignItems: "center",
            }}
          >
            <ProfileDropdownMenu
              onLogout={handleLogout}
              onLanguageChange={handleLanguageChange}
            />

            <TouchableOpacity
              style={[
                styles.logoutButtonn,
                {
                  marginTop: 16,
                  position: "relative",
                  top: 0,
                  right: 0,
                  left: 0,
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: "../(profile)/seeMyProfile",
                  params: { userId: profile.id },
                })
              }
            >
              <MaterialIcons
                name="remove-red-eye"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
          <View
            style={styles.profileHeader}
            accessibilityLabel="Profile Header"
          >
            <PhotoUploader
              currentPhotoUrl={profile.profile?.photos?.[0]?.photo_url}
              onPhotoUpdate={handlePhotoUpdate}
              onError={(errorMessage) => {
                setPhotoUploadError(errorMessage);
              }}
              isUploading={isUploading}
              uploadError={photoUploadError}
              accessibilityLabel={
                t ? t("profile.update_photo") : "Update profile photo"
              }
              accessibilityHint={
                t
                  ? t("profile.update_photo_hint")
                  : "Double tap to choose a new profile photo"
              }
            />
            <Text style={styles.userName}>
              {profile.first_name} {profile.last_name}
              {progress === 100 && " ✓"}
            </Text>
            <View style={styles.statusContainer}>
              <View
                style={
                  profile.profile_status === "Active"
                    ? styles.greenDot
                    : styles.grayDot
                }
              />
              <Text style={styles.userStatus}>
                {t
                  ? t(`profile.status.${profile.profile_status}`)
                  : profile.profile_status}
              </Text>
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
              {t ? t("profile.completion") : "Profile Completion:"} {progress}%
              {progress === 100 && " ✨"}
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

        <ScrollView style={styles.content}>
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
              label="Gender_profile"
              value={t(`profile.gender.${profile.gender}`)}
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
              label="educational_level"
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
              value={profile.profile?.job_title || "Not Employee"}
            />
            <ProfileItem
              icon="trending-up"
              label="Position Level"
              value={profile.profile?.position_level || "Not Employee"}
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
              label="hobbies_profile"
              value={profile.profile?.hobbies}
            />
            <ProfileItem
              icon="pets"
              label="pets_profile"
              value={profile.profile?.pets}
            />
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
            <RTLWrapper
              style={{
                backgroundColor: COLORS.primary + "15",
                padding: 16,
                borderRadius: 12,
                marginTop: 8,
                marginBottom: 20,
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="check-circle"
                size={24}
                color={COLORS.primary}
                style={{
                  marginRight: isRTL ? 0 : 8,
                  marginLeft: isRTL ? 8 : 0,
                }}
              />
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 16,
                  fontWeight: "500",
                }}
              >
                {t ? t("profile.complete") : "Profile Complete!"} ✨
              </Text>
            </RTLWrapper>
          )}
        </ScrollView>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;
