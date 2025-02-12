// TermsModal.js
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from "react-native";

export const TermsModal = ({ visible, onAccept, onDecline }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const handleAccept = async () => {
    try {
      setIsLoading(true);

      // Animate loading overlay
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Perform your actual async operation here
      // For example:
      await onAccept();

      // If operation succeeds, loading will be handled in the parent component
    } catch (error) {
      // Handle any errors
      console.error("Error accepting terms:", error);

      // Reset loading state
      setIsLoading(false);
      fadeAnim.setValue(0);
    }
  };

  const LoadingOverlay = () => (
    <Animated.View
      style={[
        styles.loadingOverlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.loadingContent}>
        <ActivityIndicator size="large" color="#B65165" />
        <Text style={styles.loadingText}>Processing...</Text>
      </View>
    </Animated.View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onDecline}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.header}>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <View style={styles.divider} />
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.contentContainer}>
                <Text style={styles.welcomeText}>
                  Welcome to our dating app! Before proceeding, please read and
                  accept our terms and conditions:
                </Text>

                {sections.map((section, index) => (
                  <View key={index} style={styles.section}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {section.points.map((point, pointIndex) => (
                      <View key={pointIndex} style={styles.bulletPoint}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.pointText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                ))}

                <Text style={styles.agreementText}>
                  By accepting these terms, you acknowledge that you have read,
                  understood, and agree to be bound by all terms and conditions.
                </Text>
              </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.declineButton]}
                onPress={onDecline}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, styles.declineText]}>
                  Decline
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={handleAccept}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? "Processing..." : "Accept"}
                </Text>
              </TouchableOpacity>
            </View>
            {isLoading && <LoadingOverlay />}
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const sections = [
  {
    title: "1. Age Requirement",
    points: [
      "You must be at least 18 years old to use this service.",
      "You agree to provide accurate information about your age.",
    ],
  },
  {
    title: "2. Profile Content",
    points: [
      "You agree to provide accurate and truthful information in your profile.",
      "You will not impersonate others or create false identities.",
      "You will not post explicit or inappropriate content.",
    ],
  },
  {
    title: "3. User Conduct",
    points: [
      "You will treat other users with respect and courtesy.",
      "You will not harass, stalk, or intimidate other users.",
      "You will not share other users personal information without consent.",
    ],
  },
  {
    title: "4. Safety Guidelines",
    points: [
      "We recommend meeting in public places for first dates.",
      "Do not share financial information with other users.",
      "Report suspicious or abusive behavior immediately.",
    ],
  },
  {
    title: "5. Privacy",
    points: [
      "We collect and process your data as described in our Privacy Policy.",
      "Your profile information may be visible to other users.",
      "You control your privacy settings and visible information.",
    ],
  },
  {
    title: "6. Account Security",
    points: [
      "You are responsible for maintaining your account security.",
      "Report any unauthorized access immediately.",
      "Do not share your login credentials with others.",
    ],
  },
  {
    title: "7. Termination",
    points: [
      "We reserve the right to suspend or terminate accounts that violate these terms.",
      "You can delete your account at any time.",
    ],
  },
  {
    title: "8. Updates to Terms",
    points: [
      "We may update these terms periodically.",
      "Continued use after changes constitutes acceptance.",
    ],
  },
];

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: Dimensions.get("window").width * 0.92,
    height: Dimensions.get("window").height * 0.85,
    backgroundColor: "white",
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    padding: 20,
    backgroundColor: "#B65165",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  divider: {
    height: 3,
    width: 180,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#B65165",
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#B65165",
    marginRight: 8,
    marginTop: -2,
  },
  pointText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  agreementText: {
    fontSize: 15,
    color: "#666",
    fontStyle: "italic",
    marginTop: 10,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  button: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    marginHorizontal: 6,
  },
  acceptButton: {
    backgroundColor: "#B65165",
  },
  declineButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#B65165",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  declineText: {
    color: "#B65165",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#B65165",
    fontWeight: "600",
  },
});
