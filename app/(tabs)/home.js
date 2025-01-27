// app/(tabs)/home.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function HomeScreen() {
  const { user, isProfileComplete } = useSelector((state) => state.auth);

  const getStartedSteps = [
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Tell us about yourself so we can find your perfect match.",
      icon: "person",
      action: () => router.push("/(profile)/create"),
      completed: isProfileComplete,
    },
    {
      id: 2,
      title: "Set Partner Preferences",
      description: "Define the qualities you are looking for in a partner.",
      icon: "favorite",
      action: () => router.push("/(profile)/preferences"),
      completed: false,
    },
    {
      id: 3,
      title: "Verify Your Account",
      description: "Add optional verification documents to increase trust.",
      icon: "verified",
      action: () => router.push("/(profile)/verification"),
      completed: false,
    },
    {
      id: 4,
      title: "Start Matching",
      description:
        "Browse potential matches and connect with compatible profiles.",
      icon: "people",
      action: () => router.push("/(tabs)/matches"),
      completed: false,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to Proposals</Text>
        <Text style={styles.subtitle}>
          Let us help you find your perfect match
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Getting Started</Text>

        {getStartedSteps.map((step) => (
          <TouchableOpacity
            key={step.id}
            style={[styles.stepCard, step.completed && styles.completedCard]}
            onPress={step.action}
          >
            <View style={styles.stepIconContainer}>
              <MaterialIcons
                name={step.icon}
                size={24}
                color={step.completed ? COLORS.success : COLORS.primary}
              />
              {step.completed && (
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color={COLORS.success}
                  style={styles.checkIcon}
                />
              )}
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.text} />
          </TouchableOpacity>
        ))}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Why Complete Your Profile?</Text>
          <Text style={styles.infoText}>
            A complete profile increases your chances of finding the right
            match. We use your information to suggest compatible partners based
            on shared values, interests, and life goals.
          </Text>
        </View>

        <View style={styles.subscriptionCard}>
          <MaterialIcons name="star" size={24} color={COLORS.primary} />
          <Text style={styles.subscriptionTitle}>Upgrade to Premium</Text>
          <Text style={styles.subscriptionText}>
            Get unlimited matches, priority profile visibility, and advanced
            filtering options.
          </Text>
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => router.push("/(tabs)/subscription")}
          >
            <Text style={styles.upgradeButtonText}>View Plans</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text + "80",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedCard: {
    backgroundColor: COLORS.success + "10",
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: COLORS.text + "80",
  },
  checkIcon: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: COLORS.white,
    borderRadius: 8,
  },
  infoSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.text + "80",
    lineHeight: 20,
  },
  subscriptionCard: {
    padding: 20,
    backgroundColor: COLORS.primary + "10",
    borderRadius: 12,
    alignItems: "center",
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subscriptionText: {
    fontSize: 14,
    color: COLORS.text + "80",
    textAlign: "center",
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
