import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setStep } from "../../../store/slices/profile.slice";
import SelectInput from "../../forms/SelectInput";
import Button from "../../common/Button";
import { COLORS } from "../../../constants/colors";
import {
  heights,
  weights,
  skinTones,
  hairColors,
} from "../../../constants/options";

export default function PhysicalAttributesStep() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.profile);

  const handleNext = () => {
    dispatch(setStep(4));
  };

  const handleBack = () => {
    dispatch(setStep(2));
  };

  const handleChange = (field, value) => {
    dispatch(updateField({ field, value }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <SelectInput
          label="Height"
          value={data.height}
          options={heights}
          onChange={(value) => handleChange("height", value)}
        />

        <SelectInput
          label="Weight"
          value={data.weight}
          options={weights}
          onChange={(value) => handleChange("weight", value)}
        />

        <SelectInput
          label="Skin Tone"
          value={data.skinTone}
          options={skinTones}
          onChange={(value) => handleChange("skinTone", value)}
        />

        <SelectInput
          label="Hair Color"
          value={data.hairColor}
          options={hairColors}
          onChange={(value) => handleChange("hairColor", value)}
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
