import React from "react";
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

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B65165", "#AB0CFB"]}
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
            color="#B65165"
            style={styles.heartIcon}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>Find Your Perfect Match</Text>
          <Text style={styles.subtitle}>
            Begin your journey to discover meaningful connections and lasting
            love
          </Text>

          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <FontAwesome name="shield" size={24} color="#B65165" />
              <Text style={styles.featureText}>Safe & Secure</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="check-circle" size={24} color="#B65165" />
              <Text style={styles.featureText}>Verified Profiles</Text>
            </View>
            <View style={styles.featureItem}>
              <FontAwesome name="users" size={24} color="#B65165" />
              <Text style={styles.featureText}>Quality Matches</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push("/(auth)/login")}
            >
              <MaterialIcons name="favorite" size={24} color="#fff" />
              <Text style={styles.buttonText}>Find Love Today</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push("/(auth)/register")}
            >
              <MaterialIcons name="person-add" size={24} color="#B65165" />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Create New Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: "#B65165",
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
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    marginTop: 8,
    color: "#B65165",
    fontSize: 14,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  button: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#B65165",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B65165",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButtonText: {
    color: "#B65165",
  },
});
