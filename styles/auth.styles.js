import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topDecoration: {
    position: "absolute",
    top: 40,
    right: 40,
  },
  decorationHeart: {
    transform: [{ rotate: "15deg" }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#9e086c",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  forgotPassword: {
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#9e086c",
    fontSize: 14,
  },
  loginButton: {
    height: 56,
    padding: 15,
    borderRadius: 18,
    backgroundColor: "#9e086c",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  biometricButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#9e086c",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
    width: "100%",
  },
  biometricButtonText: {
    color: "#9e086c",
    fontSize: 18,
    fontWeight: "600",
  },
  errorContainer: {
    alignItems: "center",
    backgroundColor: "#FF3B3010",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
  },
  registerLink: {
    marginTop: 24,
  },
  registerLinkText: {
    fontSize: 16,
    color: "#666",
  },
  registerLinkBold: {
    color: "#9e086c",
    fontWeight: "600",
  },
  languageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9e086c",
  },
});
export const getRtlStyles = (isRTL) =>
  StyleSheet.create({
    content: {
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    logoContainer: {
      alignItems: isRTL ? "flex-end" : "flex-start",
    },
    textAlign: {
      textAlign: isRTL ? "right" : "left",
    },
    languageToggle: {
      position: "absolute",
      top: 70,
      ...(isRTL ? { left: 20 } : { right: 20 }),
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      zIndex: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    registerLink: {
      alignSelf: isRTL ? "flex-end" : "flex-start",
    },
  });
