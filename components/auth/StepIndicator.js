import React, { useContext } from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { registerStyles } from "../../styles/register.styles";
import { LanguageContext } from "../../contexts/LanguageContext";

export const StepIndicator = ({ currentStep, isRTL, t }) => {
  const languageContext = useContext(LanguageContext);
  const _isRTL =
    isRTL !== undefined
      ? isRTL
      : languageContext
      ? languageContext.isRTL
      : false;
  const _t = t || (languageContext ? languageContext.t : null);

  const dynamicStyles = {
    container: [
      registerStyles.stepsContainer,
      _isRTL && { alignItems: "flex-end" },
    ],
    stepIndicator: [
      registerStyles.stepIndicator,
      _isRTL && { flexDirection: "row-reverse" },
    ],
    stepText: [registerStyles.stepText, _isRTL && { textAlign: "right" }],
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.stepIndicator}>
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
      <Text style={dynamicStyles.stepText}>
        {_t
          ? _t("register.step_count").replace("{step}", currentStep)
          : `Step ${currentStep} of 2`}
      </Text>
    </View>
  );
};
