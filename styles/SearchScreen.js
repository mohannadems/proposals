import { StyleSheet, Dimensions, Platform, I18nManager } from "react-native";
import COLORS from "../constants/colors";

const { width } = Dimensions.get("window");
const TILE_SIZE = (width - 48) / 2;

const createSearchStyles = (isRTL = I18nManager.isRTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "COLORS.background",
      padding: 15,
    },
    FilterProgressTracker: {},
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
      textAlign: "center",
    },
    header: {
      paddingTop: Platform.OS === "ios" ? 100 : 50,
      paddingBottom: 30,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      backgroundColor: COLORS.primary,
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      color: COLORS.white,
      textAlign: "center",
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 18,
      color: COLORS.white,
      opacity: 0.9,
      textAlign: "center",
      marginTop: 8,
      paddingHorizontal: 20,
    },

    sectionHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    backButton: {
      padding: 6,
      transform: [{ scaleX: isRTL ? -1 : 1 }],
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
      flexDirection: isRTL ? "row-reverse" : "row",
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
      marginLeft: isRTL ? 0 : 4,
      marginRight: isRTL ? 4 : 0,
      fontWeight: "500",
    },
    errorContainer: {
      marginHorizontal: 16,
      padding: 12,
      backgroundColor: COLORS.error + "20",
      borderRadius: 8,
      marginBottom: 16,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    errorText: {
      color: COLORS.error,
      fontSize: 14,
      fontWeight: "500",
      flex: 1,
      textAlign: isRTL ? "right" : "left",
    },
    formContainer: {
      padding: 16,
    },
    sectionCard: {
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: 15,
      marginBottom: 15,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
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
      textAlign: "center",
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: COLORS.text,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
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
      flexDirection: isRTL ? "row-reverse" : "row",
      flexWrap: "wrap",
    },
    agePresetButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
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
      flexDirection: isRTL ? "row-reverse" : "row",
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
      flexDirection: isRTL ? "row-reverse" : "row",
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
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    disabledSearchButton: {
      backgroundColor: COLORS.primary + "80",
    },
    searchIcon: {
      marginRight: isRTL ? 0 : 8,
      marginLeft: isRTL ? 8 : 0,
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
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
    },
    tipIcon: {
      marginRight: isRTL ? 0 : 12,
      marginLeft: isRTL ? 12 : 0,
    },
    tipText: {
      flex: 1,
      fontSize: 14,
      color: COLORS.text,
      lineHeight: 20,
      textAlign: isRTL ? "right" : "left",
    },
    savedPreferencesCard: {
      backgroundColor: COLORS.lightPrimary,
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 16,
      marginBottom: 30,
      borderLeftWidth: isRTL ? 0 : 4,
      borderRightWidth: isRTL ? 4 : 0,
      borderLeftColor: COLORS.primary,
      borderRightColor: COLORS.primary,
    },
    savedPreferencesTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: COLORS.primary,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    savedPreferencesText: {
      fontSize: 14,
      color: COLORS.text,
      marginBottom: 8,
      textAlign: isRTL ? "right" : "left",
    },
    sectionTitle: {
      fontSize: 20, // Larger size for better hierarchy
      fontWeight: "700",
      color: COLORS.text,
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      paddingBottom: 12,
    },
    sectionSubtitle: {
      fontSize: 16,
      color: COLORS.primary,
      marginBottom: 16,
      textAlign: isRTL ? "right" : "left",
    },

    // Enhanced scrolling experience styles
    scrollContent: {
      paddingTop: 20,
      paddingBottom: 100, // Extra padding at bottom
      paddingHorizontal: 0, // Removed horizontal padding (handled by cards)
    },

    // Improved filter progress tracker
    progressTrackerContainer: {
      backgroundColor: COLORS.white,
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 20,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      zIndex: 10,
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: COLORS.background,
      borderRadius: 4,
      marginVertical: 10,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: COLORS.primary,
      borderRadius: 4,
    },
  });

export default createSearchStyles;
export { createSearchStyles };
