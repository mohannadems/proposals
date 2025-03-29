import { StyleSheet, Dimensions, Platform } from "react-native";
import COLORS from "../constants/colors";
const { width } = Dimensions.get("window");
const TILE_SIZE = (width - 48) / 2;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  loadingGradient: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.white,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 90 : 40,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: "center",
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 6,
  },
  doneButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  doneButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  tilesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  completeTile: {
    borderColor: COLORS.success + "50",
    backgroundColor: COLORS.white,
  },
  tileContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tileIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  completeTileIconContainer: {
    backgroundColor: COLORS.primary,
  },
  tileTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  tileSubtitle: {
    fontSize: 12,
    color: COLORS.lightText,
    textAlign: "center",
  },
  completeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.success + "20",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  completeBadgeText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 4,
    fontWeight: "500",
  },
  errorContainer: {
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: COLORS.error + "20", // 20% opacity
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionDescription: {
    backgroundColor: COLORS.lightPrimary + "50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: 8,
  },
  ageRangeContainer: {
    marginVertical: 16,
  },
  ageRangeDisplay: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 10,
  },
  agePresets: {
    marginBottom: 16,
  },
  agePresetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeAgePreset: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  agePresetText: {
    fontSize: 14,
    color: COLORS.text,
  },
  activeAgePresetText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  toggleContainerWithLabel: {
    marginBottom: 16,
  },
  toggleLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  toggleButtons: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontWeight: "500",
    color: COLORS.lightText,
  },
  activeToggleText: {
    color: COLORS.white,
  },
  addPreferenceButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  addPreferenceText: {
    color: COLORS.primary,
    fontWeight: "500",
  },
  chipSelectorContainer: {
    marginBottom: 16,
  },
  completeSectionButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  completeSectionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  searchButtonContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabledSearchButton: {
    backgroundColor: COLORS.primary + "80", // 50% opacity
  },
  searchIcon: {
    marginRight: 8,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  viewResultsButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  viewResultsText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  resetFiltersButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  resetFiltersText: {
    color: COLORS.lightText,
    fontSize: 14,
  },
  tipsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: COLORS.lightPrimary + "40",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  savedPreferencesCard: {
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  savedPreferencesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  savedPreferencesText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
});
