import { StyleSheet, Platform, Dimensions, I18nManager } from "react-native";

const { width, height } = Dimensions.get("window");

const scale = Math.min(width, height) / 375;
const rs = (size) => size * scale;

export const createRegisterStyles = (isRTL = I18nManager.isRTL) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: rs(24),
      paddingBottom: rs(40),
    },
    welcomeContainer: {
      alignItems: "center",
      marginTop: Platform.OS === "ios" ? rs(60) : rs(40),
      marginBottom: rs(20),
    },
    welcomeEmoji: {
      fontSize: rs(40),
      marginBottom: rs(16),
    },
    title: {
      fontSize: rs(28),
      fontWeight: "bold",
      color: "#9e086c",
      marginBottom: rs(8),
      textAlign: "center",
    },
    subtitle: {
      fontSize: rs(16),
      color: "#666",
      textAlign: "center",
    },
    stepsContainer: {
      alignItems: "center",
      marginBottom: rs(24),
    },
    stepIndicator: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      marginBottom: rs(8),
    },
    stepDot: {
      width: rs(24),
      height: rs(24),
      borderRadius: rs(12),
      backgroundColor: "#E5E5EA",
      justifyContent: "center",
      alignItems: "center",
    },
    activeStepDot: {
      backgroundColor: "#9e086c",
    },
    stepLine: {
      width: rs(60),
      height: rs(2),
      backgroundColor: "#E5E5EA",
      marginHorizontal: rs(4),
    },
    activeStepLine: {
      backgroundColor: "#9e086c",
    },
    stepText: {
      color: "#666",
      fontSize: rs(14),
    },
    formContainer: {
      backgroundColor: "#fff",
      borderRadius: rs(16),
      padding: rs(20),
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: rs(2),
      },
      shadowOpacity: 0.1,
      shadowRadius: rs(3.84),
      elevation: 5,
      marginBottom: rs(20),
    },
    nextButton: {
      flexDirection: isRTL ? "row-reverse" : "row",
      height: rs(56),
      borderRadius: rs(28),
      backgroundColor: "#9e086c",
      justifyContent: "center",
      alignItems: "center",
      gap: rs(12),
      marginTop: rs(20),
    },
    buttonGroup: {
      flexDirection: isRTL ? "row-reverse" : "row",
      gap: rs(12),
      marginTop: rs(20),
    },
    backButton: {
      flex: 1,
      flexDirection: isRTL ? "row-reverse" : "row",
      height: rs(56),
      borderRadius: rs(28),
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#9e086c",
      justifyContent: "center",
      alignItems: "center",
      gap: rs(12),
    },
    registerButton: {
      flex: 2,
      flexDirection: isRTL ? "row-reverse" : "row",
      height: rs(56),
      borderRadius: rs(28),
      backgroundColor: "#9e086c",
      justifyContent: "center",
      alignItems: "center",
      gap: rs(12),
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      color: "#fff",
      fontSize: rs(18),
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    backButtonText: {
      color: "#9e086c",
      fontSize: rs(18),
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    loginLink: {
      marginTop: rs(24),
      alignItems: "center",
    },
    loginLinkText: {
      color: "#9e086c",
      fontSize: rs(16),
      textAlign: "center",
    },
    errorContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      backgroundColor: "#FF3B3010",
      padding: rs(12),
      borderRadius: rs(8),
      marginBottom: rs(16),
    },
    errorText: {
      color: "#FF3B30",
      marginLeft: isRTL ? 0 : rs(8),
      marginRight: isRTL ? rs(8) : 0,
      fontSize: rs(14),
      textAlign: isRTL ? "right" : "left",
    },
    // Additional form styles
    inputContainer: {
      marginBottom: rs(16),
    },
    inputLabel: {
      fontSize: rs(14),
      color: "#333",
      marginBottom: rs(8),
      textAlign: isRTL ? "right" : "left",
    },
    input: {
      height: rs(48),
      borderWidth: 1,
      borderColor: "#E5E5EA",
      borderRadius: rs(8),
      paddingHorizontal: rs(12),
      fontSize: rs(16),
      color: "#333",
      textAlign: isRTL ? "right" : "left",
      writingDirection: isRTL ? "rtl" : "ltr",
    },
    inputError: {
      borderColor: "#FF3B30",
    },
    inputErrorText: {
      color: "#FF3B30",
      fontSize: rs(12),
      marginTop: rs(4),
      textAlign: isRTL ? "right" : "left",
    },
    // Responsive adjustments for smaller screens
    ...Platform.select({
      ios: {
        scrollContent: {
          paddingBottom: height < 700 ? rs(20) : rs(40),
        },
        welcomeContainer: {
          marginTop: height < 700 ? rs(40) : rs(60),
          marginBottom: height < 700 ? rs(10) : rs(20),
        },
      },
      android: {
        scrollContent: {
          paddingBottom: height < 700 ? rs(20) : rs(40),
        },
        welcomeContainer: {
          marginTop: height < 700 ? rs(20) : rs(40),
          marginBottom: height < 700 ? rs(10) : rs(20),
        },
      },
    }),
  });
};

export const registerStyles = createRegisterStyles();
