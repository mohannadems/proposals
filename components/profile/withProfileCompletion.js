import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
  StatusBar,
  Dimensions,
} from "react-native";
import Animated, {
  withSpring,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { calculateProfileProgress } from "../../utils/profileProgress";
import ProfileCompletionAlert from "./ProfileCompletionAlert";

const { width } = Dimensions.get("window");
const scale = width / 375;
const moderateScale = (size) => size + (scale - 1) * 0.5;

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

const StepCard = ({ step, info, isActive }) => {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.stepCard, cardStyle, isActive && styles.activeStepCard]}
    >
      <View style={styles.stepHeader}>
        <Text style={styles.stepTitle}>Step {step}</Text>
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
      <Text style={styles.stepDetails}>
        {info.completed}/{info.total} fields completed
      </Text>
    </Animated.View>
  );
};

const withProfileCompletion = (WrappedComponent) => {
  return (props) => {
    const { data } = useSelector((state) => state.profile);
    const userId = useSelector((state) => state.profile.data?.id);
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [savedProgress, setSavedProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progressInfo, setProgressInfo] = useState({
      progress: 0,
      missingFields: [],
    });
    const fadeAnim = useSharedValue(0);

    useEffect(() => {
      fadeAnim.value = withTiming(1, { duration: 800 });
    }, []);

    useEffect(() => {
      const loadSavedProgress = async () => {
        try {
          setIsLoading(true);
          if (!userId) {
            setProgressInfo(calculateProfileProgress(data));
            return;
          }

          const storageKey = `profile_form_data_${userId}`;
          const savedData = await AsyncStorage.getItem(storageKey);

          if (savedData) {
            const parsed = JSON.parse(savedData);
            setSavedProgress(parsed);
            setProgressInfo(calculateProfileProgress(data, parsed));
          } else {
            setProgressInfo(calculateProfileProgress(data));
          }
        } catch (error) {
          console.error("Error loading saved progress:", error);
          setProgressInfo(calculateProfileProgress(data));
        } finally {
          setIsLoading(false);
        }
      };

      loadSavedProgress();
    }, [userId, data]);

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }

    const { progress, stepProgress } = progressInfo;

    if (progress < 100) {
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
          >
            <Animated.View
              style={[styles.contentContainer, { opacity: fadeAnim }]}
            >
              <ProgressCircle progress={progress} />

              <View style={styles.messageCard}>
                <MaterialIcons
                  name="psychology"
                  size={28}
                  color={COLORS.primary}
                  style={styles.messageIcon}
                />
                <Text style={styles.messageTitle}>Profile in Progress</Text>
                <Text style={styles.messageText}>
                  Complete your profile to unlock personalized matches and begin
                  your journey to meaningful connections.
                </Text>
              </View>

              {savedProgress && (
                <View style={styles.savedProgressCard}>
                  <Feather name="bookmark" size={24} color={COLORS.primary} />
                  <Text style={styles.savedProgressTitle}>
                    Resume Your Progress
                  </Text>
                  <Text style={styles.savedProgressText}>
                    Continue from step {savedProgress.step} of 4
                  </Text>
                  <Text style={styles.savedProgressDate}>
                    Last updated:{" "}
                    {new Date(savedProgress.lastUpdated).toLocaleString()}
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
                  />
                ))}
              </View>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/(profile)/fillProfileData")}
              >
                <ExpoLinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.buttonText}>
                    {savedProgress ? "Continue Profile" : "Complete Profile"}
                  </Text>
                  <Feather name="arrow-right" size={20} color="#fff" />
                </ExpoLinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </View>
      );
    }

    return <WrappedComponent {...props} />;
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
  actionButton: {
    marginHorizontal: moderateScale(20),
    marginBottom: moderateScale(20),
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
});

export default withProfileCompletion;
