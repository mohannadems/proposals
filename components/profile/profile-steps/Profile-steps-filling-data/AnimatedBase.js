import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import Reanimated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  Layout,
} from "react-native-reanimated";
import { COLORS } from "../../../../constants/colors";

// Base animation wrapper component
export const LayoutAnimatedView = ({ children, style, entering, ...props }) => {
  return (
    <Reanimated.View
      entering={entering}
      layout={Layout.springify()}
      style={style}
      {...props}
    >
      {children}
    </Reanimated.View>
  );
};

// Card component with proper animation
export const AnimatedCard = ({ children, delay = 0 }) => {
  return (
    <LayoutAnimatedView
      entering={FadeInUp.delay(delay).duration(600)}
      style={styles.card}
    >
      {children}
    </LayoutAnimatedView>
  );
};

// Section Header component
export const SectionHeader = ({ title, subtitle, emoji }) => {
  return (
    <LayoutAnimatedView
      entering={FadeInDown.duration(800).springify()}
      style={styles.sectionHeader}
    >
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </LayoutAnimatedView>
  );
};

// Toggle Button Component
export const ToggleButton = ({ options, value, onChange, label }) => {
  return (
    <LayoutAnimatedView
      entering={FadeInUp.duration(600)}
      style={styles.toggleSection}
    >
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.toggleOption,
              value === option.value && styles.toggleOptionSelected,
            ]}
            onPress={() => onChange(option.value)}
          >
            <View style={styles.toggleOptionContent}>
              <View style={styles.toggleOptionIcon}>{option.icon}</View>
              <Text
                style={[
                  styles.toggleText,
                  value === option.value && styles.toggleTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </LayoutAnimatedView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  sectionHeader: {
    marginVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  sectionEmoji: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.grayDark,
    textAlign: "center",
    lineHeight: 24,
    marginHorizontal: 20,
  },
  toggleSection: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: 15,
  },
  toggleOption: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  toggleOptionSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  toggleOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  toggleTextSelected: {
    color: COLORS.white,
  },
  toggleOptionIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginRight: 5,
  },
});
