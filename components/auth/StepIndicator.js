import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { registerStyles } from "../../styles/register.styles";
import { REGISTER_MESSAGES } from "../../constants/register";

export const StepIndicator = ({ currentStep }) => {
  return (
    <View style={registerStyles.stepsContainer}>
      <View style={registerStyles.stepIndicator}>
        <View
          style={[
            registerStyles.stepDot,
            currentStep >= 1 && registerStyles.activeStepDot,
          ]}
        >
          {currentStep > 1 && (
            <MaterialIcons name="check" size={12} color="#fff" />
          )}
        </View>
        <View
          style={[
            registerStyles.stepLine,
            currentStep >= 2 && registerStyles.activeStepLine,
          ]}
        />
        <View
          style={[
            registerStyles.stepDot,
            currentStep >= 2 && registerStyles.activeStepDot,
          ]}
        />
      </View>
      <Text style={registerStyles.stepText}>
        {REGISTER_MESSAGES.STEP_COUNT.replace("{step}", currentStep)}
      </Text>
    </View>
  );
};
