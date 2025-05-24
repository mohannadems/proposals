import React, { useState, useContext } from "react";
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
  I18nManager,
} from "react-native";
import { LanguageContext } from "../../contexts/LanguageContext";

export const TermsModal = ({
  visible,
  onAccept,
  onDecline,
  isRTL: propIsRTL,
  t: propT,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const languageContext = useContext(LanguageContext);
  const isRTL =
    propIsRTL !== undefined
      ? propIsRTL
      : languageContext
      ? languageContext.isRTL
      : I18nManager.isRTL;
  const t = propT || (languageContext ? languageContext.t : null);

  const translate = (key, fallback) => {
    if (t) {
      return t(key);
    }
    return fallback;
  };

  const sections = [
    {
      title: translate("terms.age_requirement", "1. Age Requirement"),
      points: [
        translate(
          "terms.age_18",
          "You must be at least 18 years old to use this service."
        ),
        translate(
          "terms.age_accurate",
          "You agree to provide accurate information about your age."
        ),
      ],
    },
    {
      title: translate("terms.profile_content", "2. Profile Content"),
      points: [
        translate(
          "terms.profile_accurate",
          "You agree to provide accurate and truthful information in your profile."
        ),
        translate(
          "terms.no_impersonation",
          "You will not impersonate others or create false identities."
        ),
        translate(
          "terms.no_explicit",
          "You will not post explicit or inappropriate content."
        ),
      ],
    },
    {
      title: translate("terms.user_conduct", "3. User Conduct"),
      points: [
        translate(
          "terms.user_respect",
          "You will treat other users with respect and courtesy."
        ),
        translate(
          "terms.no_harassment",
          "You will not harass, stalk, or intimidate other users."
        ),
        translate(
          "terms.no_sharing",
          "You will not share other users personal information without consent."
        ),
      ],
    },
    {
      title: translate("terms.safety", "4. Safety Guidelines"),
      points: [
        translate(
          "terms.public_meeting",
          "We recommend meeting in public places for first dates."
        ),
        translate(
          "terms.no_financial",
          "Do not share financial information with other users."
        ),
        translate(
          "terms.report",
          "Report suspicious or abusive behavior immediately."
        ),
      ],
    },
    {
      title: translate("terms.privacy", "5. Privacy"),
      points: [
        translate(
          "terms.data_collection",
          "We collect and process your data as described in our Privacy Policy."
        ),
        translate(
          "terms.profile_visible",
          "Your profile information may be visible to other users."
        ),
        translate(
          "terms.privacy_control",
          "You control your privacy settings and visible information."
        ),
      ],
    },
    {
      title: translate("terms.account_security", "6. Account Security"),
      points: [
        translate(
          "terms.account_responsibility",
          "You are responsible for maintaining your account security."
        ),
        translate(
          "terms.report_unauthorized",
          "Report any unauthorized access immediately."
        ),
        translate(
          "terms.no_credential_sharing",
          "Do not share your login credentials with others."
        ),
      ],
    },
    {
      title: translate("terms.termination", "7. Termination"),
      points: [
        translate(
          "terms.termination_right",
          "We reserve the right to suspend or terminate accounts that violate these terms."
        ),
        translate(
          "terms.delete_account",
          "You can delete your account at any time."
        ),
      ],
    },
    {
      title: translate("terms.updates", "8. Updates to Terms"),
      points: [
        translate(
          "terms.periodic_updates",
          "We may update these terms periodically."
        ),
        translate(
          "terms.continued_acceptance",
          "Continued use after changes constitutes acceptance."
        ),
      ],
    },
  ];

  const handleAccept = async () => {
    try {
      setIsLoading(true);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      await onAccept();

      setIsLoading(false);
      fadeAnim.setValue(0);
    } catch (error) {
      console.error("Error accepting terms:", error);

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
        <ActivityIndicator size="large" color="#9e086c" />
        <Text style={styles.loadingText}>
          {translate("terms.processing", "Processing...")}
        </Text>
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
              <Text style={styles.modalTitle}>
                {translate("terms.title", "Terms and Conditions")}
              </Text>
              <View style={styles.divider} />
            </View>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={[
                  styles.contentContainer,
                  isRTL && { alignItems: "flex-end" },
                ]}
              >
                <Text
                  style={[styles.welcomeText, isRTL && { textAlign: "right" }]}
                >
                  {translate(
                    "terms.welcome_text",
                    "Welcome to our dating app! Before proceeding, please read and accept our terms and conditions:"
                  )}
                </Text>

                {sections.map((section, index) => (
                  <View
                    key={index}
                    style={[
                      styles.section,
                      isRTL && { alignItems: "flex-end", width: "100%" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sectionTitle,
                        isRTL && { textAlign: "right" },
                      ]}
                    >
                      {section.title}
                    </Text>
                    {section.points.map((point, pointIndex) => (
                      <View
                        key={pointIndex}
                        style={[
                          styles.bulletPoint,
                          isRTL && {
                            flexDirection: "row-reverse",
                            paddingLeft: 0,
                            paddingRight: 8,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bullet,
                            isRTL && {
                              marginRight: 0,
                              marginLeft: 8,
                            },
                          ]}
                        >
                          •
                        </Text>
                        <Text
                          style={[
                            styles.pointText,
                            isRTL && { textAlign: "right" },
                          ]}
                        >
                          {point}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}

                <Text
                  style={[
                    styles.agreementText,
                    isRTL && { textAlign: "right" },
                  ]}
                >
                  {translate(
                    "terms.agreement_text",
                    "By accepting these terms, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions."
                  )}
                </Text>
              </View>
            </ScrollView>

            <View
              style={[
                styles.buttonContainer,
                isRTL && { flexDirection: "row-reverse" },
              ]}
            >
              <TouchableOpacity
                style={[styles.button, styles.declineButton]}
                onPress={onDecline}
                disabled={isLoading}
              >
                <Text style={[styles.buttonText, styles.declineText]}>
                  {translate("terms.decline", "Decline")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={handleAccept}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading
                    ? translate("terms.processing", "Processing...")
                    : translate("terms.accept", "Accept")}
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
    backgroundColor: "#9e086c",
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
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9e086c",
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
    width: "100%",
  },
  bullet: {
    fontSize: 16,
    color: "#9e086c",
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
    backgroundColor: "#9e086c",
  },
  declineButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#9e086c",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  declineText: {
    color: "#9e086c",
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
    color: "#9e086c",
    fontWeight: "600",
  },
});
