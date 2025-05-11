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
    // No need to change this position as it's just decorative
  },
  decorationHeart: {
    transform: [{ rotate: "15deg" }],
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    // Removed alignItems to use dynamic RTL-aware styles
  },
  logoContainer: {
    marginBottom: 40,
    // Removed alignItems to use dynamic RTL-aware styles
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#9e086c",
    marginBottom: 8,
    // Removed textAlign to use dynamic RTL-aware styles
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    // Removed textAlign to use dynamic RTL-aware styles
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
    // Removed alignItems to use dynamic RTL-aware styles
  },
  forgotPassword: {
    marginBottom: 24,
    // Removed alignSelf to use dynamic RTL-aware styles
  },
  forgotPasswordText: {
    color: "#9e086c",
    fontSize: 14,
    // Will add textAlign dynamically
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
    // Will set flexDirection dynamically
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
    // Will set flexDirection dynamically
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
    // Will set flexDirection dynamically
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    // Will set margins dynamically
  },
  registerLink: {
    marginTop: 24,
    // Will set alignItems dynamically
  },
  registerLinkText: {
    fontSize: 16,
    color: "#666",
    // Will set textAlign dynamically
  },
  registerLinkBold: {
    color: "#9e086c",
    fontWeight: "600",
  },
});
