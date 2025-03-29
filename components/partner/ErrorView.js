import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import styles from "../../styles/SearchScreen";

const ErrorView = ({ error, onRetry }) => {
  return (
    <View style={styles.loadingContainer}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <LinearGradient
        colors={COLORS.primaryGradient}
        style={styles.loadingGradient}
      >
        <Ionicons name="alert-circle" size={60} color={COLORS.white} />
        <Text style={[styles.loadingText, styles.errorMessage]}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default ErrorView;
