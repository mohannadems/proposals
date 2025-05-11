import React, { useState, useEffect, useCallback, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/colors";
import Svg, { Circle, LinearGradient, Stop } from "react-native-svg";
import {
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
  RefreshControl,
} from "react-native";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { calculateProfileProgress } from "../../utils/profileProgress";
import ProfileCompletionAlert from "./ProfileCompletionAlert";
import { fetchProfileCompletionData } from "../../store/slices/profileCompletionSlice";
import { LanguageContext } from "../../contexts/LanguageContext";
const { width } = Dimensions.get("window");
const scale = width / 375;
const moderateScale = (size) => size + (scale - 1) * 0.5;

const isApiProfileComplete = (userData) => {
  if (!userData || !userData.data || !userData.data.profile) {
    return false;
  }

  const { profile } = userData.data;

  const criticalFields = [
    "nationality",
    "language",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "educational_level",
    "marital_status",
    "employment_status",
    "job_title",
    "financial_status",
  ];

  const filledCount = criticalFields.filter(
    (field) =>
      profile[field] !== null &&
      profile[field] !== undefined &&
      profile[field] !== ""
  ).length;

  const hasPhotos =
    profile.photos &&
    Array.isArray(profile.photos) &&
    profile.photos.length > 0;

  const isComplete = filledCount >= criticalFields.length * 0.8 && hasPhotos;

  return isComplete;
};

const isProfileEmpty = (userData) => {
  if (!userData) return true;

  const profile = userData.profile || (userData.data && userData.data.profile);

  if (!profile) return true;

  const requiredFields = [
    "nationality",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "age",
    "educational_level",
    "marital_status",
    "height",
    "weight",
  ];

  const emptyCount = requiredFields.filter(
    (field) =>
      profile[field] === null ||
      profile[field] === undefined ||
      profile[field] === ""
  ).length;

  return emptyCount > requiredFields.length * 0.7;
};

const checkProfileCompletion = (userData) => {
  if (!userData || !userData.data || !userData.data.profile) {
    return {
      isProfileComplete: false,
      missingFields: ["profile data missing"],
    };
  }

  const { profile } = userData.data;

  const requiredFields = [
    "nationality",
    "language",
    "religion",
    "country_of_residence",
    "city",
    "date_of_birth",
    "age",
    "educational_level",
    "employment_status",
    "marital_status",
    "height",
    "weight",
  ];

  const requiredArrayFields = ["photos"];

  const missingFields = [];

  requiredFields.forEach((field) => {
    if (
      profile[field] === null ||
      profile[field] === undefined ||
      profile[field] === ""
    ) {
      missingFields.push(field);
    } else if (field === "employment_status" && profile[field] === 0) {
      missingFields.push(field);
    }
  });

  requiredArrayFields.forEach((field) => {
    if (
      !profile[field] ||
      !Array.isArray(profile[field]) ||
      profile[field].length === 0
    ) {
      missingFields.push(field);
    }
  });

  return {
    isProfileComplete: missingFields.length === 0,
    missingFields: missingFields,
  };
};

const createMergedProfileData = (userData, formData) => {
  try {
    let mergedData = {
      data: {
        profile: {},
      },
    };

    if (userData) {
      if (userData.data) {
        mergedData = JSON.parse(JSON.stringify(userData));
      } else if (userData.profile) {
        mergedData.data.profile = JSON.parse(JSON.stringify(userData.profile));
      } else {
        mergedData.data.profile = JSON.parse(JSON.stringify(userData));
      }
    }

    if (!mergedData.data.profile) {
      mergedData.data.profile = {};
    }

    if (formData) {
      const fieldMapping = {
        nationality_id: "nationality",
        religion_id: "religion",
        country_of_residence_id: "country_of_residence",
        city_id: "city",
        date_of_birth: "date_of_birth",
        educational_level_id: "educational_level",
        marital_status_id: "marital_status",
        employment_status: "employment_status",
      };

      Object.entries(fieldMapping).forEach(([formField, profileField]) => {
        if (formData[formField] !== undefined) {
          mergedData.data.profile[profileField] = formData[formField];
        }
      });

      if (formData.height) mergedData.data.profile.height = formData.height;
      if (formData.weight) mergedData.data.profile.weight = formData.weight;
      if (formData.profile_image) {
        mergedData.data.profile.photos = [formData.profile_image];
      }
    }

    return mergedData;
  } catch (error) {
    console.error("Detailed error in createMergedProfileData:", {
      error: error.message,
      userData: userData ? Object.keys(userData) : "undefined",
      formData: formData ? Object.keys(formData) : "undefined",
    });

    return {
      data: {
        profile: {},
      },
    };
  }
};

const ProgressCircle = ({ progress }) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <Animated.View style={[styles.progressCircleContainer, circleStyle]}>
      <Svg width={160} height={160}>
        <Circle
          cx={80}
          cy={80}
          r={70}
          stroke="#f0f0f0"
          strokeWidth={10}
          fill="transparent"
        />
        <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="100%">
          <Stop offset="0" stopColor={COLORS.primary} />
          <Stop offset="1" stopColor={COLORS.secondary} />
        </LinearGradient>
        <Circle
          cx={80}
          cy={80}
          r={70}
          stroke="url(#grad)"
          strokeWidth={10}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
        />
      </Svg>
      <View style={styles.innerCircleContent}>
        <Text style={styles.progressText}>{progress}%</Text>
        <Text style={styles.progressLabel}>Complete</Text>
      </View>
    </Animated.View>
  );
};

const StepProgressBar = ({ progress }) => {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withSpring(progress, {
      damping: 20,
      stiffness: 90,
    });
  }, [progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View style={styles.progressBar}>
      <Animated.View style={[styles.progressBarFill, barStyle]}>
        <ExpoLinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
      </Animated.View>
    </View>
  );
};

const StepCard = ({ step, info, isActive, isRTL }) => {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.stepCard, cardStyle, isActive && styles.activeStepCard]}
    >
      <View
        style={[
          styles.stepHeader,
          { flexDirection: isRTL ? "row-reverse" : "row" },
        ]}
      >
        <Text
          style={[styles.stepTitle, { textAlign: isRTL ? "right" : "left" }]}
        >
          Step {step}
        </Text>
        <Text
          style={[
            styles.stepStatus,
            { color: info.percentage === 100 ? "#4CAF50" : COLORS.primary },
          ]}
        >
          {info.percentage}%
        </Text>
      </View>
      <StepProgressBar progress={info.percentage} />
      <Text
        style={[styles.stepDetails, { textAlign: isRTL ? "right" : "left" }]}
      >
        {info.completed}/{info.total} fields completed
      </Text>
    </Animated.View>
  );
};

const withProfileCompletion = (WrappedComponent) => {
  return (props) => {
    const { t, isRTL } = useContext(LanguageContext);
    const rtlStyles = {
      messageCard: {
        alignItems: isRTL ? "flex-end" : "flex-start",
      },
      messageText: {
        textAlign: isRTL ? "right" : "left",
      },
      messageTitle: {
        textAlign: isRTL ? "right" : "left",
        alignSelf: isRTL ? "flex-end" : "flex-start",
      },
      savedProgressCard: {
        alignItems: isRTL ? "flex-end" : "flex-start",
      },
      savedProgressTitle: {
        textAlign: isRTL ? "right" : "left",
        alignSelf: isRTL ? "flex-end" : "flex-start",
      },
      savedProgressText: {
        textAlign: isRTL ? "right" : "left",
      },
      savedProgressDate: {
        textAlign: isRTL ? "right" : "left",
      },
      stepHeader: {
        flexDirection: isRTL ? "row-reverse" : "row",
      },
      buttonGradient: {
        flexDirection: isRTL ? "row-reverse" : "row",
      },
      refreshButton: {
        flexDirection: isRTL ? "row-reverse" : "row",
      },
      refreshButtonText: {
        marginLeft: isRTL ? 0 : moderateScale(8),
        marginRight: isRTL ? moderateScale(8) : 0,
      },
    };
    const dispatch = useDispatch();
    const { data } = useSelector((state) => state.profile);

    const userId = useSelector((state) => state.profile?.id);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [savedProgress, setSavedProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [progressInfo, setProgressInfo] = useState({
      progress: 0,
      missingFields: [],
      stepProgress: {},
    });

    const fadeAnim = useSharedValue(0);

    useEffect(() => {
      dispatch(fetchProfileCompletionData());
    }, [dispatch]);

    const loadProfileData = useCallback(async () => {
      try {
        if (!data) {
          console.warn("No profile data available");
          setProgressInfo({
            progress: 0,
            missingFields: [],
            stepProgress: {},
          });
          return;
        }

        const storageKey = userId
          ? `profile_form_data_${userId}`
          : "profile_form_data_default";

        const savedUserKey = await AsyncStorage.getItem(
          "last_logged_in_user_id"
        );
        if (savedUserKey && savedUserKey !== userId) {
          await AsyncStorage.removeItem(storageKey);
          await AsyncStorage.removeItem("last_logged_in_user_id");
        }

        if (userId) {
          await AsyncStorage.setItem("last_logged_in_user_id", userId);
        }

        const savedData = await AsyncStorage.getItem(storageKey);

        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);

            if (parsed.userId && parsed.userId !== userId) {
              await AsyncStorage.removeItem(storageKey);
              const defaultProgressData = calculateProfileProgress(data);
              setProgressInfo(defaultProgressData);
              return;
            }

            setSavedProgress(parsed);

            let progressData;
            try {
              const mergedData = createMergedProfileData(data, parsed.formData);
              progressData = calculateProfileProgress(mergedData, parsed);
            } catch (progressCalcError) {
              console.error("Error calculating progress:", progressCalcError);
              progressData = calculateProfileProgress(data);
            }

            const apiComplete = isApiProfileComplete(data);
            const serverProfileIsEmpty = isProfileEmpty(data);

            if (serverProfileIsEmpty) {
              progressData = calculateProfileProgress(data);
            } else if (apiComplete) {
              progressData.progress = 100;
              Object.keys(progressData.stepProgress).forEach((step) => {
                progressData.stepProgress[step].percentage = 100;
                progressData.stepProgress[step].completed =
                  progressData.stepProgress[step].total;
              });
            }

            setProgressInfo(progressData);
          } catch (parseError) {
            console.error("Error parsing saved progress:", parseError);
            await AsyncStorage.removeItem(storageKey);
            const defaultProgressData = calculateProfileProgress(data);
            setProgressInfo(defaultProgressData);
          }
        } else {
          const defaultProgressData = calculateProfileProgress(data);
          setProgressInfo(defaultProgressData);
        }
      } catch (error) {
        console.error("Comprehensive error in loadProfileData:", error);

        setProgressInfo({
          progress: 0,
          missingFields: [],
          stepProgress: {},
        });
      } finally {
        setIsLoading(false);
      }
    }, [userId, data]);

    useEffect(() => {
      const initializeData = async () => {
        setIsLoading(true);
        await loadProfileData();
        setIsLoading(false);
      };

      initializeData();
    }, [userId, data, loadProfileData]);

    useEffect(() => {
      fadeAnim.value = withTiming(1, { duration: 800 });
    }, []);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await dispatch(fetchProfileCompletionData());
      await loadProfileData();
      setRefreshing(false);
    }, [dispatch, loadProfileData]);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {t("profile_completion.loading")}
          </Text>
        </View>
      );
    }

    let { progress, stepProgress } = progressInfo;

    const apiComplete = isApiProfileComplete(data);
    if (apiComplete && progress < 90) {
      progress = 100;
    }

    const hasLocalSavedData =
      savedProgress && savedProgress.formData && savedProgress.step > 1;
    const apiProfileComplete = data
      ? checkProfileCompletion(data).isProfileComplete
      : false;

    if (
      apiComplete ||
      progress >= 100 ||
      (!apiProfileComplete && hasLocalSavedData && progress >= 80)
    ) {
      return <WrappedComponent {...props} />;
    }

    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ProfileCompletionAlert />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          <Animated.View
            style={[styles.contentContainer, { opacity: fadeAnim }]}
          >
            <ProgressCircle progress={progress} />

            <View style={[styles.messageCard, rtlStyles.messageCard]}>
              <MaterialIcons
                name="psychology"
                size={28}
                color={COLORS.primary}
                style={styles.messageIcon}
              />
              <Text style={[styles.messageTitle, rtlStyles.messageTitle]}>
                {t("profile_completion.message_title")}
              </Text>
              <Text style={[styles.messageText, rtlStyles.messageText]}>
                {t("profile_completion.message_text")}
              </Text>
            </View>

            {savedProgress && (
              <View
                style={[styles.savedProgressCard, rtlStyles.savedProgressCard]}
              >
                <Feather name="bookmark" size={24} color={COLORS.primary} />
                <Text
                  style={[
                    styles.savedProgressTitle,
                    rtlStyles.savedProgressTitle,
                  ]}
                >
                  {t("profile_completion.resume_progress_title")}
                </Text>
                <Text
                  style={[
                    styles.savedProgressText,
                    rtlStyles.savedProgressText,
                  ]}
                >
                  {t("profile_completion.resume_progress_text", {
                    step: savedProgress.step,
                  })}
                </Text>
                <Text
                  style={[
                    styles.savedProgressDate,
                    rtlStyles.savedProgressDate,
                  ]}
                >
                  {t("profile_completion.last_updated", {
                    date: new Date(savedProgress.lastUpdated).toLocaleString(),
                  })}
                </Text>
              </View>
            )}

            <View style={styles.stepsContainer}>
              {Object.entries(stepProgress).map(([step, info]) => (
                <StepCard
                  key={step}
                  step={step}
                  info={info}
                  isActive={savedProgress?.step === Number(step)}
                  t={t}
                  isRTL={isRTL} // Pass isRTL to StepCard
                />
              ))}
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.refreshButton, rtlStyles.refreshButton]}
                onPress={onRefresh}
                disabled={refreshing}
              >
                <Feather
                  name="refresh-cw"
                  size={20}
                  color={COLORS.primary}
                  style={{
                    ...(refreshing && { transform: [{ rotate: "45deg" }] }),
                  }}
                />
                <Text
                  style={[
                    styles.refreshButtonText,
                    rtlStyles.refreshButtonText,
                  ]}
                >
                  {refreshing
                    ? t("profile_completion.refreshing")
                    : t("profile_completion.refresh")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/(profile)/fillProfileData")}
              >
                <ExpoLinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={[styles.buttonGradient, rtlStyles.buttonGradient]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {savedProgress
                      ? t("profile_completion.continue_profile")
                      : t("profile_completion.complete_profile")}
                  </Text>
                  <Feather
                    name={isRTL ? "arrow-left" : "arrow-right"}
                    size={20}
                    color="#fff"
                  />
                </ExpoLinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: moderateScale(24),
  },
  contentContainer: {
    paddingHorizontal: moderateScale(20),
  },
  progressCircleContainer: {
    alignItems: "center",
    marginBottom: moderateScale(24),
    position: "relative",
  },
  innerCircleContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: moderateScale(36),
    fontWeight: Platform.select({ ios: "700", android: "bold" }),
    color: COLORS.primary,
  },
  progressLabel: {
    fontSize: moderateScale(16),
    color: "#666",
    marginTop: moderateScale(4),
  },
  messageCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: moderateScale(16),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  messageIcon: {
    marginBottom: moderateScale(12),
  },
  messageTitle: {
    fontSize: moderateScale(20),
    fontWeight: Platform.select({ ios: "700", android: "bold" }),
    color: "#1a1a1a",
    marginBottom: moderateScale(8),
  },
  messageText: {
    fontSize: moderateScale(16),
    color: "#666",
    lineHeight: moderateScale(24),
  },
  savedProgressCard: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: moderateScale(16),
  },
  savedProgressTitle: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: moderateScale(8),
    marginBottom: moderateScale(4),
  },
  savedProgressText: {
    fontSize: moderateScale(16),
    color: "#666",
    marginBottom: moderateScale(4),
  },
  savedProgressDate: {
    fontSize: moderateScale(14),
    color: "#888",
  },
  stepsContainer: {
    marginBottom: moderateScale(24),
  },
  stepCard: {
    backgroundColor: "white",
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateScale(12),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeStepCard: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(12),
  },
  stepTitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: "#1a1a1a",
  },
  stepStatus: {
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  progressBar: {
    height: moderateScale(6),
    backgroundColor: "#f0f0f0",
    borderRadius: moderateScale(3),
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: moderateScale(3),
  },
  stepDetails: {
    fontSize: moderateScale(14),
    color: "#666",
    marginTop: moderateScale(8),
  },
  actionButtonsContainer: {
    marginBottom: moderateScale(20),
  },
  actionButton: {
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(12),
    marginBottom: moderateScale(16),
    backgroundColor: "white",
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: `${COLORS.primary}30`,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  refreshButtonText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(16),
    fontWeight: "500",
    color: COLORS.primary,
  },
});

export default withProfileCompletion;
