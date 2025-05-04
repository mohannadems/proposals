import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { LanguageContext } from "../../contexts/LanguageContext";

const HiddenContactInfo = ({ onUnlockPress, style }) => {
  const { t } = useContext(LanguageContext);

  return (
    <View style={[style, styles.hiddenContainer]}>
      <View style={styles.blurredContent}>
        <View style={styles.phoneContainer}>
          <Feather name="phone" size={20} color={COLORS.primary} />
          <Text style={styles.phoneLabel}>{t("match_profile.phone")}</Text>
          <Text style={styles.hiddenText}>0*********</Text>
        </View>

        <View style={styles.emailContainer}>
          <Feather name="mail" size={20} color={COLORS.primary} />
          <Text style={styles.emailLabel}>{t("match_profile.email")}</Text>
          <Text style={styles.hiddenText}>***@***.***</Text>
        </View>
      </View>

      <TouchableOpacity onPress={onUnlockPress} style={styles.unlockButton}>
        <LinearGradient
          colors={COLORS.primaryGradient}
          style={styles.unlockGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Feather name="unlock" size={18} color={COLORS.white} />
          <Text style={styles.unlockText}>
            {t("match_profile.reveal_contact")}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  hiddenContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  blurredContent: {
    padding: 16,
    backgroundColor: "#F5F7FA",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  phoneLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    minWidth: 60,
  },
  emailLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    minWidth: 60,
  },
  hiddenText: {
    fontSize: 14,
    color: "#A0AEC0",
    marginLeft: 12,
  },
  unlockButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  unlockGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  unlockText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
};

export default HiddenContactInfo;
