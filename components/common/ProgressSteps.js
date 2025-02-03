// app/components/common/ProgressSteps.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

const ProgressSteps = ({ steps, currentStep, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` },
          ]}
        />
      </View>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View
            key={step.id}
            style={[
              styles.step,
              currentStep > index && styles.stepCompleted,
              currentStep === index + 1 && styles.stepCurrent,
            ]}
          >
            <View
              style={[
                styles.stepNumber,
                currentStep > index && styles.stepNumberCompleted,
              ]}
            >
              <Text
                style={[
                  styles.stepNumberText,
                  currentStep > index && styles.stepNumberTextCompleted,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepTitle,
                currentStep === index + 1 && styles.stepTitleActive,
              ]}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    transition: "width 0.3s ease-in-out",
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  step: {
    flex: 1,
    alignItems: "center",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  stepNumberCompleted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  stepNumberTextCompleted: {
    color: COLORS.white,
  },
  stepTitle: {
    fontSize: 12,
    color: COLORS.grayDark,
    textAlign: "center",
  },
  stepTitleActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  stepCurrent: {
    transform: [{ scale: 1.05 }],
  },
});

export default ProgressSteps;
