import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";

const ContactInfo = ({
  isRevealed,
  contactData,
  onReveal,
  isLoading,
  style,
  translations,
}) => {
  if (!isRevealed) {
    return (
      <View style={[styles.hiddenContainer, style]}>
        <View style={styles.blurredContent}>
          <View style={styles.contactRow}>
            <Feather name="phone" size={20} color={COLORS.primary} />
            <Text style={styles.contactLabel}>{translations.phone}</Text>
            <Text style={styles.hiddenText}>0*********</Text>
          </View>

          <View style={styles.contactRow}>
            <Feather name="mail" size={20} color={COLORS.primary} />
            <Text style={styles.contactLabel}>{translations.email}</Text>
            <Text style={styles.hiddenText}>***@***.***</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onReveal}
          style={styles.revealButton}
          disabled={isLoading}
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.revealGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <>
                <Feather name="unlock" size={18} color={COLORS.white} />
                <Text style={styles.revealText}>
                  {translations.revealContact}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.revealedContainer, style]}>
      <View style={styles.revealedContent}>
        <View style={styles.contactRow}>
          <Feather name="phone" size={20} color={COLORS.primary} />
          <Text style={styles.contactLabel}>{translations.phone}</Text>
          <Text style={styles.contactValue}>{contactData.phone}</Text>
        </View>

        {contactData.email && (
          <View style={styles.contactRow}>
            <Feather name="mail" size={20} color={COLORS.primary} />
            <Text style={styles.contactLabel}>{translations.email}</Text>
            <Text style={styles.contactValue}>{contactData.email}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
  },
  revealedContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 8,
  },
  blurredContent: {
    padding: 16,
    backgroundColor: "#F5F7FA",
  },
  revealedContent: {
    padding: 16,
    backgroundColor: "#F5F7FA",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    minWidth: 60,
  },
  contactValue: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  hiddenText: {
    fontSize: 14,
    color: "#A0AEC0",
    marginLeft: 12,
  },
  revealButton: {
    borderRadius: 0,
    overflow: "hidden",
  },
  revealGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  revealText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ContactInfo;
