import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setStep } from "../../../store/slices/profile.slice";
import SelectInput from "../../forms/SelectInput";
import Button from "../../common/Button";
import { COLORS } from "../../../constants/colors";

export default function HabitsStep() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.profile);

  const handleNext = () => {
    dispatch(setStep(6));
  };

  const handleBack = () => {
    dispatch(setStep(4));
  };

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SelectInput
          label="Smoking Habits"
          value={data.smoking}
          options={[
            { value: "no", label: "Non-smoker" },
            { value: "cigarettes", label: "Cigarettes" },
            { value: "shisha", label: "Shisha" },
            { value: "both", label: "Both" },
          ]}
          onChange={(value) => handleChange("smoking", value)}
        />

        <SelectInput
          label="Exercise Habits"
          value={data.exerciseHabits}
          options={[
            { value: "never", label: "Never" },
            { value: "sometimes", label: "Sometimes" },
            { value: "regular", label: "Regular" },
            { value: "daily", label: "Daily" },
          ]}
          onChange={(value) => handleChange("exerciseHabits", value)}
        />

        <SelectInput
          label="Social Media Usage"
          value={data.socialMediaUsage}
          options={[
            { value: "none", label: "None" },
            { value: "minimal", label: "Minimal" },
            { value: "moderate", label: "Moderate" },
            { value: "active", label: "Active" },
          ]}
          onChange={(value) => handleChange("socialMediaUsage", value)}
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
});
