import { StyleSheet } from "react-native";

// Create a helper function to handle RTL-aware styles
const createRTLAwareStyles = (isRTL) => (COLORS) => {
  // Define direction properties based on RTL state
  const startPadding = isRTL ? "paddingRight" : "paddingLeft";
  const endPadding = isRTL ? "paddingLeft" : "paddingRight";
  const startMargin = isRTL ? "marginRight" : "marginLeft";
  const endMargin = isRTL ? "marginLeft" : "marginRight";
  const positionStart = isRTL ? "right" : "left";
  const positionEnd = isRTL ? "left" : "right";

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#F5F7FA",
    },
    header: {
      backgroundColor: COLORS.primary,
      paddingVertical: 35,
      paddingTop: 55,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      marginBottom: 12,
    },
    headerContent: {
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center",
      justifyContent: "center",
    },
    headerIcon: {
      [startMargin]: 0,
      [endMargin]: 10,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      textAlign: "center",
      letterSpacing: 0.5,
    },
    headerSubtitle: {
      fontSize: 14,
      color: "rgba(255, 255, 255, 0.8)",
      textAlign: "center",
      marginTop: 4,
    },
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F7FA",
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: "#555",
    },
    bottomSpacing: {
      height: 40,
    },
    toggleSection: {
      marginBottom: 16,
    },
    toggleHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    toggleLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      textAlign: isRTL ? "right" : "left",
    },
    clearButton: {
      backgroundColor: "rgba(74, 111, 161, 0.1)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    clearButtonText: {
      color: COLORS.primary,
      fontSize: 12,
      fontWeight: "500",
    },
    toggleContainer: {
      flexDirection: isRTL ? "row-reverse" : "row",
    },
    toggleButton: {
      flex: 1,
      height: 46,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F7FA",
      borderWidth: 1,
      borderColor: "#DDE1E6",
    },
    toggleButtonActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    toggleText: {
      fontSize: 16,
      color: "#666",
    },
    toggleTextActive: {
      color: "#FFFFFF",
      fontWeight: "500",
    },
    addButton: {
      height: 48,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F7FA",
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: "#A1A1A1",
      borderRadius: 8,
    },
    addButtonText: {
      color: COLORS.primary,
      fontSize: 16,
    },
    petsSection: {
      marginBottom: 16,
    },
    petsHeader: {
      flexDirection: isRTL ? "row-reverse" : "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    petsLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: "#333",
      textAlign: isRTL ? "right" : "left",
    },
    petChip: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#DDE1E6",
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      [endMargin]: 8,
      marginBottom: 8,
    },
    selectedPetChip: {
      backgroundColor: "#E7EFF8",
      borderColor: COLORS.primary,
    },
    petChipText: {
      fontSize: 14,
      color: "#555",
    },
    selectedPetChipText: {
      color: COLORS.primary,
      fontWeight: "500",
    },
  });
};

export default createRTLAwareStyles;
