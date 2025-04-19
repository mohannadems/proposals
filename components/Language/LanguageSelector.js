import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LanguageContext } from "../../contexts/LanguageContext";
import { COLORS } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";

const LanguageSelector = () => {
  const { locale, changeLanguage, isRTL } = useContext(LanguageContext);

  return (
    <TouchableOpacity
      style={[
        styles.languageButton,
        {
          right: isRTL ? "auto" : 20,
          left: isRTL ? 20 : "auto",
          top: isRTL ? 230 : 230,
        },
      ]}
      onPress={() => changeLanguage(locale === "en" ? "ar" : "en")}
    >
      <MaterialIcons name="language" size={20} color={COLORS.white} />
      <Text style={styles.buttonText}>
        {locale === "en" ? "العربية" : "English"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    position: "absolute",
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    color: COLORS.white,
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default LanguageSelector;
