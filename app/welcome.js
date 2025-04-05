import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { LanguageContext } from "../contexts/LanguageContext";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { isRTL, t } = useContext(LanguageContext);

  const styles = createStyles(isRTL);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#9e086c", "#9e086c"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/logo2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <FontAwesome
            name="heart"
            size={40}
            color="#9e086c"
            style={styles.heartIcon}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            {t ? t("welcome.title") : "Find Your Perfect Match"}
          </Text>
          <Text style={styles.subtitle}>
            {t
              ? t("welcome.subtitle")
              : "Begin your journey to discover meaningful connections and lasting love"}
          </Text>

          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <FontAwesome name="shield" size={24} color="#9e086c" />
              <Text style={styles.featureText}>
                {t ? t("welcome.features.safe") : "Safe & Secure"}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="check-circle" size={24} color="#9e086c" />
              <Text style={styles.featureText}>
                {t ? t("welcome.features.verified") : "Verified Profiles"}
              </Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="users" size={24} color="#9e086c" />
              <Text style={styles.featureText}>
                {t ? t("welcome.features.quality") : "Quality Matches"}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push("/(auth)/login")}
            >
              <MaterialIcons name="favorite" size={24} color="#fff" />
              <Text style={styles.buttonText}>
                {t ? t("auth.login") : "Login"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push("/(auth)/register")}
            >
              <MaterialIcons name="person-add" size={24} color="#9e086c" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                {t ? t("auth.create_account") : "Create New Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const createStyles = (isRTL) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      paddingHorizontal: 24,
    },
    logoContainer: {
      alignItems: "center",
      marginTop: height * 0.1,
      marginBottom: height * 0.05,
    },
    logo: {
      width: width * 0.4,
      height: width * 0.4,
    },
    heartIcon: {
      position: "absolute",
      bottom: -20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    contentContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#9e086c",
      textAlign: "center",
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginBottom: 40,
      lineHeight: 24,
    },
    featureContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-around",
      width: "100%",
      marginBottom: 40,
    },
    featureItem: {
      alignItems: "center",
    },
    featureText: {
      marginTop: 8,
      color: "#9e086c",
      fontSize: 14,
      textAlign: "center",
    },
    buttonContainer: {
      width: "100%",
      gap: 16,
    },
    button: {
      flexDirection: isRTL ? "row-reverse" : "row",
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
    },
    primaryButton: {
      backgroundColor: "#9e086c",
    },
    secondaryButton: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#9e086c",
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "600",
      color: "#fff",
      textAlign: isRTL ? "right" : "left",
    },
    secondaryButtonText: {
      color: "#9e086c",
    },
  });
};
