import React, { memo, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import createMatchProfileStyles from "../../styles/SearchScreen";
import { LanguageContext } from "../../contexts/LanguageContext";

const SearchHeader = ({ activeSection, onReturn, onComplete }) => {
  const { isRTL, t } = useContext(LanguageContext);
  const styles = createMatchProfileStyles(isRTL);

  let title = t("search.find_match");
  let subtitle = t("search.complete_sections");

  if (activeSection) {
    switch (activeSection) {
      case "basic":
        title = t("search.sections.basic.title");
        subtitle = t("search.basic_info.description");
        break;
      case "education":
        title = t("search.sections.education.title");
        subtitle = t("search.education.description");
        break;
      case "personal":
        title = t("search.sections.personal.title");
        subtitle = t("search.personal.description");
        break;
      case "lifestyle":
        title = t("search.sections.lifestyle.title");
        subtitle = t("search.lifestyle.description");
        break;
      default:
        break;
    }
  }

  return (
    <LinearGradient
      colors={COLORS.primaryGradient}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {activeSection ? (
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onReturn}
            accessibilityLabel={t("search.buttons.back")}
            accessibilityRole="button"
          >
            <Ionicons
              name={isRTL ? "arrow-forward" : "arrow-back"}
              size={24}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={onComplete}
            accessibilityLabel={t("search.buttons.done")}
            accessibilityRole="button"
          >
            <Text style={styles.doneButtonText}>
              {t("search.buttons.done")}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default memo(SearchHeader);
