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
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B65165",
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
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#B65165",
    fontSize: 14,
  },
  loginButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
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
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  biometricButtonText: {
    color: "#B65165",
    fontSize: 18,
    fontWeight: "600",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B3010",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#FF3B30",
    marginLeft: 8,
    fontSize: 14,
  },
  registerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  registerLinkText: {
    fontSize: 16,
    color: "#666",
  },
  registerLinkBold: {
    color: "#B65165",
    fontWeight: "600",
  },
});
