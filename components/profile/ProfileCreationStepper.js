import React from "react";
import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { COLORS } from "../../constants/colors";

const steps = [
  "Basic Info",
  "Location",
  "Education & Work",
  "Physical Attributes",
  "Lifestyle",
  "Habits",
  "Preferences",
];

export default function ProfileCreationStepper() {
  const currentStep = useSelector((state) => state.profile.currentStep);

  return (
    <View style={styles.container}>
      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <View
              style={[styles.step, index <= currentStep && styles.activeStep]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  index <= currentStep && styles.activeStepNumber,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            {index < steps.length - 1 && (
              <View
                style={[
                  styles.connector,
                  index < currentStep && styles.activeConnector,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepLabel}>{steps[currentStep]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepNumber: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  activeStepNumber: {
    color: COLORS.white,
  },
  connector: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
  },
  activeConnector: {
    backgroundColor: COLORS.primary,
  },
  stepLabel: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
});
