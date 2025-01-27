import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setStep } from "../../../store/slices/profile.slice";
import SelectInput from "../../forms/SelectInput";
import AuthInput from "../../forms/AuthInput";
import Button from "../../common/Button";
import { COLORS } from "../../../constants/colors";
import {
  maritalStatuses,
  religiousCommitment,
} from "../../../constants/options";

export default function LifestyleStep() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.profile);

  const handleNext = () => {
    dispatch(setStep(5));
  };

  const handleBack = () => {
    dispatch(setStep(3));
  };

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SelectInput
          label="Marital Status"
          value={data.maritalStatus}
          options={maritalStatuses}
          onChange={(value) => handleChange("maritalStatus", value)}
        />

        <SelectInput
          label="Religious Commitment"
          value={data.religiousCommitment}
          options={religiousCommitment[data.gender] || religiousCommitment.male}
          onChange={(value) => handleChange("religiousCommitment", value)}
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
