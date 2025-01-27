import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setStep } from "../../../store/slices/profile.slice";
import SelectInput from "../../forms/SelectInput";
import AuthInput from "../../forms/AuthInput";
import Button from "../../common/Button";
import { COLORS } from "../../../constants/colors";

export default function LocationStep() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.profile);

  const handleNext = () => {
    dispatch(setStep(2));
  };

  const handleBack = () => {
    dispatch(setStep(0));
  };

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SelectInput
          label="Country of Residence"
          value={data.countryOfResidence}
          options={[
            { value: "jordan", label: "Jordan" },
            { value: "other", label: "Other" },
          ]}
          onChange={(value) => handleChange("countryOfResidence", value)}
        />

        <SelectInput
          label="City"
          value={data.cityOfResidence}
          options={[
            { value: "amman", label: "Amman" },
            { value: "zarqa", label: "Zarqa" },
            { value: "irbid", label: "Irbid" },
          ]}
          onChange={(value) => handleChange("cityOfResidence", value)}
        />

        <AuthInput
          label="Area"
          value={data.area}
          onChangeText={(value) => handleChange("area", value)}
          placeholder="Enter your area"
        />

        <View style={styles.buttonContainer}>
          <Button
            title="Back"
            onPress={handleBack}
            style={styles.backButton}
            type="secondary"
          />
          <Button title="Next" onPress={handleNext} style={styles.nextButton} />
        </View>
      </View>
    </ScrollView>
  );
}

// Create similar files for other steps:
// - components/profile/steps/EducationWorkStep.js
// - components/profile/steps/PhysicalAttributesStep.js
// - components/profile/steps/LifestyleStep.js
// - components/profile/steps/HabitsStep.js
// - components/profile/steps/PreferencesStep.js

// Common styles used across all steps
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
  },
});
