import { StyleSheet, Dimensions } from "react-native";
import COLORS from "../constants/colors";
import { I18nManager } from "react-native";
const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 320,
    width: "100%",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  heroContent: {
    marginTop: 60,
    alignItems: I18nManager.isRTL ? "flex-end" : "flex-start",
  },
  heroTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: COLORS.white,
    lineHeight: 56,
    marginBottom: 16,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 25,
  },
  heroButton: {
    width: 180,
    height: 50,
    overflow: "hidden",
    borderRadius: 28,
    backgroundColor: COLORS.white,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 12,
    shadowColor: COLORS.text,
  },
  buttonBlur: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  statsContainer: {
    marginTop: -18,
    marginHorizontal: 20,
    marginBottom: 20,
    zIndex: 100,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderColor: COLORS.primary,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 12,
  },
  statsCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 24,
    borderRadius: 20,
    overflow: "hidden",
    background: "transparent",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    padding: 15,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 24,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -8,
    alignItems: "flex-start", // Ensure cards align at the top
  },
  featureCardContainer: {
    width: (width - 56) / 2,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 12,
    // Height will be set dynamically in the component
  },
  featureGradient: {
    padding: 20,
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.6,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  testimonialScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  testimonialCard: {
    width: width - 80,
    marginRight: 16,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  testimonialContentView: {
    alignItems: "center",
    padding: 20,
  },
  testimonialImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 35,
    overflow: "hidden",
    marginBottom: 10,
  },
  testimonialImageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  testimonialText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 8,
  },
  testimonialName: {
    fontWeight: "bold",
    textAlign: "center",
  },
  testimonialLocation: {
    color: "gray",
    textAlign: "center",
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
  },
  languageButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  languageButton: {
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
});
