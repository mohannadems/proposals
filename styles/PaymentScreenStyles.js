import { StyleSheet } from "react-native";
import COLORS from "../constants/colors";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRTL: {
    flexDirection: "row-reverse",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  textRTL: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  cardsContainer: {
    gap: 16,
  },
  featuresList: {
    marginTop: 32,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  allPlansTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureRowRTL: {
    flexDirection: "row-reverse",
  },
  featureText: {
    fontSize: 16,
    color: COLORS.text,
  },
  featureTextLTR: {
    marginLeft: 12,
  },
  featureTextRTL: {
    marginRight: 12,
    textAlign: "right",
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  subscribeButton: {
    overflow: "hidden",
    borderRadius: 12,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
  },
});
