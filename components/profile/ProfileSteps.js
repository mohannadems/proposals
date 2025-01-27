import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import BasicInfoStep from "./steps/BasicInfoStep";
import LocationStep from "./steps/LocationStep";
import EducationWorkStep from "./steps/EducationWorkStep";
import PhysicalAttributesStep from "./steps/PhysicalAttributesStep";
import LifestyleStep from "./steps/LifestyleStep";
import HabitsStep from "./steps/HabitsStep";
import PreferencesStep from "./steps/PreferencesStep";
import ProfileCreationStepper from "./ProfileCreationStepper";

export default function ProfileSteps() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state) => state.profile.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <LocationStep />;
      case 2:
        return <EducationWorkStep />;
      case 3:
        return <PhysicalAttributesStep />;
      case 4:
        return <LifestyleStep />;
      case 5:
        return <HabitsStep />;
      case 6:
        return <PreferencesStep />;
      default:
        return <BasicInfoStep />;
    }
  };

  return (
    <View style={styles.container}>
      <ProfileCreationStepper />
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
