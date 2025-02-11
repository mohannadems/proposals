import { StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
const { width, height } = Dimensions.get("window");
import { Dimensions } from "react-native";

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%", // Ensure it covers the whole screen
    backgroundColor: "#F4F7FA",
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  stepIndicator: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  stepContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    backgroundColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  stepHeaderText: {
    marginLeft: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2C3E50",
  },
  stepDescription: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  buttonTextPrimary: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextSecondary: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  // Error Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  blurContainer: {
    width: width * 0.85,
    borderRadius: 16,
    overflow: "hidden",
  },
  errorModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  errorModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2C3E50",
    marginTop: 12,
    marginBottom: 8,
  },
  errorModalSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    marginBottom: 12,
  },
  errorScrollView: {
    maxHeight: height * 0.2,
    width: "100%",
    marginBottom: 16,
  },
  errorScrollContent: {
    paddingVertical: 8,
  },
  errorItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  errorItemText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#2C3E50",
    flex: 1,
  },
  errorModalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  errorModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text,
  },
});
