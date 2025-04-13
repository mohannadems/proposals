import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

const SavedPreferencesMessage = ({ t }) => {
  return (
    <View style={styles.savedPreferencesCard}>
      <Text style={styles.savedPreferencesTitle}>
        {t ? t("search.preferences_saved.title") : "Preferences Saved"}
      </Text>
      <Text style={styles.savedPreferencesText}>
        {t
          ? t("search.preferences_saved.message")
          : "Your search preferences have been saved. You can update them anytime."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  savedPreferencesCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  savedPreferencesTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.primary,
  },
  savedPreferencesText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default SavedPreferencesMessage;
