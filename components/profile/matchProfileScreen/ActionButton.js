import React, { useRef, useContext } from "react";
import {
  TouchableOpacity,
  Animated,
  Text,
  ActivityIndicator,
} from "react-native";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../../constants/colors";
import createMatchProfileStyles from "../../../styles/matchProfileStyle";
import { LanguageContext } from "../../../contexts/LanguageContext";
const ActionButton = ({ icon, label, onPress, primary, loading }) => {
  const { isRTL } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={loading}
    >
      <Animated.View
        style={[
          styles.actionButton,
          primary ? styles.primaryButton : styles.secondaryButton,
          { transform: [{ scale }] },
        ]}
      >
        <LinearGradient
          colors={
            primary ? COLORS.primaryGradient : ["transparent", "transparent"]
          }
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {loading ? (
          <ActivityIndicator
            color={primary ? COLORS.white : COLORS.primary}
            size="small"
          />
        ) : (
          <>
            <Feather
              name={icon}
              size={24}
              color={primary ? COLORS.white : COLORS.primary}
            />
            <Text
              style={[
                styles.actionButtonText,
                primary && styles.primaryButtonText,
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default ActionButton;
