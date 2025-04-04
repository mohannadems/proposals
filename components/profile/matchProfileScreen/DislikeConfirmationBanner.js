import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { FadeInDown } from "react-native-reanimated";
import { COLORS } from "../../../constants/colors";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
import { LanguageContext } from "../../../contexts/LanguageContext";
import { useContext } from "react";
const DislikeConfirmationBanner = ({
  visible,
  onConfirm,
  onCancel,
  userName,
  isLoading,
}) => {
  const { t, isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);
  if (!visible) return null;

  return (
    <>
      <BlurView intensity={20} style={styles.blurryBackground} tint="dark" />

      <Animated.View
        style={styles.dislikeConfirmationContainer}
        entering={FadeInDown.duration(300)}
      >
        <View style={styles.dislikeConfirmationContent}>
          <View style={styles.dislikeConfirmationHeader}>
            <Feather name="x-circle" size={24} color={COLORS.error} />
            <Text style={styles.dislikeConfirmationTitle}>
              Dislike Confirmation
            </Text>
          </View>

          <Text style={styles.dislikeConfirmationText}>
            Are you sure you want to dislike {userName}? This profile will no
            longer appear in your matches.
          </Text>

          <View style={styles.dislikeConfirmationActions}>
            <TouchableOpacity
              style={[
                styles.dislikeConfirmationButton,
                styles.dislikeConfirmationCancelButton,
              ]}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.dislikeConfirmationCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dislikeConfirmationButton,
                styles.dislikeConfirmationConfirmButton,
              ]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.dislikeConfirmationConfirmText}>
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

export default DislikeConfirmationBanner;
