import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import styles from "../../styles/SearchScreen";

const SearchHeader = ({ activeSection, onReturn, onComplete }) => {
  return (
    <LinearGradient colors={COLORS.primaryGradient} style={styles.header}>
      {activeSection ? (
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onReturn}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {activeSection === "basic" && "Basic Information"}
            {activeSection === "education" && "Education & Career"}
            {activeSection === "personal" && "Personal Attributes"}
            {activeSection === "lifestyle" && "Lifestyle"}
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={onComplete}
            accessibilityLabel="Done"
            accessibilityRole="button"
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.headerTitle}>Find Your Match</Text>
          <Text style={styles.headerSubtitle}>
            Complete the sections below to find your perfect partner
          </Text>
        </>
      )}
    </LinearGradient>
  );
};

export default memo(SearchHeader);
