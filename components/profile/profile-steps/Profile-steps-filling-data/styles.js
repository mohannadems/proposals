import { StyleSheet, Platform } from "react-native";
import { COLORS } from "../../../../constants/colors";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  cardContent: {
    padding: 20,
    gap: 16,
  },
  dropdownAnimated: {
    transform: [{ scale: 1 }],
    borderRadius: 12,
    backgroundColor: COLORS.grayLight,
  },
  enhancedTextInput: {
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(65, 105, 225, 0.1)",
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  headerEmoji: {
    fontSize: 20,
    marginLeft: 4,
  },
  cardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
