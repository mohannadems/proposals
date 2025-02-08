import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { setShowProfileAlert } from "../../store/slices/profile.slice";
import { COLORS } from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { calculateProfileProgress } from "../../utils/profileProgress";

const ProfileCompletionAlert = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, showProfileAlert } = useSelector((state) => state.profile);

  // Calculate progress and missing fields
  const { progress, missingFields } = calculateProfileProgress(data);

  // State to force re-render when progress changes
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Trigger re-render by toggling refresh state when progress changes
    setRefresh((prev) => !prev);
  }, [progress]);

  // Determine progress message based on completion
  const getProgressMessage = (progress) => {
    if (progress < 20) return "Let's get started on your profile!";
    if (progress < 40) return "You're making progress!";
    if (progress < 60) return "You're halfway there!";
    if (progress < 80) return "Almost complete!";
    return "Just a few more details to go!";
  };

  if (!showProfileAlert || progress === 100) return null;

  const handleComplete = () => {
    dispatch(setShowProfileAlert(false));
    router.push("/(profile)/fillProfileData");
  };

  const handleLater = () => {
    dispatch(setShowProfileAlert(false));
  };

  return (
    <Modal transparent animationType="fade" visible={showProfileAlert}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={["#ffffff", "#f8f9ff"]}
            style={styles.modalContent}
          >
            {/* Icon Container */}
            <View style={styles.iconContainer}>
              <MaterialIcons name="favorite" size={40} color={COLORS.primary} />
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>Your Journey to Love</Text>
              <Text style={styles.subtitle}>
                {getProgressMessage(progress)}
                <Text style={styles.progressHighlight}>({progress}%)</Text> to
                unlock the full potential of finding your perfect match!
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>

            {/* Missing Fields */}
            {missingFields.length > 0 && (
              <View style={styles.missingFieldsContainer}>
                <Text style={styles.missingFieldsTitle}>
                  Complete these fields:
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.missingFieldsScrollView}
                >
                  {missingFields.map((field, index) => (
                    <View key={index} style={styles.missingFieldChip}>
                      <Text style={styles.missingFieldText}>{field}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.description}>
              A complete profile attracts more meaningful connections
            </Text>

            {/* Buttons */}
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
                    Complete Profile
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
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
    gap: 16,
  },
  iconContainer: {
    backgroundColor: `${COLORS.primary}15`,
    padding: 16,
    borderRadius: 50,
    marginBottom: 8,
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  progressContainer: {
    width: "100%",
    marginVertical: 16,
    paddingHorizontal: 4,
  },
  progressBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    position: "absolute",
    left: 0,
    right: 0,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    paddingHorizontal: 20,
    marginBottom: 8,
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
  progressHighlight: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 18,
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
  },
  missingFieldsScrollView: {
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
});

export default ProfileCompletionAlert;
