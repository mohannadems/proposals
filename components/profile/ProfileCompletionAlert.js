import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { setShowProfileAlert } from "../../store/slices/profile.slice";
import { COLORS } from "../../constants/colors";
import {
  calculateProfileProgress,
  getProgressMessage,
} from "../../utils/profileProgress";

const ProfileCompletionAlert = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, showProfileAlert } = useSelector((state) => state.profile);
  const userId = useSelector((state) => state.profile.data?.id);

  const [savedProgress, setSavedProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animated values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animation setup
  useEffect(() => {
    if (showProfileAlert) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showProfileAlert]);

  // Load saved progress from AsyncStorage
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        setIsLoading(true);
        if (!userId) return;

        const storageKey = `profile_form_data_${userId}`;
        const savedData = await AsyncStorage.getItem(storageKey);

        if (savedData) {
          const parsed = JSON.parse(savedData);
          setSavedProgress(parsed);
        }
      } catch (error) {
        console.error("Error loading saved progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedProgress();
  }, [userId]);

  // Calculate progress including saved data
  const { progress, stepProgress, missingFields } = calculateProfileProgress(
    data,
    savedProgress
  );

  if (!showProfileAlert || progress === 100) return null;

  const handleComplete = () => {
    dispatch(setShowProfileAlert(false));
    router.push("/(profile)/fillProfileData");
  };

  const handleLater = () => {
    dispatch(setShowProfileAlert(false));
  };

  const renderStepProgress = () => {
    return (
      <View style={styles.stepProgressContainer}>
        {Object.entries(stepProgress).map(([step, progress]) => (
          <View key={step} style={styles.stepItem}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Step {step}</Text>
              <Text style={styles.stepPercentage}>{progress.percentage}%</Text>
            </View>
            <View style={styles.stepProgressBar}>
              <Animated.View
                style={[
                  styles.stepProgressFill,
                  {
                    width: `${progress.percentage}%`,
                    backgroundColor:
                      progress.percentage === 100
                        ? COLORS.success
                        : COLORS.primary,
                  },
                ]}
              />
            </View>
            <Text style={styles.stepDetails}>
              {progress.completed}/{progress.total} completed
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderMissingFields = () => {
    if (missingFields.length === 0) return null;

    return (
      <View style={styles.missingFieldsContainer}>
        <Text style={styles.missingFieldsTitle}>
          <Ionicons name="warning" size={16} color="#FF6B6B" /> Required Fields
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.missingFieldsScroll}
        >
          {missingFields.map((field, index) => (
            <View key={index} style={styles.missingFieldChip}>
              <Text style={styles.missingFieldText}>{field.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal transparent animationType="fade" visible={showProfileAlert}>
      <Animated.View
        style={[
          styles.modalOverlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#ffffff", "#f8f9ff"]}
            style={styles.modalContent}
          >
            {/* Animated Lottie Animation */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Text style={styles.iconEmoji}>🚀</Text>
              </View>
              <Animated.View
                style={[
                  styles.progressPulse,
                  {
                    transform: [
                      {
                        scale: scaleAnim.interpolate({
                          inputRange: [0, 0.5, 1],
                          outputRange: [1, 1.2, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.title}>Your Journey to Love</Text>
              <Text style={styles.subtitle}>
                {getProgressMessage(progress)}
                <Text style={styles.progressHighlight}> ({progress}%)</Text>
              </Text>
            </View>

            {!isLoading && (
              <>
                {savedProgress && (
                  <View style={styles.savedProgressContainer}>
                    <View style={styles.savedProgressHeader}>
                      <Ionicons
                        name="bookmark"
                        size={18}
                        color={COLORS.primary}
                      />
                      <Text style={styles.savedProgressTitle}>
                        {" "}
                        Saved Progress
                      </Text>
                    </View>
                    <Text style={styles.savedProgressText}>
                      You were last on step {savedProgress.step} of 4
                    </Text>
                    <Text style={styles.savedProgressDate}>
                      Last updated:{" "}
                      {new Date(savedProgress.lastUpdated).toLocaleString()}
                    </Text>
                  </View>
                )}

                {renderStepProgress()}
                {renderMissingFields()}
              </>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleLater}
                style={styles.laterButton}
              >
                <Text style={styles.laterButtonText}>Later</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleComplete}
                style={styles.completeButton}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.completeButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.completeButtonText}>
                    {savedProgress ? "Continue Profile" : "Complete Profile"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  modalContent: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  iconEmoji: {
    fontSize: 64,
  },
  progressPulse: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: `${COLORS.primary}10`,
    zIndex: 5,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  progressHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 18,
  },
  savedProgressContainer: {
    width: "100%",
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  savedProgressHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  savedProgressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  savedProgressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  savedProgressDate: {
    fontSize: 12,
    color: "#888",
  },
  stepProgressContainer: {
    width: "100%",
    marginBottom: 16,
  },
  stepItem: {
    marginBottom: 12,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  stepPercentage: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  stepProgressBar: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  stepProgressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  stepDetails: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  missingFieldsContainer: {
    width: "100%",
    marginVertical: 10,
  },
  missingFieldsTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  missingFieldsScroll: {
    paddingHorizontal: 10,
  },
  missingFieldChip: {
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  missingFieldText: {
    color: COLORS.primary,
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 8,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  laterButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary + "50",
    flex: 1,
    backgroundColor: "white",
    marginRight: 12,
  },
  laterButtonText: {
    color: COLORS.primary,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  completeButton: {
    flex: 1.5,
    borderRadius: 12,
    overflow: "hidden",
  },
  completeButtonGradient: {
    padding: 16,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ProfileCompletionAlert;
