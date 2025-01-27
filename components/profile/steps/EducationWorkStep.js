import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setStep } from "../../../store/slices/profile.slice";
import SelectInput from "../../forms/SelectInput";
import AuthInput from "../../forms/AuthInput";
import Button from "../../common/Button";
import { COLORS } from "../../../constants/colors";
import {
  educationLevels,
  workSectors,
  workLevels,
  financialStatus,
} from "../../../constants/options";

export default function EducationWorkStep() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.profile);

  const handleNext = () => {
    dispatch(setStep(3));
  };

  const handleBack = () => {
    dispatch(setStep(1));
  };

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SelectInput
          label="Education Level"
          value={data.education}
          options={educationLevels}
          onChange={(value) => handleChange("education", value)}
        />

        <AuthInput
          label="Specialization"
          value={data.specialization}
          onChangeText={(value) => handleChange("specialization", value)}
          placeholder="Enter your field of study"
        />

        <SelectInput
          label="Work Sector"
          value={data.workSector}
          options={workSectors}
          onChange={(value) => handleChange("workSector", value)}
        />

        <SelectInput
          label="Work Level"
          value={data.workLevel}
          options={workLevels}
          onChange={(value) => handleChange("workLevel", value)}
        />

        <SelectInput
          label="Financial Status"
          value={data.financialStatus}
          options={financialStatus}
          onChange={(value) => handleChange("financialStatus", value)}
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
