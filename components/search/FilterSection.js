import React from "react";
import { View, Text, StyleSheet } from "react-native";
import COLORS from "../../constants/colors";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

const FilterSection = ({ title, children }) => {
  const { isRTL } = useContext(LanguageContext);

  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          { textAlign: isRTL ? "right" : "left" }, // Add this line for RTL support
        ]}
      >
        {title}
      </Text>
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F4",
    // textAlign will be added dynamically
  },
  contentContainer: {
    padding: 16,
  },
});

export default FilterSection;
