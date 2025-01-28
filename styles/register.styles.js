import { StyleSheet, Platform } from "react-native";

export const registerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  welcomeContainer: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 60 : 40,
    marginBottom: 20,
  },
  welcomeEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B65165",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  stepsContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepDot: {
    backgroundColor: "#B65165",
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: "#E5E5EA",
    marginHorizontal: 4,
  },
  activeStepLine: {
    backgroundColor: "#B65165",
  },
  stepText: {
    color: "#666",
    fontSize: 14,
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
    marginBottom: 20,
  },
  nextButton: {
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    flexDirection: "row",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B65165",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  registerButton: {
    flex: 2,
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButtonText: {
    color: "#B65165",
    fontSize: 18,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 24,
    alignItems: "center",
  },
  loginLinkText: {
    color: "#B65165",
    fontSize: 16,
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
});
