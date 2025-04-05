import { StyleSheet, Dimensions, Platform, I18nManager } from "react-native";

const { width, height } = Dimensions.get("window");

const scale = width / 375;
const rs = (size) => size * scale;

export const createLoginStyles = (isRTL = I18nManager.isRTL) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    topDecoration: {
      position: "absolute",
      top: rs(40),
      ...(isRTL ? { left: rs(40) } : { right: rs(40) }),
    },
    decorationHeart: {
      transform: [{ rotate: "15deg" }],
    },
    content: {
      flex: 1,
      paddingHorizontal: rs(24),
      paddingTop: rs(120),
      paddingBottom: rs(120),
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: rs(40),
      width: "100%",
    },
    welcomeText: {
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
      width: "100%",
    },
    forgotPassword: {
      alignSelf: isRTL ? "flex-start" : "flex-end",
      marginBottom: rs(24),
    },
    forgotPasswordText: {
      color: "#9e086c",
      fontSize: rs(14),
      textAlign: isRTL ? "right" : "left",
    },
    loginButton: {
      flexDirection: isRTL ? "row-reverse" : "row",
      height: rs(56),
      borderRadius: rs(28),
      backgroundColor: "#9e086c",
      justifyContent: "center",
      alignItems: "center",
      gap: rs(12),
      width: rs(160),
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    loginButtonText: {
      color: "#fff",
      fontSize: rs(18),
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
    },
    biometricButton: {
      flexDirection: isRTL ? "row-reverse" : "row",
      height: rs(56),
      borderRadius: rs(28),
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#9e086c",
      justifyContent: "center",
      alignItems: "center",
      gap: rs(12),
      marginTop: rs(16),
    },
    biometricButtonText: {
      color: "#9e086c",
      fontSize: rs(18),
      fontWeight: "600",
      textAlign: isRTL ? "right" : "left",
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
    registerLink: {
      marginTop: rs(24),
      alignItems: "center",
      width: "100%",
    },
    registerLinkText: {
      fontSize: rs(16),
      color: "#666",
      textAlign: "center",
    },
    registerLinkBold: {
      color: "#9e086c",
      fontWeight: "600",
    },
  });
};

export const loginStyles = createLoginStyles();

export const addDimensionsListener = () => {
  const updateStyles = () => {};

  return {
    setup: () => Dimensions.addEventListener("change", updateStyles),
    cleanup: (subscription) => {
      if (subscription?.remove) {
        subscription.remove();
      }
    },
  };
};
